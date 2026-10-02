export const storefrontSubmodules = [
  { path: "modules/core", repo: "selldone/core" },
  { path: "modules/translate", repo: "selldone/translate" },
  { path: "modules/storefront-sdk", repo: "selldone/storefront-sdk" },
  { path: "modules/community-sdk", repo: "selldone/community-sdk" },
  { path: "modules/components", repo: "selldone/components" },
  { path: "modules/pagebuilder", repo: "selldone/pagebuilder" },
];

export const MARKETPLACE_FEE = 0.08;
export const DEMO_OTP = "4821";

export const sdkSurface = [
  "session.unlock(code)",
  "shop.setLanguage(lang)",
  "catalog.addProduct(draft)",
  "inventory.adjust(product, location, delta)",
  "orders.advance(id)",
  "orders.cancel(id)",
  "stores.toggleOpen(id)",
  "growth.toggleCampaign(id)",
  "finance.creditOnDelivery(order)",
  "store.placeOrder(customer, location)",
  "buyer.toggleWish(id)",
] as const;
