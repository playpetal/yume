declare module "yume" {
  export type Flag = keyof typeof import("../api/lib/flags").FLAGS;
}
