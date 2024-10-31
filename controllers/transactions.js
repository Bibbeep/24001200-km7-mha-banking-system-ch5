const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTransaction = async (req, res) => {
    try {
        const {
            sourceAccountId,
            destinationAccountId,
            amount
        } = req.body;
    
        if (isNaN(parseInt(sourceAccountId))) {
            return res.status(400).json({
                status: 'Error',
                message: 'Source account ID must be a valid ID'
            });
        }
    
        if (isNaN(parseInt(destinationAccountId))) {
            return res.status(400).json({
                status: 'Error',
                message: 'Destination account ID must be a valid ID'
            });
        }
    
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return res.status(400).json({
                status: 'Error',
                message: 'Transaction amount must be a valid number'
            });
        }

        const sourceAccData = await prisma.bankAccount.findUnique({
            where: {
                id: parseInt(sourceAccountId)
            }
        });

        if (!sourceAccData) {
            return res.status(404).json({
                status: 'Error',
                message: 'Source bank account does not exist'
            });
        }
        
        const destAccData = await prisma.bankAccount.findUnique({
            where: {
                id: parseInt(destinationAccountId)
            }
        });

        if (!destAccData) {
            return res.status(404).json({
                status: 'Error',
                message: 'Destination bank account does not exist'
            });
        }

        if (sourceAccData.balance < parseFloat(amount)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Source bank account does not have sufficient balance'
            });
        }

        await prisma.bankAccount.update({
            where: {
                id: sourceAccountId 
            },
            data: {
                balance: sourceAccData.balance - parseFloat(amount)
            }
        });

        await prisma.bankAccount.update({
            where: {
                id: destinationAccountId
            },
            data: {
                balance: destAccData.balance + parseFloat(amount)
            }
        });

        const transactionData = await prisma.transaction.create({
            data: {
                sourceAccountId: sourceAccountId,
                destinationAccountId: destinationAccountId,
                amount: parseFloat(amount)
            }
        });

        return res.status(201).json({
            status: 'Success',
            message: `Successfully transferred ${amount} from bank account with id ${sourceAccountId} to bank account with id ${destinationAccountId}`,
            data: {
                ...transactionData
            }
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to create transaction'
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany();

        if (transactions.length === 0) {
            return res.status(200).json({
                status: 'Success',
                message: 'Transactions is empty',
                data: []
            });
        }
    
        return res.status(200).json({
            status: 'Success',
            data: transactions
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to get all transaction data'
        });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
    
        if (isNaN(parseInt(id))) {
            return res.status(400).json({
                status: 'Error',
                message: 'Transaction ID must be a valid number'
            });
        }

        const transactionData = await prisma.transaction.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!transactionData) {
            return res.status(404).json({
                status: 'Error',
                message: 'Transaction does not exist'
            });
        }

        return res.status(200).json({
            status: 'Success',
            data: transactionData
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to get transaction data'
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById
};