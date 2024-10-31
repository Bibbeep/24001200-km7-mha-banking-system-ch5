const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            identityType,
            identityNumber,
            address
        } = req.body;

        const validEmail = email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        if (!validEmail) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid email'
            });
        }

        const existUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existUser) {
            return res.status(400).json({
                status: 'Error',
                message: 'Email already exist'
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const {
            id,
            name: userName,
            email: userEmail
        } = await prisma.user.create({
            data: {
                name,
                email,
                password: encryptedPassword,
                profile: {
                    create: {
                        identityType,
                        identityNumber,
                        address
                    }
                }
            }
        });
        
        return res.status(201).json({
            status: 'Success',
            message: `User ${name} is successfully created!`,
            data: {
                id,
                name: userName,
                email: userEmail
            }
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to create user'
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        
        if (users.length === 0) {
            return res.status(200).json({
                status: 'Success',
                message: 'Users is empty',
                data: []
            });
        }
    
        return res.status(200).json({
            status: 'Success',
            data: users
        });
    } catch (e) {
        // console.error(e);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to get all user data'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
    
        // Assuming id is an auto-increment integer, not a uuid string
        if (isNaN(parseInt(id))) {
            return res.status(400).json({
                status: 'Error',
                message: 'User ID must be a valid number'
            });
        }
    
        const userData = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        
        if (!userData) {
            return res.status(404).json({
                status: 'Error',
                message: 'User not found!'
            });
        }

        const profileData = await prisma.profile.findUnique({
            where: {
                userId: parseInt(id)
            },
            select: {
                identityType: true,
                identityNumber: true,
                address: true
            }
        });
    
        return res.status(200).json({
            status: 'Success',
            data: { ...userData, ...profileData }
        });
    } catch (e) {
        // console.error(e);
        
        return res.status(500).json({
            status: 'Error',
            message: 'Failed to get user data'
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById
};