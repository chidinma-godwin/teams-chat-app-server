import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
require('dotenv').config();

import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true, 
    context: {
        models,
        user: {
            id: 1
        }
    }
});

server.applyMiddleware({ app });

const port = process.env.PORT || 5000

models.sequelize.sync().then(() => app.listen(port, () => 
console.log(`Server is listening on port: http://localhost:${port}`)));


