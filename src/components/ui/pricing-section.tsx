"use client"

import * as React from "react"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"
import { Tab } from "@/components/ui/pricing-tab"

export interface PricingSectionProps {
  title: string
  subtitle: string
  tiers: PricingTier[]
  frequencies: string[]
}

export function PricingSection({
  title,
  subtitle,
  tiers,
  frequencies,
}: PricingSectionProps) {
  const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0])

  return (
    <section className="flex flex-col items-center gap-10 py-10 w-full">
      <div className="space-y-7 text-center max-w-3xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold md:text-5xl tracking-tight text-paper font-display">{title}</h1>
          <p className="text-mute text-sub">{subtitle}</p>
        </div>
        {frequencies.length > 1 && (
          <div className="mx-auto flex w-fit rounded-full bg-ink-2/80 p-1 border border-rule backdrop-blur-sm">
            {frequencies.map((freq) => (
              <Tab
                key={freq}
                text={freq}
                selected={selectedFrequency === freq}
                setSelected={setSelectedFrequency}
                discount={freq === "yearly"}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            paymentFrequency={selectedFrequency}
          />
        ))}
      </div>
    </section>
  )
}
