"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chatbot, User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { importChatbotSchema } from "@/lib/validations/importChatbot"
import { Switch } from "./ui/switch"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Pick<Chatbot, "id" | "name" | "openaiKey" | "modelId" | "createdAt" | "welcomeMessage" | "prompt" | "chatbotErrorMessage" | "isImported" | "openaiId" | "rightToLeftLanguage">
    user: Pick<User, "id">
}

type FormData = z.infer<typeof importChatbotSchema>

export function ImportedChatbotForm({ chatbot, className, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(importChatbotSchema),
        defaultValues: {
            name: chatbot.name,
            openAIKey: chatbot.openaiKey,
            welcomeMessage: chatbot.welcomeMessage,
            chatbotErrorMessage: chatbot.chatbotErrorMessage,
            openAIAssistantId: chatbot.openaiId,
            rightToLeftLanguage: chatbot.rightToLeftLanguage,
        }
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function onSubmit(data: FormData) {
        console.log(data)
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/imported`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                openAIKey: data.openAIKey,
                openAIAssistantId: data.openAIAssistantId,
                welcomeMessage: data.welcomeMessage,
                chatbotErrorMessage: data.chatbotErrorMessage,
                rightToLeftLanguage: data.rightToLeftLanguage,
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
                description: "Ваш чатбот не был обновлен. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваш чатбот был обновлен.",
        })

        router.refresh()
    }

    return (
        <Form {...form}>
            <form
                className={cn(className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Настройки чатбота</CardTitle>
                        <CardDescription>
                            Обновите конфигурацию вашего чатбота.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        Отображаемое имя
                                    </FormLabel>

                                    <Input
                                        defaultValue={chatbot.name}
                                        onChange={field.onChange}
                                        id="name"
                                    />
                                    <FormDescription>
                                        Отображаемое имя, которое будет отображаться в панели управления
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="openAIAssistantId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="openAIAssistantId">
                                        OpenAI Assistant ID
                                    </FormLabel>

                                    <Input
                                        defaultValue={chatbot.openaiId}
                                        onChange={field.onChange}
                                        id="openAIAssistantId"
                                    />
                                    <FormDescription>
                                        ID помощника OpenAI, который уже существует в вашей учетной записи OpenAI.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="openAIKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="openAIKey">
                                        API ключ OpenAI
                                    </FormLabel>
                                    <Input
                                        defaultValue={chatbot.openaiKey}
                                        onChange={field.onChange}
                                        id="openAIKey"
                                        type="password"
                                    />
                                    <FormDescription>
                                        API ключ, который будет использоваться для генерации ответов
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="welcomeMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="welcomeMessage">
                                        Приветственное сообщение
                                    </FormLabel >
                                    <Input
                                        defaultValue={chatbot.welcomeMessage}
                                        onChange={field.onChange}
                                        id="welcomeMessage"
                                    />
                                    <FormDescription>
                                        Первое сообщение, которое будет отправлено пользователю при начале диалога с вашим чатботом.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chatbotErrorMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="chatbotErrorMessage">
                                        Сообщение об ошибке чатбота
                                    </FormLabel>
                                    <Textarea
                                        defaultValue={chatbot.chatbotErrorMessage}
                                        onChange={field.onChange}
                                        id="chatbotErrorMessage"
                                    />
                                    <FormDescription>
                                        Сообщение, которое будет отображаться, когда чатбот встречает ошибку и не может ответить пользователю.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rightToLeftLanguage"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-left justify-between">
                                    <FormLabel >
                                        Язык справа налево
                                    </FormLabel>
                                    <FormDescription>
                                        Если язык по умолчанию вашего чатбота справа налево, включите эту опцию. Это изменит макет чатбота, чтобы поддерживать языки справа налево.
                                        <br />
                                        Примеры языков справа налево: арабский, иврит, персидский, урду и др.
                                    </FormDescription>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <button
                            type="submit"
                            className={cn(buttonVariants(), className)}
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