import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MARKETPLACE_FEE } from "@/connector/modules";
import {
  seedCampaigns,
  seedLocations,
  seedMembers,
  seedOrders,
  seedProducts,
  seedSalesWeek,
  seedTaxes,
  seedTxs,
  seedWallet,
} from "@/connector/seed";
import type {
  CartLine,
  Lang,
  Order,
  OrderStatus,
  PlanId,
  ProductDraft,
  Role,
} from "@/connector/types";

const flow: OrderStatus[] = ["new", "confirmed", "preparing", "out", "delivered"];

function nextStatus(status: OrderStatus): OrderStatus | null {
  const index = flow.indexOf(status);
  if (index < 0 || index === flow.length - 1) return null;
  return flow[index + 1] ?? null;
}

type Data = {
  lang: Lang;
  unlocked: boolean;
  plan: PlanId;
  activeLocation: string;
  locations: typeof seedLocations;
  products: typeof seedProducts;
  orders: Order[];
  campaigns: typeof seedCampaigns;
  members: typeof seedMembers;
  taxes: typeof seedTaxes;
  wallet: number;
  txs: typeof seedTxs;
  salesWeek: number[];
  cart: CartLine[];
  wishlist: string[];
  buyerName: string;
};

function seedData(): Data {
  return {
    lang: "fr",
    unlocked: true,
    plan: "commerce",
    activeLocation: "all",
    locations: seedLocations,
    products: seedProducts,
    orders: seedOrders,
    campaigns: seedCampaigns,
    members: seedMembers,
    taxes: seedTaxes,
    wallet: seedWallet,
    txs: seedTxs,
    salesWeek: seedSalesWeek,
    cart: [],
    wishlist: [],
    buyerName: "",
  };
}

type Actions = {
  setLang: (lang: Lang) => void;
  unlockWith: (code: string) => boolean;
  enterDemo: () => void;
  lock: () => void;
  setActiveLocation: (id: string) => void;
  toggleLocation: (id: string) => void;
  addProduct: (draft: ProductDraft) => void;
  adjustStock: (productId: string, locationId: string, delta: number) => void;
  toggleProduct: (id: string) => void;
  advanceOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  toggleCampaign: (id: string) => boolean;
  addMember: (name: string, role: Role, locationId: string) => void;
  setPlan: (plan: PlanId) => void;
  resetDemo: () => void;
  addToCart: (productId: string, qty: number, withAddon: boolean) => void;
  setCartQty: (key: string, qty: number) => void;
  placeOrder: (customer: string, locationId: string) => string | null;
  toggleWish: (productId: string) => void;
  setBuyerName: (name: string) => void;
};

export type SellerState = Data & Actions;

