import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function ChatbotsLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Чатботы"
                text="Создавайте и управляйте вашими чатботами."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}