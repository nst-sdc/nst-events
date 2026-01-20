const net = require('net');
const tls = require('tls');
const dns = require('dns');
const { promisify } = require('util');
const { exec } = require('child_process');

const NEON_HOST = 'ep-bold-night-ah9wjqbb-pooler.c-3.us-east-1.aws.neon.tech';
const NEON_PORT = 5432;
const LOCAL_PORT = 5433;
const RESOLVER_IP = '8.8.8.8'; // Google DNS

function getRemoteIP() {
    return new Promise((resolve, reject) => {
        exec(`dig @${RESOLVER_IP} +short ${NEON_HOST}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`DNS Resolution Error: ${error.message}`);
                return reject(error);
            }
            const lines = stdout.trim().split('\n');
            const ip = lines[lines.length - 1];
            if (!ip) reject(new Error('No IP found'));
            console.log(`Resolved ${NEON_HOST} to ${ip} via ${RESOLVER_IP}`);
            resolve(ip);
        });
    });
}

async function startProxy() {
    let targetIP;
    try {
        targetIP = await getRemoteIP();
    } catch (e) {
        console.error("Failed to resolve neon host:", e);
        process.exit(1);
    }

    const server = net.createServer((socket) => {
        // Pause socket to prevent data loss before upstream connection is ready
        socket.pause();

        socket.on('error', (err) => console.error('Local socket error:', err.message));

        const client = tls.connect({
            host: targetIP,
            port: NEON_PORT,
            servername: NEON_HOST, // CRITICAL: SNI required for Neon
            rejectUnauthorized: false,
        }, () => {
            // Verify we hit the right server
            const cert = client.getPeerCertificate();
            if (cert && cert.subject) {
                console.log(`Connected to remote. Cert Subject: ${cert.subject.CN}`);
            }

            console.log('Pipe established');
            socket.resume();
            socket.pipe(client);
            client.pipe(socket);
        });

        client.on('error', (err) => {
            console.error('Remote TLS socket error:', err.message);
            socket.end();
        });

        client.on('end', () => socket.end());
    });

    server.listen(LOCAL_PORT, () => {
        console.log(`DB Proxy running on 127.0.0.1:${LOCAL_PORT} -> ${NEON_HOST} (${targetIP})`);
    });
}

startProxy();
