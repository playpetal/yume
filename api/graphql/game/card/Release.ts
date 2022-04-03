import { extendType, list, nonNull, objectType } from "nexus";
import { Release } from "nexus-prisma";
import { auth } from "../../../lib/Auth";

export const ReleaseObject = objectType({
  name: Release.$name,
  description: Release.$description,
  definition(t) {
    t.field(Release.id);
    t.field(Release.droppable);
    t.field("cards", {
      type: nonNull(list(nonNull("CardPrefab"))),
      async resolve(source, _, ctx) {
        return ctx.db.cardPrefab.findMany({ where: { releaseId: source.id } });
      },
    });
  },
});

export const CreateReleaseMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createRelease", {
      type: nonNull("Release"),
      async resolve(_, __, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const release = await ctx.db.release.create({ data: {} });

        return release;
      },
    });
  },
});

export const UpdateReleaseMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateRelease", {
      type: nonNull("Release"),
      args: {
        id: nonNull("Int"),
        droppable: "Boolean",
      },
      async resolve(_, { id, droppable }, ctx) {
        await auth(ctx, { requiredFlags: ["RELEASE_MANAGER"] });

        const release = await ctx.db.release.update({
          where: { id },
          data: { droppable: droppable ?? undefined },
        });

        return release;
      },
    });
  },
});

export const ReleaseQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("release", {
      type: "Release",
      args: { id: nonNull("Int") },
      async resolve(_, { id }, ctx) {
        const release = await ctx.db.release.findFirst({ where: { id } });

        return release;
      },
    });
  },
});

export const LastReleaseQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("lastRelease", {
      type: "Release",
      async resolve(_, __, ctx) {
        const release = await ctx.db.release.findFirst({
          where: { droppable: false },
          orderBy: { id: "desc" },
        });

        return release;
      },
    });
  },
});
