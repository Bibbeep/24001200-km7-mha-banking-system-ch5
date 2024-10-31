const request = require('supertest');
const app = require('../server');

describe('Endpoint Integration Tests /api/v1/users', () => {
    test('GET /api/v1/users with empty users data and 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/users');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Users is empty');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(0);
    });

    test('POST /api/v1/users with 201 success status', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@mail.com',
            password: 'johndoe123',
            identityType: "KTP",
            identityNumber: "6171050808080005",
            address: "Jl. Jalan, Gg. Gang, No. 11"
        };

        const response = await request(app)
            .post('/api/v1/users')
            .send(user);
        
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe(`User ${user.name} is successfully created!`);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name', user.name);
        expect(response.body.data).toHaveProperty('email', user.email);

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.name).not.toBeNull();
        expect(response.body.data.email).not.toBeNull();
    });

    test('POST /api/v1/users with 201 success status (2)', async () => {
        const user = {
            name: 'Kathy Joannet',
            email: 'kjoannet0@godaddy.com',
            password: 'tJ5=2+@.&92k@,L',
            identityType: "SIM",
            identityNumber: "2517309437874406",
            address: "325 Bartillon Way"
        };

        const response = await request(app)
            .post('/api/v1/users')
            .send(user);
        
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe(`User ${user.name} is successfully created!`);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name', user.name);
        expect(response.body.data).toHaveProperty('email', user.email);

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.name).not.toBeNull();
        expect(response.body.data.email).not.toBeNull();
    });

    test('POST /api/v1/users with invalid email and 400 error status', async () => {
        const user = {
            name: 'John Widodo',
            email: 'johnwidodo.com',
            password: 'p4ssw0rd',
            identityType: "KTP",
            identityNumber: "392188132902138",
            address: "Jl. Ampera"
        };

        const response = await request(app)
            .post('/api/v1/users')
            .send(user);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Invalid email');
    });

    test('POST /api/v1/users with existed email and 400 error status', async () => {
        const user = {
            name: 'Doedoe Jawn',
            email: 'johndoe@mail.com',
            password: 'crackthspw',
            identityType: "SIM",
            identityNumber: "201387132807132",
            address: "Jl. Jalan, Gg. Gang, No. 12"
        };

        const response = await request(app)
            .post('/api/v1/users')
            .send(user);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Email already exist');
    });

    test('POST /api/v1/users with invalid input type and 500 error status by triggering database error', async () => {
        const user = {
            name: 'Doedoe Jawn',
            email: 'johndoe123@gmail.com',
            password: 'crackthspw',
            identityType: "SIM",
            identityNumber: 12345678,
            address: 90009
        };

        const response = await request(app)
            .post('/api/v1/users')
            .send(user);
        
        expect(response.status).toBe(500);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Failed to create user');
    });

    test('GET /api/v1/users with 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/users');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.data).toBeInstanceOf(Array);

        response.body.data.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');

            expect(user.id).not.toBeNull();
            expect(user.name).not.toBeNull();
            expect(user.email).not.toBeNull();
        });
    });

    test('GET /api/v1/users/:id with 200 success status', async () => {
        const id = 1;
        const response = await request(app)
            .get(`/api/v1/users/${id}`);
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('identityType');
        expect(response.body.data).toHaveProperty('identityNumber');
        expect(response.body.data).toHaveProperty('address');

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.name).not.toBeNull();
        expect(response.body.data.email).not.toBeNull();
        expect(response.body.data.identityType).not.toBeNull();
        expect(response.body.data.identityNumber).not.toBeNull();
        expect(response.body.data.address).not.toBeNull();
    });

    test('GET /api/v1/users/:id with invalid id and 400 error status', async () => {
        const id = 'abc';
        const response = await request(app)
            .get(`/api/v1/users/${id}`);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('User ID must be a valid number');
    });

    test('GET /api/v1/users/:id with unexisting id and 404 error status', async () => {
        const id = 70;
        const response = await request(app)
            .get(`/api/v1/users/${id}`);
        
        expect(response.status).toBe(404);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('User not found!');
    });
});

