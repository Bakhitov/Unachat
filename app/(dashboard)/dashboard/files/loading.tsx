import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function FilesLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Файлы"
                text="Список всех импортированных и кроленных файлов."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}