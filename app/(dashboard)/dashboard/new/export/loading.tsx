import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function CreateExportLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Экспорт сообщений"
                text="Создать экспорт сообщений вашего чатбота."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}