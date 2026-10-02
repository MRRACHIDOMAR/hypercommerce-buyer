import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-4", className)}>
      {children}
    </section>
  );
}

export function Button({
  tone = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "ghost" | "line" | "good" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors disabled:opacity-40",
        tone === "primary" && "bg-primary text-primary-fg hover:opacity-90",
        tone === "good" && "bg-good text-primary-fg hover:opacity-90",
        tone === "line" && "border border-line bg-surface text-ink hover:border-primary",
        tone === "ghost" && "text-ink hover:bg-bg",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export const controlClass =
  "h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-ink outline-none focus:border-primary";

export function Mark({ name, category }: { name: string; category: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  const tone =
    category === "Textile" ? "bg-good text-primary-fg" : category === "Maison" ? "bg-ink text-primary-fg" : "bg-primary text-primary-fg";
  return (
    <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm", tone)}>
      {letters}
    </span>
  );
}
