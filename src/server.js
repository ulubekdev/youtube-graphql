import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import queryParser from '#utils/queryParser';
import schema from './modules/index.js';
import ip from '#utils/getIp';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import '#config/index';
import JWT from '#utils/jwt';

!async function () {
    const app = express();
    const httpServer = http.createServer(app);

    app.use(cors({
        origin: '*',
        methods: '*',
        allowedHeaders: '*',
        credentials: true
    }));
    app.use(graphqlUploadExpress({ maxFileSize: 50000000}));
    app.use(express.static(path.join(process.cwd(), 'uploads')));

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        introspection: true,
        context: async ({ req, res }) => {
            const { operation, fieldName } = queryParser(req.body)
            if (fieldName === '__schema') return 
            if ([
                'login',
                'register',
            ].includes(fieldName)) {
                return {
                    req,
                    agent: req.headers['user-agent']
                }
            }

            if(operation === 'query' && fieldName === 'myvideos') {
                const token = req.headers.token;
                if (!token) {
                    throw new Error('No token provided');
                }

                const { userId, agent } = JWT.verify(token);

                if (agent !== req.headers['user-agent']) {
                    throw new Error('You are not authorized');
                }

                return {
                    userId
                };
            }

            if (operation === 'mutation' && fieldName === 'uploadVideo') {
                const token = req.headers.token;
                if (!token) {
                    throw new Error('No token provided');
                }

                const { userId, agent } = JWT.verify(token);

                if (agent !== req.headers['user-agent']) {
                    throw new Error('You are not authorized');
                }

                return {
                    userId
                };
            }

            if (operation === 'mutation' && fieldName === 'deleteVideo') {
                const token = req.headers.token;
                if (!token) {
                    throw new Error('No token provided');
                }

                const { userId, agent } = JWT.verify(token);

                if (agent !== req.headers['user-agent']) {
                    throw new Error('You are not authorized');
                }

                return {
                    userId
                };
            }

            if (operation === 'mutation' && fieldName === 'updateVideo') {
                const token = req.headers.token;
                if (!token) {
                    throw new Error('No token provided');
                }

                const { userId, agent } = JWT.verify(token);

                if (agent !== req.headers['user-agent']) {
                    throw new Error('You are not authorized');
                }

                return {
                    userId
                };
            }
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql'});
    let port = process.env.PORT || 5000;

    await new Promise(resolve => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://${ip({ internal: false })}:${port}${server.graphqlPath}`);
}();