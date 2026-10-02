import type { Lang, OrderStatus, PlanId, Role } from "@/connector/types";
import type { VueId } from "@/connector/vues";

const locale: Record<Lang, string> = { fr: "fr", en: "en", ar: "ar" };

export function money(value: number, lang: Lang) {
  const formatted = new Intl.NumberFormat(locale[lang], {
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(value);
  return `${formatted} FDJ`;
}

export function when(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locale[lang], {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function dayLabel(isoDate: string, lang: Lang) {
  return new Intl.DateTimeFormat(locale[lang], {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  }).format(new Date(`${isoDate}T12:00:00.000Z`));
}

const ANCHOR = new Date("2026-10-02T12:00:00.000Z");

export function weekLabels(lang: Lang) {
  const fmt = new Intl.DateTimeFormat(locale[lang], { weekday: "short", timeZone: "UTC" });
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(ANCHOR);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return fmt.format(date);
  });
}

export const navLabel: Record<Lang, Record<VueId, string>> = {
  fr: {
    tableau: "Tableau",
    produits: "Produits",
    commandes: "Commandes",
    boutiques: "Boutiques",
    campagnes: "Campagnes",
    finance: "Finance",
    acces: "Accès",
    architecture: "Architecture",
  },
  en: {
    tableau: "Board",
    produits: "Products",
    commandes: "Orders",
    boutiques: "Shops",
    campagnes: "Campaigns",
    finance: "Finance",
    acces: "Access",
    architecture: "Architecture",
  },
  ar: {
    tableau: "اللوحة",
    produits: "المنتجات",
    commandes: "الطلبات",
    boutiques: "المتاجر",
    campagnes: "الحملات",
    finance: "المالية",
    acces: "الوصول",
    architecture: "البنية",
  },
};

export const statusLabel: Record<Lang, Record<OrderStatus, string>> = {
  fr: {
    new: "Nouvelle",
    confirmed: "Confirmée",
    preparing: "Préparation",
    out: "En livraison",
    delivered: "Livrée",
    cancelled: "Annulée",
  },
  en: {
    new: "New",
    confirmed: "Confirmed",
    preparing: "Packing",
    out: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  },
  ar: {
    new: "جديد",
    confirmed: "مؤكد",
    preparing: "تحضير",
    out: "في التوصيل",
    delivered: "مُسلَّم",
    cancelled: "ملغى",
  },
};

export const advanceLabel: Record<Lang, Record<Exclude<OrderStatus, "delivered" | "cancelled">, string>> = {
  fr: { new: "Confirmer", confirmed: "Préparer", preparing: "Expédier", out: "Livrer" },
  en: { new: "Confirm", confirmed: "Pack", preparing: "Dispatch", out: "Deliver" },
  ar: { new: "تأكيد", confirmed: "تحضير", preparing: "إرسال", out: "تسليم" },
};

export const roleLabel: Record<Lang, Record<Role, string>> = {
  fr: { owner: "Propriétaire", manager: "Gérant", picker: "Préparateur", finance: "Finance" },
  en: { owner: "Owner", manager: "Manager", picker: "Picker", finance: "Finance" },
  ar: { owner: "مالك", manager: "مدير", picker: "مجهّز", finance: "مالية" },
};

export const planLabel: Record<Lang, Record<PlanId, string>> = {
  fr: { essentiel: "Essentiel", commerce: "Commerce", place: "Place" },
  en: { essentiel: "Essentiel", commerce: "Commerce", place: "Marketplace" },
  ar: { essentiel: "أساسي", commerce: "تجارة", place: "سوق" },
};

export const planDetail: Record<Lang, Record<PlanId, string>> = {
  fr: {
    essentiel: "Une boutique. Pas de campagne de la place.",
    commerce: "Jusqu’à trois lieux. Campagnes ouvertes.",
    place: "Lieux ouverts sans plafond. Priorité dans les campagnes.",
  },
  en: {
    essentiel: "One shop. No marketplace campaigns.",
    commerce: "Up to three locations. Campaigns open.",
    place: "No location cap. Priority in campaigns.",
  },
  ar: {
    essentiel: "متجر واحد. لا حملات من السوق.",
    commerce: "حتى ثلاثة مواقع. الحملات مفتوحة.",
    place: "مواقع بلا سقف. أولوية في الحملات.",
  },
};