describe('Endpoint Integration Tests /api/v1/accounts', () => {
    test('GET /api/v1/accounts with empty accounts and 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/accounts');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Accounts is empty');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(0);
    });

    test('POST /api/v1/accounts with 201 success status', async () => {
        const account = {
            userId: 1,
            bankName: 'BCA',
            bankAccountNumber: '2318792138671238',
            balance: 1500000
        };

        const response = await request(app)
            .post('/api/v1/accounts')
            .send(account);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe(`New bank account with account number ${account.bankAccountNumber} has successfully added to user with id ${account.userId}`);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userId', account.userId);
        expect(response.body.data).toHaveProperty('bankName', account.bankName);
        expect(response.body.data).toHaveProperty('bankAccountNumber', account.bankAccountNumber);
        expect(response.body.data).toHaveProperty('balance', account.balance);
    });
    
    test('POST /api/v1/accounts with 201 success status (2)', async () => {
        const account = {
            userId: 2,
            bankName: 'Mandiri',
            bankAccountNumber: '21893213863512',
            balance: 1000000
        };
        
        const response = await request(app)
        .post('/api/v1/accounts')
        .send(account);
        
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe(`New bank account with account number ${account.bankAccountNumber} has successfully added to user with id ${account.userId}`);
        
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userId', account.userId);
        expect(response.body.data).toHaveProperty('bankName', account.bankName);
        expect(response.body.data).toHaveProperty('bankAccountNumber', account.bankAccountNumber);
        expect(response.body.data).toHaveProperty('balance', account.balance);
    });

    test('POST /api/v1/accounts with invalid id and 400 error status', async () => {
        const account = {
            userId: 'abc',
            bankName: 'BCA',
            bankAccountNumber: '72317812681',
            balance: 2000000
        };

        const response = await request(app)
            .post('/api/v1/accounts')
            .send(account);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('User ID must be a valid number');
    });

    test('POST /api/v1/accounts with invalid balance and 400 error status', async () => {
        const account = {
            userId: 1,
            bankName: 'BCA',
            bankAccountNumber: '72317812681',
            balance: 'ABC'
        };

        const response = await request(app)
            .post('/api/v1/accounts')
            .send(account);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Balance must be a number');
    });

    test('POST /api/v1/accounts with non-existing userId and 404 error status', async () => {
        const account = {
            userId: 70,
            bankName: 'BCA',
            bankAccountNumber: '72317812681',
            balance: 7000000
        };

        const response = await request(app)
            .post('/api/v1/accounts')
            .send(account);

        expect(response.status).toBe(404);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('User ID does not exist');
    });

    test('POST /api/v1/accounts with existing bankAccount and 400 error status', async () => {
        const account = {
            userId: 1,
            bankName: 'BCA',
            bankAccountNumber: '21893213863512',
            balance: 15000000
        };

        const response = await request(app)
            .post('/api/v1/accounts')
            .send(account);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Bank account already exist');
    });

    test('POST /api/v1/accounts with invalid bankName and 500 error status', async () => {
        const account = {
            userId: 2,
            bankName: 123,
            bankAccountNumber: '281939321812',
            balance: 2000000
        };

        const response = await request(app)
            .post('/api/v1/accounts')
            .send(account);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Failed to create a new account');
    });

    test('GET /api/v1/accounts with 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/accounts');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.data).toBeInstanceOf(Array);

        response.body.data.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('userId');
            expect(user).toHaveProperty('bankName');
            expect(user).toHaveProperty('bankAccountNumber');
            expect(user).toHaveProperty('balance');
            
            expect(user.id).not.toBeNull();
            expect(user.userId).not.toBeNull();
            expect(user.bankName).not.toBeNull();
            expect(user.bankAccountNumber).not.toBeNull();
            expect(user.balance).not.toBeNull();
        });
    });

    test('GET /api/v1/accounts/:id with 200 success status', async () => {
        const id = 1;
        const response = await request(app)
            .get(`/api/v1/accounts/${id}`);
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userId');
        expect(response.body.data).toHaveProperty('bankName');
        expect(response.body.data).toHaveProperty('bankAccountNumber');
        expect(response.body.data).toHaveProperty('balance');

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.userId).not.toBeNull();
        expect(response.body.data.bankName).not.toBeNull();
        expect(response.body.data.bankAccountNumber).not.toBeNull();
        expect(response.body.data.balance).not.toBeNull();
    });

    test('GET /api/v1/accounts/:id with invalid id and 400 error status', async () => {
        const id = 'error';
        const response = await request(app)
            .get(`/api/v1/accounts/${id}`);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Account ID must be a valid number');
    });

    test('GET /api/v1/accounts/:id with non-existing bank account and 404 error status', async () => {
        const id = 70;
        const response = await request(app)
            .get(`/api/v1/accounts/${id}`);
        
        expect(response.status).toBe(404);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Bank account does not exist');
    });
});

