import { makeExecutableSchema } from "@graphql-tools/schema";

import TypesModule from './types/index.js';
import UserModule from './user/index.js';
import VideoModule from './video/index.js';

export default makeExecutableSchema({
    typeDefs: [
        TypesModule.typeDefs,
        UserModule.typeDefs,
        VideoModule.typeDefs,
    ],
    resolvers: [
        TypesModule.resolvers,
        UserModule.resolvers,
        VideoModule.resolvers
    ]
})