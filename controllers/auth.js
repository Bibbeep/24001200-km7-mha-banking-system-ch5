const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const register = async (req, res) => {
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validEmail = email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    
        if (!validEmail) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid email format'
            });
        }
    
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid email or password'
            });
        }
    
        const userPayload = {
            id: user.id,
            name: user.name,
            email: user.email
        };
    
        const accessToken = jwt.sign(userPayload, JWT_SECRET_KEY);
    
        return res.status(200).json({
            status: 'Success',
            message: 'Successfully logged in',
            data: {
                ...userPayload,
                accessToken
            }
        });
    } catch (e) {
        // console.error(err);

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to login'
        });
    }
};

const authUser = async (payload, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            },
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        id: true,
                        identityType: true,
                        identityNumber: true,
                        address: true
                    }
                }
            }
        });

        if (!user) {
            return done(null, false, { message: 'Unauthorized' });
        }

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
};

module.exports = {
    register,
    login,
    authUser
};