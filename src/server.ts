import express from "express";
import { GraphQLError } from "graphql";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { readFile } from "fs/promises";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { PORT } from "./environment.js";
import { connect } from "./utils/dbConnection.js";
import { resolvers } from "./resolvers/index.js";
import { Authenticate } from "./Auth/Authenticate.js";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefsDir = path.resolve(__dirname, "../", "schema.graphql");

const typeDefs = await readFile(typeDefsDir, "utf-8");

app.use(Authenticate);

const context = async (params: any) => {
  const { req } = params;

  if (req.body && req.body?.auth) {
    const { _id } = req.body.auth;

    const user = await User.findById(_id).select("-password");
    return user ? { user } : { user: false };
  } else return { user: false };
};

const ApolloServerInstance = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  formatError: (err: GraphQLError) => {
    console.log("FormatErrro:: ", err);
    if (err.originalError instanceof AuthenticationError) {
      return new Error("Not Authenticatd.");
    }

    return err;
  },
});

await ApolloServerInstance.start();
ApolloServerInstance.applyMiddleware({ app, path: "/graphql" });

app.listen(PORT, () => {
  connect();
  console.log("server running on port", PORT);
  console.log(`GraphQL server running on http://localhost:${PORT}/graphql`);
});
