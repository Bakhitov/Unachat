import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function Loading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Поддержка"
                text="Добро пожаловать на страницу поддержки."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}