"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chatbot } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { advancedSettingsSchema } from "@/lib/validations/advancedSettings"
import Link from "next/link"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Pick<Chatbot, "id" | "maxCompletionTokens" | "maxPromptTokens">
}

type FormData = z.infer<typeof advancedSettingsSchema>

export function ChatbotAdvancedSettingsForm({ chatbot, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(advancedSettingsSchema),
        defaultValues: {
            maxCompletionTokens: chatbot.maxCompletionTokens || undefined,
            maxPromptTokens: chatbot.maxPromptTokens || undefined,
        }
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/advanced`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                maxCompletionTokens: data.maxCompletionTokens,
                maxPromptTokens: data.maxPromptTokens,
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {

            if (response.status === 400) {
                return toast({
                    title: "Что-то пошло не так.",
                    description: await response.text(),
                    variant: "destructive",
                })
            }

            return toast({
                title: "Что-то пошло не так.",
                description: "Ваши настройки не обновлены. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваши настройки теперь обновлены.",
        })

        router.refresh()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Максимальное кол-во токенов запроса</CardTitle>
                        <CardDescription>
                            Это максимальное количество токенов, которое может быть использовано в запросе и для завершения, чтобы узнать больше о токенах, пожалуйста, обратитесь к документации.
                            <Link href="https://platform.openai.com/docs/assistants/how-it-works/managing-threads-and-messages" className="underlined">Узнать больше</Link>
                            <br />
                            При использовании вложений файлов мы рекомендуем установить максимальное количество токенов запроса не менее 20 000. Для более длинных диалогов или нескольких взаимодействий с вложениями файлов рассмотрите увеличение этого предела до 50 000, или, в идеале, полностью удалите ограничения на максимальное количество токенов запроса, чтобы получить наилучшие результаты.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="maxPromptTokens"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="maxPromptTokens">
                                        Максимальное кол-во токенов запроса
                                    </FormLabel>

                                    <Input
                                        defaultValue={chatbot.maxPromptTokens || undefined}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        type="number"
                                        id="maxPromptTokens"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxCompletionTokens"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="maxCompletionTokens">
                                        Максимальное кол-во токенов завершения
                                    </FormLabel>

                                    <Input
                                        defaultValue={chatbot.maxCompletionTokens || undefined}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        type="number"
                                        id="maxCompletionTokens"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <button
                            type="submit"
                            className={buttonVariants()}
                            disabled={isSaving}
                        >
                            {isSaving && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Сохранить</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}