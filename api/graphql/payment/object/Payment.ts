import { objectType } from "nexus";
import { Payment } from "nexus-prisma";

export const PaymentObject = objectType({
  name: Payment.$name,
  description: Payment.$description,
  definition(t) {
    t.field(Payment.id);
    t.field(Payment.accountId);
    t.field(Payment.cost);
    t.field(Payment.paymentId);
    t.field(Payment.productId);
    t.field(Payment.success);
    t.field(Payment.url);
  },
});
