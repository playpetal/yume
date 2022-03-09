import { Product } from "@prisma/client";
import paypal from "@paypal/checkout-server-sdk";

let environment: paypal.core.LiveEnvironment | paypal.core.SandboxEnvironment;

if (process.env.PAYPAL_MODE === "live") {
  environment = new paypal.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID || "",
    process.env.PAYPAL_CLIENT_SECRET || ""
  );
} else {
  environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID || "",
    process.env.PAYPAL_CLIENT_SECRET || ""
  );
}

const client = new paypal.core.PayPalHttpClient(environment);

export async function createTransaction(product: Product): Promise<{
  url: string;
  id: string;
}> {
  const payment: paypal.orders.OrdersCreate.RequestData = {
    intent: "CAPTURE",
    application_context: {
      brand_name: "petal",
      // @ts-ignore
      landing_page: "NO_PREFERENCE",
      locale: "en",
      // @ts-ignore
      shipping_preference: "NO_SHIPPING",
      // @ts-ignore
      user_action: "PAY_NOW",
      return_url: process.env.PAYPAL_RETURN_URL || "",
      cancel_url: process.env.PAYPAL_CANCEL_URL || "",
    },
    purchase_units: [
      {
        items: [
          {
            name: `${product.name}`,
            sku: `${product.id}`,
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: `${product.price}`,
            },
            // @ts-ignore
            category: "DIGITAL_GOODS",
          },
        ],
        amount: {
          currency_code: "USD",
          value: `${product.price}`,
          breakdown: {
            item_total: { currency_code: "USD", value: `${product.price}` },
            discount: { currency_code: "USD", value: `0` },
            handling: { currency_code: "USD", value: `0` },
            insurance: { currency_code: "USD", value: `0` },
            shipping: { currency_code: "USD", value: `0` },
            shipping_discount: { currency_code: "USD", value: `0` },
            tax_total: { currency_code: "USD", value: `0` },
          },
        },
      },
    ],
  };

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody(payment);

  const order = await client.execute(request);

  const result = order.result as {
    id: string;
    status: string;
    links: {
      href: string;
      rel: "self" | "approve" | "update" | "capture";
      method: "GET" | "PATCH" | "POST";
    }[];
  };

  let link = result.links.find((l) => l.rel === "approve")!;

  return { url: link.href, id: result.id };
}

export async function validatePayment(orderId: string): Promise<boolean> {
  const request = new paypal.orders.OrdersGetRequest(orderId);

  const order = await client.execute(request);

  const result = order.result as { id: string; intent: string; status: string };
  if (result.status === "APPROVED") return true;

  return false;
}