describe('Endpoint Integration Tests /api/v1/transactions', () => {
    test('GET /api/v1/transactions with empty transactions and 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/transactions');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Transactions is empty');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(0);
    });

    test('POST /api/v1/transactions with 201 success status', async () => {
        const transaction = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: 250000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe(`Successfully transferred ${transaction.amount} from bank account with id ${transaction.sourceAccountId} to bank account with id ${transaction.destinationAccountId}`);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('sourceAccountId', transaction.sourceAccountId);
        expect(response.body.data).toHaveProperty('destinationAccountId', transaction.destinationAccountId);
        expect(response.body.data).toHaveProperty('amount', transaction.amount);
    });

    test('POST /api/v1/transactions with invalid sourceAccountId and 400 error status', async () => {
        const transaction = {
            sourceAccountId: 'string',
            destinationAccountId: 2,
            amount: 100000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Source account ID must be a valid ID');
    });

    test('POST /api/v1/transactions with invalid destinationAccountId and 400 error status', async () => {
        const transaction = {
            sourceAccountId: 1,
            destinationAccountId: 'notnumber',
            amount: 50000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Destination account ID must be a valid ID');
    });

    test('POST /api/v1/transactions with invalid amount type and 400 error status', async () => {
        const transaction = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: 'qwerty'
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Transaction amount must be a valid number');
    });

    test('POST /api/v1/transactions with invalid amount and 400 error status', async () => {
        const transaction = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: -9000000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Transaction amount must be a valid number');
    });

    test('POST /api/v1/transactions with non-existing source bank account and 404 error status', async () => {
        const transaction = {
            sourceAccountId: 65,
            destinationAccountId: 2,
            amount: 400000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(404);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Source bank account does not exist');
    });

    test('POST /api/v1/transactions with non-existing destination bank account and 404 error status', async () => {
        const transaction = {
            sourceAccountId: 1,
            destinationAccountId: 75,
            amount: 10000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(404);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Destination bank account does not exist');
    });
    
    test('POST /api/v1/transactions with insufficient source bank account balance and 400 error status', async () => {
        const transaction = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: 50000000
        };

        const response = await request(app)
            .post('/api/v1/transactions')
            .send(transaction);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Source bank account does not have sufficient balance');
    });

    test('GET /api/v1/transactions with 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/transactions');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.data).toBeInstanceOf(Array);

        response.body.data.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('sourceAccountId');
            expect(user).toHaveProperty('destinationAccountId');
            expect(user).toHaveProperty('amount');

            expect(user.id).not.toBeNull();
            expect(user.sourceAccountId).not.toBeNull();
            expect(user.destinationAccountId).not.toBeNull();
            expect(user.amount).not.toBeNull();
        });
    });

    test('GET /api/v1/transactions/:id with 200 success status', async () => {
        const id = 1;
        const response = await request(app)
            .get(`/api/v1/transactions/${id}`);
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('sourceAccountId');
        expect(response.body.data).toHaveProperty('destinationAccountId');
        expect(response.body.data).toHaveProperty('amount');

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.sourceAccountId).not.toBeNull();
        expect(response.body.data.destinationAccountId).not.toBeNull();
        expect(response.body.data.amount).not.toBeNull();
    });

    test('GET /api/v1/transactions/:id with invalid id and 400 error status', async () => {
        const id = 'invalidid';
        const response = await request(app)
            .get(`/api/v1/transactions/${id}`);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Transaction ID must be a valid number');
    });

    test('GET /api/v1/transactions/:id with non-existing transaction and 404 error status', async () => {
        const id = 54;
        const response = await request(app)
            .get(`/api/v1/transactions/${id}`);
        
        expect(response.status).toBe(404);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Transaction does not exist');
    });
});

