import { objectType } from "nexus";
import { Product } from "nexus-prisma";

export const ProductObject = objectType({
  name: Product.$name,
  description: Product.$description,
  definition(t) {
    t.field(Product.id);
    t.field(Product.name);
    t.field(Product.available);
    t.field("type", {
      type: "ProductType",
    });
    t.field(Product.price);
  },
});
