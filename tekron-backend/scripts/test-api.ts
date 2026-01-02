import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// ANSI Colors
const COLORS = {
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    CYAN: '\x1b[36m',
    RESET: '\x1b[0m'
};

const logPass = (msg: string) => console.log(`${COLORS.GREEN}✓ PASS:${COLORS.RESET} ${msg}`);
const logFail = (msg: string, error?: any) => {
    console.log(`${COLORS.RED}✗ FAIL:${COLORS.RESET} ${msg}`);
    if (error && error.response) {
        console.log(`  -> Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error) {
        console.log(`  -> Error: ${error.message}`);
    }
};
const logInfo = (msg: string) => console.log(`${COLORS.CYAN}ℹ INFO:${COLORS.RESET} ${msg}`);

let stats = {
    total: 0,
    passed: 0,
    failed: 0
};

const runTest = async (name: string, fn: () => Promise<void>) => {
    stats.total++;
    try {
        await fn();
        stats.passed++;
    } catch (e: any) {
        stats.failed++;
        // Error logging is handled inside the test steps if specific, 
        // but if it blows up here:
        if (!e.logged) logFail(`${name} - Unexpected Error`, e);
    }
};

const assertStatus = (res: any, status: number) => {
    if (res.status !== status) {
        throw { message: `Expected status ${status}, got ${res.status}`, response: res };
    }
};

const assertForbidden = (error: any) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        return; // Pass
    }
    throw { message: `Expected 403/401, got ${error.response ? error.response.status : error.message}`, response: error.response };
};

async function main() {
    console.log(`${COLORS.YELLOW}🚀 Starting API Health Check at ${BASE_URL}${COLORS.RESET}\n`);

    // 0. Check Server Health
    try {
        await axios.get(`${BASE_URL}/`);
        logPass('Server is reachable');
    } catch (e) {
        logFail('Server is NOT reachable. Is it running?');
        process.exit(1);
    }

    // 1. Authentication
    let superToken = '';
    let adminToken = '';
    let userToken = '';

    console.log(`\n${COLORS.YELLOW}--- 1. Authentication ---${COLORS.RESET}`);

    // SuperAdmin Login
    await runTest('Login SuperAdmin', async () => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'arpitsarang@gmail.com',
                password: 'ArpitSarang'
            });
            superToken = res.data.token;
            if (!superToken) throw new Error('No token returned');
            logPass('Login SuperAdmin');
        } catch (e) {
            logFail('Login SuperAdmin', e);
            throw { ...e, logged: true };
        }
    });

    // Admin Login
    await runTest('Login Admin', async () => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin1@tekron.com',
                password: 'AdminPass123!'
            });
            adminToken = res.data.token;
            if (!adminToken) throw new Error('No token returned');
            logPass('Login Admin');
        } catch (e) {
            logFail('Login Admin', e);
            throw { ...e, logged: true };
        }
    });

    // Participant Login
    await runTest('Login Participant', async () => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'testuser@tekron.com',
                password: 'TestPass123!'
            });
            userToken = res.data.token;
            if (!userToken) throw new Error('No token returned');
            logPass('Login Participant');
        } catch (e) {
            logFail('Login Participant', e);
            throw { ...e, logged: true };
        }
    });

    if (!superToken || !adminToken || !userToken) {
        console.error(`${COLORS.RED}⛔ Aborting: Could not get all tokens.${COLORS.RESET}`);
        process.exit(1);
    }

    // 2. Route Tests
    const superAuth = { headers: { Authorization: `Bearer ${superToken}` } };
    const adminAuth = { headers: { Authorization: `Bearer ${adminToken}` } };
    const userAuth = { headers: { Authorization: `Bearer ${userToken}` } };

    console.log(`\n${COLORS.YELLOW}--- 2. Route Tests ---${COLORS.RESET}`);

    // A. SuperAdmin Tests
    console.log(`\n${COLORS.CYAN}[SuperAdmin Permissions]${COLORS.RESET}`);
    await runTest('POST /superadmin/create-admin', async () => {
        try {
            // Need unique email
            const email = `admin_${Date.now()}@tekron.com`;
            const res = await axios.post(`${BASE_URL}/superadmin/create-admin`, {
                email,
                name: 'Auto Test Admin',
                password: 'password123'
            }, superAuth);
            assertStatus(res, 201); // or 200
            logPass('POST /superadmin/create-admin');
        } catch (e) {
            logFail('POST /superadmin/create-admin', e);
            throw { ...e, logged: true };
        }
    });

    await runTest('GET /superadmin/badges', async () => {
        try {
            const res = await axios.get(`${BASE_URL}/superadmin/badges`, superAuth);
            assertStatus(res, 200);
            logPass('GET /superadmin/badges');
        } catch (e) {
            logFail('GET /superadmin/badges', e);
            throw { ...e, logged: true };
        }
    });

    // B. Admin Tests
    console.log(`\n${COLORS.CYAN}[Admin Permissions]${COLORS.RESET}`);
    await runTest('GET /admin/participants', async () => {
        try {
            const res = await axios.get(`${BASE_URL}/admin/participants`, adminAuth);
            assertStatus(res, 200);
            logPass('GET /admin/participants');
        } catch (e) {
            logFail('GET /admin/participants', e);
            throw { ...e, logged: true };
        }
    });

    await runTest('POST /superadmin/badges (Forbidden Check)', async () => {
        try {
            await axios.post(`${BASE_URL}/superadmin/badges`, {
                name: 'HackerBadge',
                type: 'winner'
            }, adminAuth);
            logFail('POST /superadmin/badges SHOULD have failed (403)');
            throw { message: 'Did not receive 403', logged: true };
        } catch (e: any) {
            try {
                assertForbidden(e);
                logPass('POST /superadmin/badges (Correctly Forbidden)');
            } catch (inner) {
                logFail('POST /superadmin/badges', e);
                throw { ...e, logged: true };
            }
        }
    });

    // C. Participant Tests
    console.log(`\n${COLORS.CYAN}[Participant Permissions]${COLORS.RESET}`);
    await runTest('GET /participant/me', async () => {
        try {
            const res = await axios.get(`${BASE_URL}/participant/me`, userAuth);
            assertStatus(res, 200);
            logPass('GET /participant/me');
        } catch (e) {
            logFail('GET /participant/me', e);
            throw { ...e, logged: true };
        }
    });

    await runTest('GET /admin/participants (Forbidden Check)', async () => {
        try {
            await axios.get(`${BASE_URL}/admin/participants`, userAuth);
            logFail('GET /admin/participants SHOULD have failed');
            throw { message: 'Did not receive 403', logged: true };
        } catch (e: any) {
            try {
                assertForbidden(e);
                logPass('GET /admin/participants (Correctly Forbidden)');
            } catch (inner) {
                logFail('GET /admin/participants', e);
                throw { ...e, logged: true };
            }
        }
    });

    // D. Public Tests
    console.log(`\n${COLORS.CYAN}[Public Tests]${COLORS.RESET}`);
    await runTest('GET /events/live', async () => {
        try {
            // Note: If /events/live is not mounted, this will fail 404
            const res = await axios.get(`${BASE_URL}/events/live`);
            assertStatus(res, 200);
            logPass('GET /events/live');
        } catch (e) {
            // For debugging context
            logFail('GET /events/live', e);
            throw { ...e, logged: true };
        }
    });

    // Summary
    console.log(`\n${COLORS.YELLOW}--- Summary ---${COLORS.RESET}`);
    console.log(`Total Tests: ${stats.total}`);
    console.log(`${COLORS.GREEN}Passed:      ${stats.passed}${COLORS.RESET}`);
    const failColor = stats.failed > 0 ? COLORS.RED : COLORS.GREEN;
    console.log(`${failColor}Failed:      ${stats.failed}${COLORS.RESET}`);

    if (stats.failed > 0) process.exit(1);
    process.exit(0);
}

main();
