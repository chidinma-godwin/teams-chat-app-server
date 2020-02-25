import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
require('dotenv').config();

import typeDefs from './typeDef';
import resolvers from './resolver';

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
});

server.applyMiddleware({ app });

const port = process.env.PORT || 5000

app.listen(port, ()=> console.log(`Server is listening on port: http://localhost:${port}`));