describe('Endpoint Integration Test api/v1/auth', () => {
    test('POST /api/v1/auth/register with 201 success status', async () => {
        const user = {
            name: 'Jocelyn Pooly',
            email: 'jpooly3@un.org',
            password: 'xB8%UXu#H|qLz',
            identityType: 'KTP',
            identityNumber: '5602216257665524',
            address: '5080 Maywood Place'
        };

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(user);
        
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe(`User ${user.name} is successfully created!`);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name', user.name);
        expect(response.body.data).toHaveProperty('email', user.email);

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.name).not.toBeNull();
        expect(response.body.data.email).not.toBeNull();
    });

    test('POST /api/v1/auth/register with invalid email and 400 error status', async () => {
        const user = {
            name: 'Wade Wilson',
            email: 'deadpoolaintdead@',
            password: 'charlesxav13r',
            identityType: 'SIM',
            identityNumber: '21982317123',
            address: 'Jl. Purnama, No. 24'
        };

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(user);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Invalid email');
    });

    test('POST /api/v1/auth/register with existing email and 400 error status', async () => {
        const user = {
            name: 'Logan',
            email: 'jpooly3@un.org',
            password: 'charlesxav13r',
            identityType: 'SIM',
            identityNumber: '21982317123',
            address: 'Jl. Purnama, No. 24'
        };

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(user);
        
        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Email already exist');
    });

    test('POST /api/v1/auth/register with invalid identityType and 500 error status', async () => {
        const user = {
            name: 'Storm',
            email: 'wsgdsajghasd@xmen.uk',
            password: 'pr0f3ss0rX',
            identityType: 123,
            identityNumber: '71236132123',
            address: 'Jl. Baker, 221B'
        };

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(user);
        
        expect(response.status).toBe(500);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Failed to create user');
    });

    let accessToken;
    test('POST /api/v1/auth/login with 200 success status', async () => {
        const credentials = {
            email: 'jpooly3@un.org',
            password: 'xB8%UXu#H|qLz'
        };

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Successfully logged in');

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email', credentials.email);
        expect(response.body.data).toHaveProperty('accessToken');

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.name).not.toBeNull();
        expect(response.body.data.email).not.toBeNull();
        expect(response.body.data.accessToken).not.toBeNull();

        accessToken = response.body.data.accessToken;
    });

    test('POST /api/v1/auth/login with invalid email format and 400 error status', async () => {
        const credentials = {
            email: 'awokwokwok.com',
            password: '72e178&*1GHW17*&!'
        };

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send(credentials);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Invalid email format');
    });

    test('POST /api/v1/auth/login with unregistered email and 400 error status', async () => {
        const credentials = {
            email: 'hulk@avengers.com',
            password: '34rthm1ght13sth3r0'
        };

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send(credentials);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Invalid email or password');
    });

    test('POST /api/v1/auth/login with wrong password and 400 error status', async () => {
        const credentials = {
            email: 'jpooly3@un.org',
            password: 'wr0ngp4ssw_rd'
        };

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send(credentials);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Invalid email or password');
    });

    test('POST /api/v1/auth/login with invalid password type and 500 error status', async () => {
        const credentials = {
            email: 'jpooly3@un.org',
            password: 12345
        };

        const response = await request(app)
            .post('/api/v1/auth/login')
            .send(credentials);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe('Error');
        expect(response.body.message).toBe('Failed to login');
    });

    test('GET /api/v1/auth/authenticate with 200 success status', async () => {
        const response = await request(app)
            .get('/api/v1/auth/authenticate')
            .set('Authorization', `Bearer ${accessToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Successfully authenticated');

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).toHaveProperty('profile');

        expect(response.body.data.profile).toHaveProperty('id');
        expect(response.body.data.profile).toHaveProperty('identityType');
        expect(response.body.data.profile).toHaveProperty('identityNumber');
        expect(response.body.data.profile).toHaveProperty('address');

        expect(response.body.data.id).not.toBeNull();
        expect(response.body.data.name).not.toBeNull();
        expect(response.body.data.email).not.toBeNull();
        expect(response.body.data.profile).not.toBeNull();

        expect(response.body.data.profile.id).not.toBeNull();
        expect(response.body.data.profile.identityType).not.toBeNull();
        expect(response.body.data.profile.identityNumber).not.toBeNull();
        expect(response.body.data.profile.address).not.toBeNull();
    });

    test('GET /api/v1/auth/authenticate with invalid token and 401 error status', async () => {
        const response = await request(app)
            .get('/api/v1/auth/authenticate')
            .set('Authorization', `Bearer invalidtoken`);
        
        expect(response.statusCode).toBe(401);
        expect(response.res.statusMessage).toBe('Unauthorized');
    });
});