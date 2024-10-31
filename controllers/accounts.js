const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAccount = async (req, res) => {
    try {
        const {
            userId,
            bankName,
            bankAccountNumber,
            balance
        } = req.body;
    
        if (isNaN(parseInt(userId))) {
            return res.status(400).json({
                status: 'Error',
                message: 'User ID must be a valid number'
            });
        }
    
        if (isNaN(parseFloat(balance))) {
            return res.status(400).json({
                status: 'Error',
                message: 'Balance must be a number'
            });
        }

        const userData = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });

        if (!userData) {
            return res.status(404).json({
                status: 'Error',
                message: 'User ID does not exist'
            });
        }

        const existAccount = await prisma.bankAccount.findUnique({
            where: {
                bankAccountNumber
            }
        });

        if (existAccount) {
            return res.status(400).json({
                status: 'Error',
                message: 'Bank account already exist'
            });
        }

        const accountData = await prisma.bankAccount.create({
            data: {
                userId,
                bankName,
                bankAccountNumber,
                balance: parseFloat(balance),
            }
        });

        return res.status(201).json({
            status: 'Success',
            message: `New bank account with account number ${bankAccountNumber} has successfully added to user with id ${userId}`,
            data : {
                ...accountData
            }
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to create a new account'
        });
    }
};

const getAccounts = async (req, res) => {
    try {
        const accounts = await prisma.bankAccount.findMany();
        if (accounts.length === 0) {
            return res.status(200).json({
                status: 'Success',
                message: 'Accounts is empty',
                data: []
            });
        }
    
        return res.status(200).json({
            status: 'Success',
            data: accounts
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to get all account data'
        });
    }
};

const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
    
        if (isNaN(parseInt(id))) {
            return res.status(400).json({
                status: 'Error',
                message: 'Account ID must be a valid number'
            });
        }

        const accountData = await prisma.bankAccount.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!accountData) {
            return res.status(404).json({
                status: 'Error',
                message: 'Bank account does not exist'
            });
        }

        return res.status(200).json({
            status: 'Success',
            data: accountData
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Failed',
            message: 'Failed to get account data'
        });
    }
};

module.exports = {
    createAccount,
    getAccounts,
    getAccountById
};