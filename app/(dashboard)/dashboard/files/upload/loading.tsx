import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function UploadFileLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Загрузить файл"
                text="Загрузите файл, и тогда вы сможете использовать его с вашим чатботом."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}