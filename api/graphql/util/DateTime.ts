import { Kind } from "graphql";
import { scalarType } from "nexus";

export const DateTime = scalarType({
  name: "DateTime",
  asNexusMethod: "DateTime",
  description: "The `DateTime` custom scalar type represents a point in time.",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});
