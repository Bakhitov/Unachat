
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserNameForm } from "@/components/user-name-form"
import { OpenAIForm } from "@/components/openai-config-form"
import { siteConfig } from "@/config/site"
import { NotificationSettingsForm } from "@/components/notification-settings-form"
import { db } from "@/lib/db"

export const metadata = {
    title: `${siteConfig.name} - Настройки`,
    description: "Управление учетной записью и настройками сайта.",
}

export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const userNotifications = await db.user.findFirst({
        where: {
            id: user.id,
        },
        select: {
            inquiryEmailEnabled: true,
            marketingEmailEnabled: true,
        },
    })

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Настройки"
                text="Управление учетной записью и настройками сайта."
            />
            <div className="grid gap-10">
                <div className="grid gap-10">
                    <UserNameForm user={{ id: user.id, name: user.name || "" }} />
                    <OpenAIForm user={{ id: user.id }} />
                    <NotificationSettingsForm user={{ id: user.id }} marketingEmailEnabled={userNotifications?.marketingEmailEnabled!} inquiryNotificationEnabled={userNotifications?.inquiryEmailEnabled!} />
                </div>
            </div>
        </DashboardShell>
    )
}