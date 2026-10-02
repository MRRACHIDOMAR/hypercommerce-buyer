import { createFileRoute } from "@tanstack/react-router";
import { StorePage } from "@/pages/StorePage";

export const Route = createFileRoute("/store")({
  head: () => ({ meta: [{ title: "HyperCommerce Buyer" }] }),
  component: StorePage,
});
