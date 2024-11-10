"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chatbot, File, ChatbotModel, User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { chatbotSchema } from "@/lib/validations/chatbot"
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
import Select from 'react-select';
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "./ui/switch"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Pick<Chatbot, "id" | "name" | "openaiKey" | "modelId" | "createdAt" | "welcomeMessage" | "prompt" | "chatbotErrorMessage" | "isImported" | "rightToLeftLanguage">
    currentFiles: File["id"][]
    models: ChatbotModel[]
    files: File[]
    user: Pick<User, "id">
}

type FormData = z.infer<typeof chatbotSchema>

export function ChatbotForm({ chatbot, currentFiles, models, files, className, user, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(chatbotSchema),
        defaultValues: {
            name: chatbot.name || '',
            openAIKey: chatbot.openaiKey || '',
            welcomeMessage: chatbot.welcomeMessage || '',
            chatbotErrorMessage: chatbot.chatbotErrorMessage || '',
            prompt: chatbot.prompt || '',
            modelId: chatbot.modelId!,
            files: currentFiles,
            rightToLeftLanguage: chatbot.rightToLeftLanguage,
        }
    })
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [availablesModels, setAvailablesModels] = useState<string[]>([])

    useEffect(() => {
        async function getAvailableModels() {
            const response = await fetch(`/api/users/${user.id}/openai/models`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const models = await response.json()
            return models
        }

        async function init() {
            const supportedModels = await getAvailableModels()
            setAvailablesModels(supportedModels)
        }
        init()
    }, [user.id])

    async function onSubmit(data: FormData) {
        console.log(data)
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                openAIKey: data.openAIKey,
                modelId: data.modelId,
                welcomeMessage: data.welcomeMessage,
                chatbotErrorMessage: data.chatbotErrorMessage,
                prompt: data.prompt,
                files: data.files,
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
            description: "Ваш чатбот был успешно обновлен.",
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
                                        defaultValue={chatbot.name || ''}
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
                            name="welcomeMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="welcomeMessage">
                                        Приветственное сообщение
                                    </FormLabel >
                                    <Input
                                        defaultValue={chatbot.welcomeMessage || ''}
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
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="prompt">
                                        Prompt
                                    </FormLabel>
                                    <Textarea
                                        defaultValue={chatbot.prompt || ''}
                                        onChange={field.onChange}
                                        id="prompt"
                                    />
                                    <FormDescription>
                                        Это prompt, который будет отправлен в OpenAI, вот пример:
                                        &quot;Вы - помощник, который помогает пользователям, посещающим наш сайт, держите его коротким, всегда ссылаясь на предоставленную документацию и никогда не просите больше информации.&quot;
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="files">
                                        Выберите файл для извлечения
                                    </FormLabel>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        onChange={value => field.onChange(value.map((v) => v.value))}
                                        defaultValue={files.filter((file) => currentFiles.includes(file.id)).map((file) => ({ value: file.id, label: file.name }))}
                                        name="files"
                                        id="files"
                                        options={files.map((file) => ({ value: file.id, label: file.name }))}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />

                                    <FormDescription>
                                        Модель OpenAI будет использовать этот файл для поиска конкретного контента.
                                        Если у вас нет файла, это потому, что вы не опубликовали его.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="modelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="modelId">
                                        OpenAI Model
                                    </FormLabel>
                                    <Select
                                        onChange={value => field.onChange(value!.value)}
                                        defaultValue={models.filter((model: ChatbotModel) => model.id === chatbot.modelId).map((model: ChatbotModel) => ({ value: model.id, label: model.name }))[0]}
                                        id="modelId"
                                        options={
                                            models.filter((model: ChatbotModel) => availablesModels.includes(model.name)).map((model: ChatbotModel) => (
                                                { value: model.id, label: model.name }
                                            ))
                                        }
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <FormDescription>
                                        Модель OpenAI, которая будет использоваться для генерации ответов.
                                        <b> Если у вас нет опции gpt-4 и вы хотите ее использовать, вам нужно иметь учетную запись OpenAI по крайней мере на уровне 1.</b>
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
                                        OpenAI Key
                                    </FormLabel>
                                    <Input
                                        defaultValue={chatbot.openaiKey || ''}
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
                            name="chatbotErrorMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="chatbotErrorMessage">
                                        Сообщение об ошибке чатбота
                                    </FormLabel>
                                    <Textarea
                                        defaultValue={chatbot.chatbotErrorMessage || ''}
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
                                        <br/>
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
