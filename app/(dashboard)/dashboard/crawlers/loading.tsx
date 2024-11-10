import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CrawlersSettingsLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Краулеры"
                text="Управляйте вашими кролерами и их конфигурацией."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}