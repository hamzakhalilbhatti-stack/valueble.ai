"use client"

import * as React from "react"
import Link from "next/link"
import { BadgeCheck, ArrowRight } from "lucide-react"
import NumberFlow from "@number-flow/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface PricingTier {
  id?: string
  name: string
  price: Record<string, number | string>
  priceNote?: string
  description: string
  features: string[]
  cta: string
  href?: string
  productPath?: string
  highlighted?: boolean
  popular?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
}

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency] ?? Object.values(tier.price)[0]
  const isHighlighted = tier.highlighted
  const isPopular = tier.popular

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-6 overflow-hidden rounded-2xl border p-6 transition-all duration-300",
        isPopular
          ? "border-accent/80 bg-ink-2/95 shadow-[0_0_50px_-15px_oklch(0.89_0.16_96_/_0.25)] ring-2 ring-accent"
          : isHighlighted
            ? "border-rule-strong bg-gradient-to-b from-ink-2 to-ink-3 shadow-2xl ring-1 ring-rule-strong"
            : "border-rule/60 bg-ink-2/80 hover:border-rule-strong hover:shadow-xl",
        "text-paper"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(235,255,100,0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="flex items-center justify-between gap-3 relative z-10">
        <h2 className="text-xl font-semibold capitalize tracking-tight !text-paper">
          {tier.name}
        </h2>
        {isPopular && (
          <Badge
            variant="secondary"
            className="border-accent/40 bg-accent/20 text-accent font-medium text-xs px-2.5 py-0.5"
          >
            ★ Most Popular
          </Badge>
        )}
        {isHighlighted && !isPopular && (
          <Badge
            variant="secondary"
            className="border-rule-strong bg-ink-3 text-mute font-medium text-xs px-2.5 py-0.5"
          >
            Enterprise
          </Badge>
        )}
      </div>

      <div className="relative min-h-[3.25rem] flex flex-col justify-center z-10">
        {typeof price === "number" ? (
          <div>
            <div className="flex items-baseline gap-1">
              <NumberFlow
                format={{
                  style: "currency",
                  currency: "USD",
                  trailingZeroDisplay: "stripIfInteger",
                }}
                value={price}
                className="text-4xl font-bold tracking-tight font-display !text-paper"
              />
              <span className="text-xs font-medium text-mute">
                /{paymentFrequency.toLowerCase().includes("support") ? "setup+mo" : "one-time"}
              </span>
            </div>
            {tier.priceNote && (
              <p className="text-xs mt-1 text-faint">
                {tier.priceNote}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display !text-paper">{price}</h1>
            {tier.priceNote && (
              <p className="text-xs mt-1 text-faint">
                {tier.priceNote}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        <h3 className="text-sm font-medium text-mute">
          {tier.description}
        </h3>
        <ul className="space-y-2.5 pt-2 border-t border-rule/30">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-sm text-paper"
            >
              <BadgeCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
              <span className="text-[0.9375rem] leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 pt-2 space-y-2">
        {tier.href ? (
          <Button
            asChild
            variant="default"
            className={cn(
              "w-full font-medium transition-all group",
              isPopular
                ? "bg-accent text-on-accent hover:bg-accent-strong shadow-lg shadow-accent/20"
                : "bg-paper text-ink hover:bg-paper/90"
            )}
          >
            <Link href={tier.href}>
              {tier.cta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="default"
            className={cn(
              "w-full font-medium transition-all group",
              isPopular
                ? "bg-accent text-on-accent hover:bg-accent-strong shadow-lg shadow-accent/20"
                : "bg-paper text-ink hover:bg-paper/90"
            )}
          >
            {tier.cta}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
        {tier.productPath && (
          <div className="pt-2 text-center">
            <Link
              href={tier.productPath}
              className="text-xs transition-colors text-mute hover:text-paper hover:underline inline-block"
            >
              Read about {tier.name} →
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}
