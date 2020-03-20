import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
// import crypto from "crypto";
import jwt from "jsonwebtoken";
require("dotenv").config();

import models from "./models";
import { refreshTokens } from "./auth";

// const secret1 = crypto.randomBytes(10).toString("hex");

// const secret2 = crypto.randomBytes(10).toString("hex");

const secret1 = "asafgghdstytdssd";
const secret2 = "gfgdsyyuqwkllsdserrdff";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./typeDefs")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const app = express();

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  // If token exists verify it and add user to request body
  if (token) {
    try {
      const { user } = jwt.verify(token, secret1);
      req.user = user;
      console.log("stale");
    } catch (err) {
      // If unable to verify token, decode and verify refresh token
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        refreshToken,
        models,
        secret1,
        secret2
      );

      console.log("refresh");

      // If refreshToken was verified successfully send it to the client to overwrite the previous token
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token", "x-web-token");
        res.set("x-token", token);
        res.set("x-refresh-token", refreshToken);
      }
      req.user = newTokens.user;
    }
  }

  next();
};

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add the addUser middleware to app
app.use(addUser);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: ({ req }) => ({
    models,
    user: req.user,
    secret1,
    secret2
  })
});

server.applyMiddleware({ app });

const port = process.env.PORT || 5000;

models.sequelize
  .sync()
  .then(() =>
    app.listen(port, () =>
      console.log(`Server is listening on port: http://localhost:${port}`)
    )
  );
