import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const metadata = {
    title: `${siteConfig.name} - Поддержка`,
}

export default async function SupportPage() {

    return (
        <DashboardShell>
            <DashboardHeader heading="Поддержка" text="Добро пожаловать на страницу поддержки.">
                <Link
                    href="/dashboard"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "md:left-8 md:top-8"
                    )}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Назад
                    </>
                </Link>
            </DashboardHeader>
            <div >
                <p className="text-lg font-semibold">Как мы можем помочь вам?</p>
                <p className="text-muted-foreground">
                    Прежде чем обратиться к нам, вы можете всегда попробовать нашего чат-бота. Он знает много о нашей платформе и может помочь вам.
                </p>
                <div className="min-w-[85%] min-h-[15rem] text-left items-left pt-6">
                    <iframe
                        src="/embed/cm34soy3n0008weepcpcvmyif/window?chatbox=false"
                        className="overflow-hidden border border-1 rounded-lg shadow-lg w-full h-[65vh]"
                        allowFullScreen allow="clipboard-read; clipboard-write"
                    ></iframe>
                </div>
            </div>
        </DashboardShell >
    )
}