export const useSeller = create<SellerState>()(
  persist(
    (set, get) => ({
      ...seedData(),
      setLang: (lang) => set({ lang }),
      unlockWith: (code) => {
        if (code.trim() !== "4821") return false;
        set({ unlocked: true });
        return true;
      },
      enterDemo: () => set({ unlocked: true }),
      lock: () => set({ unlocked: false }),
      setActiveLocation: (activeLocation) => set({ activeLocation }),
      toggleLocation: (id) =>
        set((s) => ({
          locations: s.locations.map((location) =>
            location.id === id ? { ...location, open: !location.open } : location,
          ),
        })),
      addProduct: (draft) =>
        set((s) => ({
          products: [
            {
              ...draft,
              id: `p-${Date.now().toString(36)}`,
              active: true,
            },
            ...s.products,
          ],
        })),
      adjustStock: (productId, locationId, delta) =>
        set((s) => ({
          products: s.products.map((product) => {
            if (product.id !== productId) return product;
            const current = product.stock[locationId] ?? 0;
            return {
              ...product,
              stock: { ...product.stock, [locationId]: Math.max(0, current + delta) },
            };
          }),
        })),
      toggleProduct: (id) =>
        set((s) => ({
          products: s.products.map((product) =>
            product.id === id ? { ...product, active: !product.active } : product,
          ),
        })),
      advanceOrder: (id) =>
        set((s) => {
          const prev = s.orders.find((order) => order.id === id);
          if (!prev) return s;
          const status = nextStatus(prev.status);
          if (!status) return s;
          let wallet = s.wallet;
          let txs = s.txs;
          let salesWeek = s.salesWeek;
          let credited = prev.credited;
          if (status === "delivered" && !prev.credited) {
            const net = Math.round(prev.total * (1 - MARKETPLACE_FEE));
            wallet += net;
            credited = true;
            salesWeek = s.salesWeek.slice();
            salesWeek[6] = (salesWeek[6] ?? 0) + prev.total;
            txs = [{ id: `tx-${prev.id}-${Date.now()}`, label: prev.id, amount: net, at: new Date().toISOString() }, ...s.txs];
          }
          return {
            wallet,
            txs,
            salesWeek,
            orders: s.orders.map((order) => (order.id === id ? { ...order, status, credited } : order)),
          };
        }),
      cancelOrder: (id) =>
        set((s) => {
          const prev = s.orders.find((order) => order.id === id);
          if (!prev || (prev.status !== "new" && prev.status !== "confirmed")) return s;
          return {
            orders: s.orders.map((order) =>
              order.id === id ? { ...order, status: "cancelled" } : order,
            ),
          };
        }),
      toggleCampaign: (id) => {
        const current = get();
        const campaign = current.campaigns.find((item) => item.id === id);
        if (!campaign) return false;
        if (!campaign.joined && campaign.kind === "marketplace" && current.plan === "essentiel") {
          return false;
        }
        set({
          campaigns: current.campaigns.map((item) =>
            item.id === id ? { ...item, joined: !item.joined } : item,
          ),
        });
        return true;
      },
      addMember: (name, role, locationId) =>
        set((s) => {
          const trimmed = name.trim();
          if (!trimmed) return s;
          return {
            members: [
              ...s.members,
              { id: `m-${Date.now().toString(36)}`, name: trimmed, role, locationId },
            ],
          };
        }),
      setPlan: (plan) => set({ plan }),
      resetDemo: () => set((s) => ({ ...seedData(), lang: s.lang, unlocked: true })),
      addToCart: (productId, qty, withAddon) =>
        set((s) => {
          if (qty <= 0) return s;
          const key = `${productId}:${withAddon ? "1" : "0"}`;
          const existing = s.cart.find((line) => line.key === key);
          if (existing) {
            return {
              cart: s.cart.map((line) =>
                line.key === key ? { ...line, qty: line.qty + qty } : line,
              ),
            };
          }
          return { cart: [...s.cart, { key, productId, qty, withAddon }] };
        }),
      setCartQty: (key, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((line) => line.key !== key)
              : s.cart.map((line) => (line.key === key ? { ...line, qty } : line)),
        })),
      placeOrder: (customer, locationId) => {
        const current = get();
        const name = customer.trim();
        const location = current.locations.find((item) => item.id === locationId && item.open);
        if (!name || !location || current.cart.length === 0) return null;
        const needed = new Map<string, number>();
        for (const line of current.cart) {
          needed.set(line.productId, (needed.get(line.productId) ?? 0) + line.qty);
        }
        for (const [productId, qty] of needed) {
          const product = current.products.find((item) => item.id === productId && item.active);
          if (!product || (product.stock[locationId] ?? 0) < qty) return null;
        }
        const discount = current.campaigns.reduce(
          (best, campaign) => (campaign.joined ? Math.max(best, campaign.discount) : best),
          0,
        );
        let gross = 0;
        const parts: string[] = [];
        for (const line of current.cart) {
          const product = current.products.find((item) => item.id === line.productId);
          if (!product) return null;
          const addon = line.withAddon ? product.addons[0] : undefined;
          gross += (product.price + (addon?.price ?? 0)) * line.qty;
          parts.push(`${product.name}${addon ? ` + ${addon.name}` : ""} ×${line.qty}`);
        }
        const total = Math.max(0, Math.round(gross * (1 - discount / 100)));
        const id = `CMD-${Date.now().toString().slice(-6)}`;
        set({
          cart: [],
          buyerName: name,
          products: current.products.map((product) => {
            const qty = needed.get(product.id);
            if (!qty) return product;
            return {
              ...product,
              stock: {
                ...product.stock,
                [locationId]: (product.stock[locationId] ?? 0) - qty,
              },
            };
          }),
          orders: [
            {
              id,
              locationId,
              customer: name,
              summary: parts.join(", "),
              total,
              status: "new",
              at: new Date().toISOString(),
              credited: false,
              lines: current.cart.map((line) => ({ ...line })),
            },
            ...current.orders,
          ],
        });
        return id;
      },
      toggleWish: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      setBuyerName: (name) => set({ buyerName: name }),
    }),
    {
      name: "connecteur-vendeur",
      skipHydration: true,
      partialize: (state) => ({
        lang: state.lang,
        unlocked: state.unlocked,
        plan: state.plan,
        activeLocation: state.activeLocation,
        locations: state.locations,
        products: state.products,
        orders: state.orders,
        campaigns: state.campaigns,
        members: state.members,
        taxes: state.taxes,
        wallet: state.wallet,
        txs: state.txs,
        salesWeek: state.salesWeek,
        cart: state.cart,
        wishlist: state.wishlist,
        buyerName: state.buyerName,
      }),
    },
  ),
);
