import { ApolloServer } from "apollo-server";
import { context } from "./context";
import { schema } from "./schema";

export const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return { ...context, req };
  },
});
