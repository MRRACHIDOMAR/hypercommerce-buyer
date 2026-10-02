import type { Lang } from "@/connector/types";

export const BUYER_VUES = ["decouvrir", "boutiques", "favoris", "panier", "suivi"] as const;
export type BuyerVue = (typeof BUYER_VUES)[number];

type L10n = Record<Lang, string>;
const t = (fr: string, en: string, ar: string): L10n => ({ fr, en, ar });

export const buyerModules: { id: BuyerVue; folder: string; title: L10n; play: L10n }[] = [
  {
    id: "decouvrir",
    folder: "pages/discover",
    title: t("Découvrir", "Discover", "اكتشف"),
    play: t("Recherche, filtres, catégories", "Search, filters, categories", "بحث وتصفية وفئات"),
  },
  {
    id: "boutiques",
    folder: "pages/storefronts",
    title: t("Boutiques", "Shops", "المتاجر"),
    play: t("Vitrine de chaque vendeur", "Each seller’s storefront", "واجهة كل بائع"),
  },
  {
    id: "favoris",
    folder: "pages/wishlist",
    title: t("Favoris", "Saved", "المفضلة"),
    play: t("Liste à reprendre plus tard", "Save for later", "حفظ لوقت لاحق"),
  },
  {
    id: "panier",
    folder: "pages/checkout",
    title: t("Panier", "Cart", "السلة"),
    play: t("Retrait dans une boutique ouverte", "Pickup at an open shop", "استلام من متجر مفتوح"),
  },
  {
    id: "suivi",
    folder: "pages/orders",
    title: t("Suivi", "Orders", "التتبع"),
    play: t("Statut renvoyé par le comptoir", "Status from the seller counter", "الحالة من مكتب البائع"),
  },
];
