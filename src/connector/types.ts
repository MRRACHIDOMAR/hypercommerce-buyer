export type Lang = "fr" | "en" | "ar";

export type Role = "owner" | "manager" | "picker" | "finance";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "out"
  | "delivered"
  | "cancelled";

export type PlanId = "essentiel" | "commerce" | "place";

export type Location = {
  id: string;
  name: string;
  area: string;
  open: boolean;
};

export type Addon = { id: string; name: string; price: number };

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  taxId: string;
  active: boolean;
  attributes: { name: string; value: string }[];
  addons: Addon[];
  stock: Record<string, number>;
};

export type Order = {
  id: string;
  locationId: string;
  customer: string;
  summary: string;
  total: number;
  status: OrderStatus;
  at: string;
  credited: boolean;
  lines?: CartLine[];
};

export type Campaign = {
  id: string;
  name: string;
  kind: "marketplace" | "own";
  detail: string;
  discount: number;
  joined: boolean;
  until: string;
};

export type Member = {
  id: string;
  name: string;
  role: Role;
  locationId: string;
};

export type TaxGroup = { id: string; name: string; rate: number };

export type Tx = { id: string; label: string; amount: number; at: string };

export type CartLine = {
  key: string;
  productId: string;
  qty: number;
  withAddon: boolean;
};

export type ProductDraft = {
  name: string;
  category: string;
  brand: string;
  price: number;
  taxId: string;
  attributes: { name: string; value: string }[];
  addons: Addon[];
  stock: Record<string, number>;
};
