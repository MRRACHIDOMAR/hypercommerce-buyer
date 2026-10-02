import type { Campaign, Location, Member, Order, Product, TaxGroup, Tx } from "@/connector/types";

export const seedLocations: Location[] = [
  { id: "serpent", name: "Plateau du Serpent", area: "Djibouti-ville", open: true },
  { id: "balbala", name: "Balbala Wahda", area: "Balbala", open: true },
  { id: "pk12", name: "PK12", area: "PK12", open: false },
];

function stock(serpent: number, balbala: number, pk12: number) {
  return { serpent, balbala, pk12 };
}

export const seedProducts: Product[] = [
  {
    id: "dattes",
    name: "Dattes Deglet Nour",
    category: "Épicerie",
    brand: "Mer Rouge",
    price: 1800,
    taxId: "tva",
    active: true,
    attributes: [{ name: "Origine", value: "Kebri Beyah" }],
    addons: [{ id: "coffret", name: "Coffret", price: 700 }],
    stock: stock(24, 6, 0),
  },
  {
    id: "encens",
    name: "Encens luban",
    category: "Maison",
    brand: "Bilen",
    price: 2400,
    taxId: "tva",
    active: true,
    attributes: [{ name: "Grade", value: "Hojari" }],
    addons: [{ id: "bruleur", name: "Brûleur", price: 1500 }],
    stock: stock(10, 4, 8),
  },
  {
    id: "fouta",
    name: "Fouta tissée",
    category: "Textile",
    brand: "Local Atelier",
    price: 4500,
    taxId: "tva",
    active: true,
    attributes: [{ name: "Taille", value: "180 cm" }],
    addons: [],
    stock: stock(5, 12, 2),
  },
  {
    id: "sesame",
    name: "Huile de sésame",
    category: "Épicerie",
    brand: "Import Golfe",
    price: 3200,
    taxId: "tva",
    active: true,
    attributes: [{ name: "Volume", value: "500 ml" }],
    addons: [],
    stock: stock(14, 2, 9),
  },
  {
    id: "harar",
    name: "Café Harar",
    category: "Épicerie",
    brand: "Mer Rouge",
    price: 5600,
    taxId: "tva",
    active: true,
    attributes: [{ name: "Mouture", value: "Grain" }],
    addons: [],
    stock: stock(8, 8, 1),
  },
  {
    id: "oud",
    name: "Savon au oud",
    category: "Beauté",
    brand: "Bilen",
    price: 900,
    taxId: "exo",
    active: true,
    attributes: [{ name: "Poids", value: "100 g" }],
    addons: [],
    stock: stock(30, 18, 11),
  },
];

export const seedOrders: Order[] = [
  {
    id: "CMD-2048",
    locationId: "serpent",
    customer: "Amina Warsama",
    summary: "Dattes ×2, savon",
    total: 4500,
    status: "new",
    at: "2026-10-02T05:40:00.000Z",
    credited: false,
  },
  {
    id: "CMD-2047",
    locationId: "balbala",
    customer: "Youssouf Ali",
    summary: "Fouta tissée",
    total: 4500,
    status: "confirmed",
    at: "2026-10-02T04:10:00.000Z",
    credited: false,
  },
  {
    id: "CMD-2044",
    locationId: "serpent",
    customer: "Noura Mohamed",
    summary: "Encens + brûleur",
    total: 3900,
    status: "preparing",
    at: "2026-10-01T16:20:00.000Z",
    credited: false,
  },
  {
    id: "CMD-2039",
    locationId: "pk12",
    customer: "Ibrahim Darar",
    summary: "Café Harar",
    total: 5600,
    status: "out",
    at: "2026-10-01T11:05:00.000Z",
    credited: false,
  },
  {
    id: "CMD-2031",
    locationId: "serpent",
    customer: "Houda Hassan",
    summary: "Huile de sésame ×2",
    total: 6400,
    status: "delivered",
    at: "2026-09-30T14:12:00.000Z",
    credited: true,
  },
];

export const seedCampaigns: Campaign[] = [
  {
    id: "aid",
    name: "Souk de l'Aïd",
    kind: "marketplace",
    detail: "Mise en avant place de marché",
    discount: 15,
    joined: false,
    until: "2026-10-20",
  },
  {
    id: "livraison",
    name: "Livraison offerte dès 5 000 FDJ",
    kind: "own",
    detail: "Promo tenue par la boutique",
    discount: 0,
    joined: true,
    until: "2026-11-01",
  },
  {
    id: "balbala-week",
    name: "Semaine Balbala",
    kind: "marketplace",
    detail: "Vitrine quartier Balbala",
    discount: 10,
    joined: false,
    until: "2026-10-12",
  },
];

export const seedMembers: Member[] = [
  { id: "hodan", name: "Hodan Ali", role: "owner", locationId: "all" },
  { id: "said", name: "Said Omar", role: "manager", locationId: "serpent" },
  { id: "fatouma", name: "Fatouma Idriss", role: "picker", locationId: "balbala" },
];

export const seedTaxes: TaxGroup[] = [
  { id: "tva", name: "TVA", rate: 10 },
  { id: "exo", name: "Exonéré", rate: 0 },
];

export const seedTxs: Tx[] = [
  { id: "tx-2031", label: "CMD-2031", amount: 5888, at: "2026-09-30T14:20:00.000Z" },
  { id: "tx-retrait", label: "Retrait caisse", amount: -50000, at: "2026-09-28T09:00:00.000Z" },
  { id: "tx-2022", label: "CMD-2022", amount: 12420, at: "2026-09-27T18:40:00.000Z" },
];

export const seedWallet = 186400;
export const seedSalesWeek = [82000, 64000, 91000, 47000, 102000, 76000, 45000];

export const CATEGORIES = ["Épicerie", "Textile", "Maison", "Beauté"] as const;
export const BRANDS = ["Mer Rouge", "Bilen", "Local Atelier", "Import Golfe"] as const;
