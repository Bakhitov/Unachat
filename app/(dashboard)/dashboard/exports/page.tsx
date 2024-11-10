import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/config/site"
import { ChatExportItem } from "@/components/chat-export-items"
import { MessageExportButton } from "@/components/export-messages-button"

export const metadata = {
    title: `${siteConfig.name} - Exported Messages`,
}

export default async function MessagesExportPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbots = await db.chatbot.findMany({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            name: true,
            ChatbotMessagesExport: {
                select: {
                    id: true,
                    blobDownloadUrl: true,
                    blobUrl: true,
                    lastXDays: true,
                    createdAt: true,

                }
            }
        },
    })

    return (
        <DashboardShell>
            <DashboardHeader heading="Экспорт сообщений" text="Экспорт сообщений из вашего чатбота. Эта функция создаст JSON файл со всеми сообщениями, полученными от чатбота.">
            </DashboardHeader>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                <p className="font-bold text-md">Нужна помощь при использовании экспорта сообщений?</p>
                <p>Проверьте наш гайд о том, как правильно использовать экспорт сообщений.</p>
                <p>Нажмите <a href='/guides/how-to-use-message-exports-correctly' className="underline">здесь</a>, чтобы открыть наш гайд.</p>
            </div>
            <div className="flex flex-col">
                <div className="mb-4 flex items-center justify-between px-2">
                    <Label className="text-lg">Все экспорты сообщений</Label>
                    <MessageExportButton variant={"outline"} />
                </div>
                {chatbots.length > 0 && chatbots.some(chatbot => chatbot.ChatbotMessagesExport.length > 0) ?
                    <div className="">
                        {
                            chatbots.map((chatbot) => (
                                chatbot.ChatbotMessagesExport.length > 0 && (
                                    <div key={chatbot.id}>
                                        <div className="divide-y divide-border rounded-md border">
                                            {
                                                chatbot.ChatbotMessagesExport.map((messagesExport) => (
                                                    <ChatExportItem key={messagesExport.id} messagesExport={messagesExport} chatbotName={chatbot.name} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            ))
                        }
                    </div>
                    : <div className="grid gap-10">
                        <EmptyPlaceholder>
                            <EmptyPlaceholder.Icon name="folder" />
                            <EmptyPlaceholder.Title>Создать экспорт сообщений</EmptyPlaceholder.Title>
                            <EmptyPlaceholder.Description>
                                Вы можете экспортировать сообщения вашего чатбота в файл.
                            </EmptyPlaceholder.Description>
                            <MessageExportButton variant={"outline"} />
                        </EmptyPlaceholder>
                    </div>
                }
            </div>
        </DashboardShell >
    )
}