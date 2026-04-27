const http = require('http');

const testCases = [
    {
        name: 'Short Name',
        data: { name: 'A', email: 'test@test.com', password: 'FitPulse@2026', age: 25, height: 175, weight: 70 },
        expected: 'Name must be at least 2 characters'
    },
    {
        name: 'Invalid Email',
        data: { name: 'Test User', email: 'invalid', password: 'FitPulse@2026', age: 25, height: 175, weight: 70 },
        expected: 'Invalid email format'
    },
    {
        name: 'Weak Password',
        data: { name: 'Test User', email: 'test@test.com', password: 'password123', age: 25, height: 175, weight: 70 },
        expected: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    },
    {
        name: 'Age Out of Range',
        data: { name: 'Test User', email: 'test@test.com', password: 'FitPulse@2026', age: 5, height: 175, weight: 70 },
        expected: 'Age must be between 13 and 120'
    },
    {
        name: 'Height Out of Range',
        data: { name: 'Test User', email: 'test@test.com', password: 'FitPulse@2026', age: 25, height: 400, weight: 70 },
        expected: 'Height must be between 50 and 300 cm'
    },
    {
        name: 'Weight Out of Range',
        data: { name: 'Test User', email: 'test@test.com', password: 'FitPulse@2026', age: 25, height: 175, weight: 10 },
        expected: 'Weight must be between 30 and 500 kg'
    },
    {
        name: 'Existing Email',
        data: { name: 'Duplicate User', email: 'valid@test.com', password: 'FitPulse@2026', age: 25, height: 175, weight: 70 },
        expected: 'Email already exists'
    },
    {
        name: 'Existing Phone Number',
        data: { name: 'Duplicate Phone', email: 'unique@test.com', password: 'FitPulse@2026', age: 25, height: 175, weight: 70, phoneNumber: '1234567890' },
        expected: 'Phone number already exists'
    }
];

async function runTests() {
    for (const test of testCases) {
        console.log(`Running test: ${test.name}`);
        const result = await postData(test.data);
        if (result.message === test.expected) {
            console.log(`✅ Passed: Received expected error "${test.expected}"`);
        } else {
            console.log(`❌ Failed: Expected "${test.expected}", but got "${result.message}"`);
        }
    }
}

function postData(data) {
    return new Promise((resolve) => {
        const jsonData = JSON.stringify(data);
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/api/users',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': jsonData.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve({ message: 'Error parsing response', body });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ message: 'Request error', error: error.message });
        });

        req.write(jsonData);
        req.end();
    });
}

runTests();
