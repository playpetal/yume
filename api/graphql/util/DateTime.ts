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
    if (typeof value === "number" || typeof value === "string")
      value = new Date(value);
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
