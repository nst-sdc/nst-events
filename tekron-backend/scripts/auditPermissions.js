require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function main() {
    console.log('Starting Permission Audit...');

    // 1. Setup Test Users
    console.log('Setting up test users...');
    const password = await bcrypt.hash('password', 10);

    // SuperAdmin
    await prisma.superAdmin.upsert({
        where: { email: 'superadmin@superadmin.com' },
        update: { password },
        create: { email: 'superadmin@superadmin.com', name: 'Super Admin', password }
    });

    // Admin
    await prisma.admin.upsert({
        where: { email: 'admin@admin.com' },
        update: { password },
        create: { email: 'admin@admin.com', name: 'Admin', password }
    });

    // Approved Participant
    await prisma.participant.upsert({
        where: { email: 'approved@example.com' },
        update: { password, approved: true },
        create: { email: 'approved@example.com', name: 'Approved User', password, approved: true }
    });

    // Unapproved Participant
    await prisma.participant.upsert({
        where: { email: 'unapproved@example.com' },
        update: { password, approved: false },
        create: { email: 'unapproved@example.com', name: 'Unapproved User', password, approved: false }
    });

    console.log('Test users setup complete.');

    // 2. Login and Get Tokens
    const tokens = {};
    const roles = ['superadmin', 'admin', 'approved', 'unapproved'];
    const emails = {
        superadmin: 'superadmin@superadmin.com',
        admin: 'admin@admin.com',
        approved: 'approved@example.com',
        unapproved: 'unapproved@example.com'
    };

    for (const role of roles) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emails[role], password: 'password' })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(`Failed to login as ${role}:`, data);
            process.exit(1);
        }
        tokens[role] = data.token;
        console.log(`Logged in as ${role}`);
    }

    // 3. Define Test Cases
    const tests = [
        // Participant Routes
        { role: 'unapproved', method: 'GET', path: '/participant/qr', expected: 200 },
        { role: 'unapproved', method: 'GET', path: '/participant/unapproved-map', expected: 200 },
        { role: 'unapproved', method: 'GET', path: '/participant/events', expected: 403 }, // Unapproved -> Forbidden
        { role: 'approved', method: 'GET', path: '/participant/events', expected: 200 },
        { role: 'admin', method: 'GET', path: '/participant/events', expected: 403 }, // Admin -> Participant Route (Strict)

        // Admin Routes
        { role: 'unapproved', method: 'GET', path: '/admin/participants', expected: 403 },
        { role: 'approved', method: 'GET', path: '/admin/participants', expected: 403 },
        { role: 'admin', method: 'GET', path: '/admin/participants', expected: 200 },
        { role: 'superadmin', method: 'GET', path: '/admin/participants', expected: 403 }, // SuperAdmin -> Admin Route (Strict)

        // SuperAdmin Routes
        { role: 'admin', method: 'GET', path: '/superadmin/admins', expected: 403 },
        { role: 'superadmin', method: 'GET', path: '/superadmin/admins', expected: 200 },
    ];

    // 4. Run Tests
    console.log('\nRunning Tests...');
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const response = await fetch(`${BASE_URL}${test.path}`, {
            method: test.method,
            headers: { 'Authorization': `Bearer ${tokens[test.role]}` }
        });

        const status = response.status;
        const success = status === test.expected;

        if (success) {
            console.log(`✅ [PASS] ${test.role} -> ${test.method} ${test.path} (Got ${status})`);
            passed++;
        } else {
            console.log(`❌ [FAIL] ${test.role} -> ${test.method} ${test.path} (Expected ${test.expected}, Got ${status})`);
            failed++;
        }
    }

    console.log(`\nAudit Complete. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) process.exit(1);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
