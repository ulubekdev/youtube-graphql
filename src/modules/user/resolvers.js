import { finished } from 'stream/promises';
import JWT from '#utils/jwt';
import sha256 from 'sha256';
import path from 'path';
import fs from 'fs';
import model from './model.js';
import { USER_CONFIG } from '#config/index';
import ip from '#utils/getIp';

export default {
    Query: {
        users: async(_, { pagination }) => {
            let users = await model.getUsers({ 
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE, 
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT 
            });
            return users;
        },
        user: (_, args) => {
            return model.getUser(args);
        }
    },

    User: {
        userId: global => global.userid,
        image: global => `http://${ip({ internal: false })}:5000/${global.image}`
    },

    Mutation: {
        login: async(_, { username, password }, { agent }) => {
            let user = await model.getUser({ username });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.password !== sha256(password)) {
                throw new Error('Password is incorrect');
            }
            return {
                status: 200,
                message: 'Login success',
                data: {
                    userid: user.userid,
                    username: user.username,
                    password: user.password,
                    image: user.image,  
                },
                token: JWT.sign({
                    userId: user.userid,
                    agent
                })
            };
        },
        register: async (_, { username, password, image }, { agent }) => {
            const { createReadStream, filename, mimetype } = await image;
            const fileName = Date.now() + filename.replace(/\s/g, '');
            username = username.trim();
            password = password.trim(); 

            const user = await model.getUser({ username });
            if (user) {
                throw new Error('Username already exists');
            }
            if([
                'image/jpeg',
                'image/png',
                'image/jpg'
            ].includes(mimetype)) {
                throw new Error('Image type is not supported');
            }

            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', 'images', fileName));
            createReadStream().pipe(out)
            await finished(out)
            

            const hash = sha256(password);
            const userData = {
                username,
                password: hash,
                image: fileName
            };
            const newUser = await model.register(userData);
            return {
                status: 201,
                message: 'User created successfully',
                data: newUser,
                token: JWT.sign({
                    userId: newUser.userid,
                    agent
                }),
            }
        }
    }
}