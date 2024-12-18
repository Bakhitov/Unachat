
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { siteConfig } from "@/config/site"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"

export const metadata = {
    title: `${siteConfig.name} - Платежи`,
    description: "Управление платежами и вашим планом подписки.",
}

export default async function BillingPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // If user has a pro plan, check cancel status on Stripe.
    let isCanceled = false
    if (subscriptionPlan.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            subscriptionPlan.stripeSubscriptionId
        )
        isCanceled = stripePlan.cancel_at_period_end
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Платежи"
                text="Управление платежами и вашим планом подписки. Для получения более подробной информации о наших планах, посетите нашу страницу цен или можете спросить нашего чатбота."
            />
            
            <BillingForm
                subscriptionPlan={{
                    ...subscriptionPlan,
                    isCanceled,
                }}
            />
        </DashboardShell>
    )
}