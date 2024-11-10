import { getCurrentUser } from "@/lib/session"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Chatbot, User } from "@prisma/client"
import { db } from "@/lib/db"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ErrorItem } from "@/components/error-items"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

interface ChatbotSettingsProps {
    params: { chatbotId: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"], userId: User["id"]) {
    return await db.chatbot.findFirst({
        where: {
            id: chatbotId,
            userId: userId,
        },
    })
}

export default async function ChatbotErrorPage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await getChatbotForUser(params.chatbotId, user.id)

    if (!chatbot) {
        notFound()
    }

    const errors = await db.chatbotErrors.findMany({
        where: {
            chatbotId: chatbot.id
        }
    })

    return (
        <DashboardShell>
            <DashboardHeader heading="Ошибки чатбота" text="Все неожиданные ошибки, возникающие при использовании вашего чатбота.">
                <Link
                    href={`/dashboard/chatbots`}
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
            {errors.length ?
                <div className="divide-y divide-border rounded-md border">
                    {errors.map((error) => (
                        <ErrorItem error={error} key={error.id} />
                    ))}
                </div>
                :
                <div className="grid gap-10">
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="warning" />
                        <EmptyPlaceholder.Title>Нет ошибок чатбота</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            У вас нет ошибок чатбота. Будьте внимательны на этой странице, чтобы не пропустить неожиданные ошибки.
                        </EmptyPlaceholder.Description>
                    </EmptyPlaceholder>
                </div>
            }
        </DashboardShell >
    )
}