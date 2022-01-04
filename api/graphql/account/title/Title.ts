import { extendType, list, nonNull, objectType } from "nexus";
import { Title } from "nexus-prisma";

export const TitleObject = objectType({
  name: Title.$name,
  description: Title.$description,
  definition(t) {
    t.field(Title.id);
    t.field(Title.title);
    t.field(Title.description);
  },
});

export const TitlesQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("titles", {
      type: nonNull(list(nonNull("Title"))),
      args: { id: "Int", name: "String" },
      async resolve(_, args, ctx) {
        return ctx.db.title.findMany({
          where: { id: args.id ?? undefined, title: args.name ?? undefined },
        });
      },
    });
  },
});
