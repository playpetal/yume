/*import { ServerInfo } from "apollo-server";
import { GraphQLClient } from "graphql-request";
import getPort, { makeRange } from "get-port";
import { server } from "../api/server";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { join } from "path";
import { db } from "../api/db";
import { nanoid } from "nanoid";
import { Client } from "pg";

type TestContext = { client: GraphQLClient; db: PrismaClient };

export function createTestContext(): TestContext {
  let ctx = {} as TestContext;
  const prismaCtx = prismaTestContext();
  const graphqlCtx = graphqlTestContext();

  beforeEach(async () => {
    const db = await prismaCtx.before();
    const client = await graphqlCtx.before();

    Object.assign(ctx, { client, db });
  });

  afterEach(async () => {
    await graphqlCtx.after();
    await prismaCtx.after();
  });

  return ctx;
}

function graphqlTestContext() {
  let serverInstance: ServerInfo | null = null;

  return {
    async before() {
      const port = await getPort({ port: makeRange(4000, 6000) });

      serverInstance = await server.listen({ port });
      serverInstance.server.on("close", async () => {
        db.$disconnect();
      });

      return new GraphQLClient(`http://localhost:${port}`);
    },
    async after() {
      serverInstance?.server.close();
    },
  };
}

function prismaTestContext() {
  const prismaBinary = join(__dirname, "..", "node_modules", ".bin", "prisma");
  let schema = "";
  let databaseUrl = "";
  let prismaClient: null | PrismaClient = null;

  return {
    async before() {
      schema = `test_${nanoid()}`;
      databaseUrl = `postgres://postgres:superuser@localhost:5432/myapp?schema=${schema}`;

      process.env.DATABASE_URL = databaseUrl;

      execSync(`${prismaBinary} migrate deploy`, {
        env: { ...process.env, DATABASE_URL: databaseUrl },
      });

      prismaClient = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
      });

      return prismaClient;
    },
    async after() {
      const client = new Client({ connectionString: databaseUrl });

      await client.connect();
      await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
      await client.end();

      await prismaClient?.$disconnect();
    },
  };
}
*/
