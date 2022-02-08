import { extendType, list, nonNull, objectType } from "nexus";
import { Release } from "nexus-prisma";

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
        return ctx.db.release.create({ data: {} });
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
        return ctx.db.release.update({
          where: { id },
          data: { droppable: droppable ?? undefined },
        });
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
        return ctx.db.release.findFirst({ where: { id } });
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
        return ctx.db.release.findFirst({
          where: { droppable: false },
          orderBy: { id: "desc" },
        });
      },
    });
  },
});
