import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { buyerModules, type BuyerVue } from "@/connector/buyer";
import type { Lang, OrderStatus, Product } from "@/connector/types";
import { Button, Card, Mark, controlClass, Field } from "@/components/seller/ui";
import { money } from "@/lang/format";
import { cn } from "@/lib/cn";
import { useSeller } from "@/store/seller";

const copy = {
  fr: {
    kicker: "HyperCommerce Buyer",
    lead: "Connecteur acheteur du store. Le catalogue est celui du vendeur, la commande revient au comptoir.",
    desk: "Comptoir",
    all: "Tout",
    search: "Chercher un produit, une marque",
    shops: "Boutique",
    add: "Ajouter",
    addon: "Avec add-on",
    qty: "Quantité",
    wish: "Favori",
    unwish: "Retirer des favoris",
    emptyWish: "Aucun favori pour l’instant.",
    emptyShop: "Aucune boutique.",
    closed: "Fermée",
    open: "Ouverte",
    stock: "en stock",
    see: "Voir les produits",
    also: "À voir aussi",
    cart: "Panier",
    empty: "Le panier est vide.",
    customer: "Nom",
    place: "Retrait",
    noShop: "Aucune boutique n’est ouverte.",
    order: "Commander",
    off: "Remise campagne",
    ship: "Livraison offerte dès 5 000 FDJ",
    need: "Nom, boutique ouverte et stock suffisant sont requis.",
    done: "Commande envoyée au comptoir",
    remove: "Retirer",
    mine: "Mes commandes",
    none: "Aucune commande à ce nom.",
    again: "Reprendre",
    status: {
      new: "Nouvelle",
      confirmed: "Confirmée",
      preparing: "Préparation",
      out: "En route",
      delivered: "Livrée",
      cancelled: "Annulée",
    },
  },
  en: {
    kicker: "HyperCommerce Buyer",
    lead: "Buyer connector for the store. The catalog is the seller’s, and the order returns to the counter.",
    desk: "Counter",
    all: "All",
    search: "Search a product or brand",
    shops: "Shop",
    add: "Add",
    addon: "With add-on",
    qty: "Quantity",
    wish: "Save",
    unwish: "Unsave",
    emptyWish: "Nothing saved yet.",
    emptyShop: "No shop.",
    closed: "Closed",
    open: "Open",
    stock: "in stock",
    see: "See products",
    also: "Also look at",
    cart: "Cart",
    empty: "The cart is empty.",
    customer: "Name",
    place: "Pickup",
    noShop: "No shop is open.",
    order: "Place order",
    off: "Campaign off",
    ship: "Free delivery from 5,000 FDJ",
    need: "Name, an open shop and enough stock are required.",
    done: "Order sent to the counter",
    remove: "Remove",
    mine: "My orders",
    none: "No order under this name.",
    again: "Order again",
    status: {
      new: "New",
      confirmed: "Confirmed",
      preparing: "Preparing",
      out: "On the way",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
  },
  ar: {
    kicker: "HyperCommerce Buyer",
    lead: "موصّل المشتري للمتجر. الكتالوج للبائع، والطلب يعود إلى المكتب.",
    desk: "المكتب",
    all: "الكل",
    search: "ابحث عن منتج أو علامة",
    shops: "المتجر",
    add: "إضافة",
    addon: "مع الإضافة",
    qty: "الكمية",
    wish: "حفظ",
    unwish: "إزالة",
    emptyWish: "لا مفضلات بعد.",
    emptyShop: "لا متجر.",
    closed: "مغلق",
    open: "مفتوح",
    stock: "في المخزون",
    see: "عرض المنتجات",
    also: "انظر أيضاً",
    cart: "السلة",
    empty: "السلة فارغة.",
    customer: "الاسم",
    place: "الاستلام",
    noShop: "لا متجر مفتوح.",
    order: "طلب",
    off: "خصم الحملة",
    ship: "توصيل مجاني من 5٬000 FDJ",
    need: "الاسم ومتجر مفتوح ومخزون كافٍ مطلوبة.",
    done: "أُرسل الطلب إلى المكتب",
    remove: "حذف",
    mine: "طلباتي",
    none: "لا طلب بهذا الاسم.",
    again: "إعادة الطلب",
    status: {
      new: "جديد",
      confirmed: "مؤكد",
      preparing: "تجهيز",
      out: "في الطريق",
      delivered: "مُسلَّم",
      cancelled: "ملغى",
    },
  },
} as const;

export function StorePage() {
  const navigate = useNavigate();
  const lang = useSeller((s) => s.lang);
  const setLang = useSeller((s) => s.setLang);
  const products = useSeller((s) => s.products);
  const locations = useSeller((s) => s.locations);
  const campaigns = useSeller((s) => s.campaigns);
  const cart = useSeller((s) => s.cart);
  const wishlist = useSeller((s) => s.wishlist);
  const buyerName = useSeller((s) => s.buyerName);
  const orders = useSeller((s) => s.orders);
  const addToCart = useSeller((s) => s.addToCart);
  const setCartQty = useSeller((s) => s.setCartQty);
  const placeOrder = useSeller((s) => s.placeOrder);
  const toggleWish = useSeller((s) => s.toggleWish);
  const setBuyerName = useSeller((s) => s.setBuyerName);
  const text = copy[lang];
  const [vue, setVue] = useState<BuyerVue>("decouvrir");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [shopId, setShopId] = useState("all");
  const [picked, setPicked] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [withAddon, setWithAddon] = useState(false);
  const [customer, setCustomer] = useState(buyerName);
  const [locationId, setLocationId] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");

  useEffect(() => {
    void useSeller.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const open = locations.filter((location) => location.open);
  const active = products.filter((product) => product.active);
  const needle = query.trim().toLowerCase();
  const categories = ["all", ...new Set(active.map((product) => product.category))];
  const visible = active.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (shopId !== "all" && (product.stock[shopId] ?? 0) <= 0) return false;
    if (!needle) return true;
    return `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(needle);
  });
  const selected = active.find((product) => product.id === picked) ?? null;
  const wished = active.filter((product) => wishlist.includes(product.id));
  const wishCategories = new Set(wished.map((product) => product.category));
  const also =
    wished.length > 0
      ? active.filter((product) => wishCategories.has(product.category) && !wishlist.includes(product.id)).slice(0, 3)
      : [...active].sort((a, b) => stockOf(b, shopId) - stockOf(a, shopId)).slice(0, 3);
  const discount = campaigns.reduce(
    (best, campaign) => (campaign.joined ? Math.max(best, campaign.discount) : best),
    0,
  );
  const shipping = campaigns.some((campaign) => campaign.joined && campaign.id === "livraison");
  const lines = cart
    .map((line) => {
      const product = active.find((item) => item.id === line.productId);
      if (!product) return null;
      const addon = line.withAddon ? product.addons[0] : undefined;
      const unit = product.price + (addon?.price ?? 0);
      return { ...line, name: product.name, addon: addon?.name, lineTotal: unit * line.qty };
    })
    .filter((line) => line !== null);
  const gross = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const total = Math.round(gross * (1 - discount / 100));
  const mine = orders.filter(
    (order) => buyerName && order.customer.toLowerCase() === buyerName.toLowerCase(),
  );
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  useEffect(() => {
    if (!locationId && open[0]) setLocationId(open[0].id);
  }, [locationId, open]);

  function row(product: Product) {
    const units = shopId === "all" ? stockOf(product, "all") : (product.stock[shopId] ?? 0);
    const saved = wishlist.includes(product.id);
    return (
      <li key={product.id}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-surface p-3",
            picked === product.id ? "border-primary" : "border-line",
          )}
        >
          <button
            type="button"
            onClick={() => {
              setPicked(product.id);
              setWithAddon(false);
              setQty(1);
              setVue("decouvrir");
            }}
            className="flex min-w-0 flex-1 items-center gap-3 text-start"
          >
            <Mark name={product.name} category={product.category} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{product.name}</span>
              <span className="block truncate text-sm text-muted">
                {product.brand} · {units} {text.stock}
              </span>
            </span>
            <span className="text-sm font-medium">{money(product.price, lang)}</span>
          </button>
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => toggleWish(product.id)}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl border text-sm",
              saved ? "border-primary text-primary" : "border-line text-muted",
            )}
          >
            {saved ? "★" : "☆"}
            <span className="sr-only">{saved ? text.unwish : text.wish}</span>
          </button>
        </div>
      </li>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-ink">
      <div className="h-1 bg-primary" />
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4">
          <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
            <p className="text-xs font-medium text-primary">{text.kicker}</p>
            <h1 className="font-display text-3xl leading-none">Atelier Mer Rouge</h1>
          </div>
          <button
            type="button"
            onClick={() => void navigate({ to: "/", search: { vue: "tableau" } })}
            className="h-11 rounded-xl border border-line px-4 text-sm font-medium"
          >
            {text.desk}
          </button>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-line p-1">
            {(["fr", "en", "ar"] as Lang[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setLang(id)}
                className={cn(
                  "h-11 rounded-lg px-3 text-sm font-medium",
                  lang === id ? "bg-ink text-primary-fg" : "text-muted",
                )}
              >
                {id === "ar" ? "ع" : id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>
      <nav className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          {buyerModules.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => setVue(module.id)}
              className={cn(
                "h-11 shrink-0 rounded-full border px-4 text-sm",
                vue === module.id ? "border-primary bg-primary text-primary-fg" : "border-line bg-surface",
              )}
            >
              {module.title[lang]}
              {module.id === "favoris" && wishlist.length > 0 ? ` ${wishlist.length}` : ""}
              {module.id === "panier" && cartCount > 0 ? ` ${cartCount}` : ""}
            </button>
          ))}
        </div>
      </nav>
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 pb-10">
        <p className="max-w-2xl text-sm text-muted">{text.lead}</p>
        {vue === "decouvrir" ? (
          <>
            <input
              className={controlClass}
              value={query}
              placeholder={text.search}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "h-11 shrink-0 rounded-full border px-4 text-sm",
                    category === item ? "border-ink bg-ink text-primary-fg" : "border-line bg-surface",
                  )}
                >
                  {item === "all" ? text.all : item}
                </button>
              ))}
            </div>
            <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setShopId("all")}
                className={cn(
                  "h-11 shrink-0 rounded-full border px-4 text-sm",
                  shopId === "all" ? "border-primary text-primary" : "border-line bg-surface",
                )}
              >
                {text.shops} · {text.all}
              </button>
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setShopId(location.id)}
                  className={cn(
                    "h-11 shrink-0 rounded-full border px-4 text-sm",
                    shopId === location.id ? "border-primary text-primary" : "border-line bg-surface",
                    !location.open && "text-muted",
                  )}
                >
                  {location.name}
                </button>
              ))}
            </div>
            {discount > 0 ? (
              <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
                {text.off} {discount}%
              </p>
            ) : null}
            <ul className="grid gap-3 sm:grid-cols-2">{visible.map(row)}</ul>
            {selected ? (
              <Card className="flex flex-col gap-3">
                <p className="font-display text-2xl">{selected.name}</p>
                <p className="text-sm text-muted">
                  {selected.category} · {selected.brand}
                  {selected.attributes[0]
                    ? ` · ${selected.attributes[0].name} ${selected.attributes[0].value}`
                    : ""}
                </p>
                <p className="font-medium">{money(selected.price, lang)}</p>
                {selected.addons[0] ? (
                  <label className="flex h-11 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={withAddon}
                      onChange={(event) => setWithAddon(event.target.checked)}
                    />
                    {text.addon} · {selected.addons[0].name} · {money(selected.addons[0].price, lang)}
                  </label>
                ) : null}
                <div className="flex flex-wrap items-end gap-3">
                  <Field label={text.qty}>
                    <input
                      className={cn(controlClass, "w-24")}
                      inputMode="numeric"
                      value={qty}
                      onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
                    />
                  </Field>
                  <Button
                    onClick={() => {
                      addToCart(selected.id, qty, withAddon && Boolean(selected.addons[0]));
                      setVue("panier");
                    }}
                  >
                    {text.add}
                  </Button>
                </div>
              </Card>
            ) : null}
            {(wished.length > 0 || needle || category !== "all" || shopId !== "all") && also.length > 0 ? (
              <section>
                <h2 className="mb-3 font-display text-2xl">{text.also}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">{also.map(row)}</ul>
              </section>
            ) : null}
          </>
        ) : null}
        {vue === "boutiques" ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {locations.map((location) => {
              const count = active.filter((product) => (product.stock[location.id] ?? 0) > 0).length;
              return (
                <li key={location.id}>
                  <Card className="flex flex-col gap-2">
                    <p className="font-display text-2xl">{location.name}</p>
                    <p className="text-sm text-muted">{location.area}</p>
                    <p className={location.open ? "text-sm text-good" : "text-sm text-muted"}>
                      {location.open ? text.open : text.closed} · {count} {text.stock}
                    </p>
                    <Button
                      tone="line"
                      onClick={() => {
                        setShopId(location.id);
                        setVue("decouvrir");
                      }}
                    >
                      {text.see}
                    </Button>
                  </Card>
                </li>
              );
            })}
          </ul>
        ) : null}
        {vue === "favoris" ? (
          wished.length === 0 ? (
            <p className="text-sm text-muted">{text.emptyWish}</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">{wished.map(row)}</ul>
          )
        ) : null}
        {vue === "panier" ? (
          <Card className="flex flex-col gap-3">
            <h2 className="font-display text-2xl">{text.cart}</h2>
            {lines.length === 0 ? <p className="text-sm text-muted">{text.empty}</p> : null}
            <ul className="flex flex-col gap-3">
              {lines.map((line) => (
                <li key={line.key} className="flex items-start justify-between gap-3 text-sm">
                  <span>
                    <span className="font-medium">{line.name}</span>
                    {line.addon ? <span className="text-muted"> · {line.addon}</span> : null}
                    <span className="block text-muted">×{line.qty}</span>
                  </span>
                  <span className="text-end">
                    <span className="block">{money(line.lineTotal, lang)}</span>
                    <button type="button" className="text-primary" onClick={() => setCartQty(line.key, 0)}>
                      {text.remove}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-medium">
              {discount > 0 && gross > 0 ? `${text.off} ${discount}% · ` : ""}
              {money(total, lang)}
            </p>
            {shipping && total >= 5000 ? <p className="text-sm text-good">{text.ship}</p> : null}
            <Field label={text.customer}>
              <input
                className={controlClass}
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
              />
            </Field>
            <Field label={text.place}>
              <select
                className={controlClass}
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
              >
                {open.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </Field>
            {open.length === 0 ? <p className="text-sm text-primary">{text.noShop}</p> : null}
            {error ? <p className="text-sm text-primary">{error}</p> : null}
            {receipt ? (
              <p className="text-sm text-good">
                {text.done} {receipt}.
              </p>
            ) : null}
            <Button
              disabled={lines.length === 0 || open.length === 0}
              onClick={() => {
                const id = placeOrder(customer, locationId || open[0]?.id || "");
                if (!id) {
                  setError(text.need);
                  setReceipt("");
                  return;
                }
                setError("");
                setReceipt(id);
                setBuyerName(customer.trim());
                setVue("suivi");
              }}
            >
              {text.order}
            </Button>
          </Card>
        ) : null}
        {vue === "suivi" ? (
          <section className="flex flex-col gap-3">
            <Field label={text.mine}>
              <input
                className={controlClass}
                value={buyerName}
                onChange={(event) => setBuyerName(event.target.value)}
              />
            </Field>
            {mine.length === 0 ? <p className="text-sm text-muted">{text.none}</p> : null}
            <ul className="flex flex-col gap-3">
              {mine.map((order) => (
                <li key={order.id}>
                  <Card className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-primary">{text.status[order.status as OrderStatus]}</p>
                    </div>
                    <p className="text-sm text-muted">{order.summary}</p>
                    <p className="text-sm">{money(order.total, lang)}</p>
                    {order.lines && order.lines.length > 0 ? (
                      <Button
                        tone="line"
                        onClick={() => {
                          for (const line of order.lines ?? []) addToCart(line.productId, line.qty, line.withAddon);
                          setVue("panier");
                        }}
                      >
                        {text.again}
                      </Button>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function stockOf(product: Product, shopId: string) {
  if (shopId !== "all") return product.stock[shopId] ?? 0;
  return Object.values(product.stock).reduce((sum, qty) => sum + qty, 0);
}
