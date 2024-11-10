'use client'

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import Select from 'react-select'

import { eventGA } from "@/lib/googleAnalytics"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { chatbotSchema } from "@/lib/validations/chatbot"
import { ChatbotModel, File, User } from "@prisma/client"
import { Textarea } from "@/components/ui/textarea"

type FormData = z.infer<typeof chatbotSchema>

interface NewChatbotProps extends React.HTMLAttributes<HTMLElement> {
    isOnboarding: boolean
    user: Pick<User, "id">
}

interface Option {
    value: string
    label: string
}

export function NewChatbotForm({ isOnboarding, className, ...props }: NewChatbotProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(chatbotSchema),
        defaultValues: {
            welcomeMessage: "Привет, как я могу помочь вам?",
            prompt: "Вы - помощник, который помогает пользователям, посещающим наш сайт, держите ответы короткими, всегда ссылаясь на предоставленную документацию и никогда не просите больше информации.",
            chatbotErrorMessage: "Ой! Произошла ошибка. Если проблема не устранена, пожалуйста, обратитесь в нашу службу поддержки за помощью. Мы здесь, чтобы помочь!"
        }
    })

    const [models, setModels] = useState<ChatbotModel[]>([])
    const [availablesModels, setAvailablesModels] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const getAvailableModels = useCallback(async () => {
        const response = await fetch(`/api/users/${props.user.id}/openai/models`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const models = await response.json()
        return models
    }, [props.user.id])

    async function getFiles() {
        const response = await fetch('/api/files', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const files = await response.json()
        return files
    }

    useEffect(() => {
        const init = async () => {
            const response = await fetch('/api/models', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const models = await response.json()
            setModels(models)

            const supportedModels = await getAvailableModels()
            setAvailablesModels(supportedModels)

            const filesResponse = await getFiles()
            setFiles(filesResponse)
        }
        init()
    }, [getAvailableModels])

    async function onSubmit(data: FormData) {
        setIsSaving(true)
        console.log(data)

        const response = await fetch(`/api/chatbots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                prompt: data.prompt,
                openAIKey: data.openAIKey,
                welcomeMessage: data.welcomeMessage,
                chatbotErrorMessage: data.chatbotErrorMessage,
                modelId: data.modelId,
                files: data.files
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
            } else if (response.status === 402) {
                return toast({
                    title: "Превышен лимит чатботов.",
                    description: "Пожалуйста, обновитесь до более высокого плана.",
                    variant: "destructive",
                })
            }
            return toast({
                title: "Что-то пошло не так.",
                description: "Ваш чатбот не был сохранен. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваш чатбот был сохранен.",
        })

        eventGA({
            action: 'chatbot_created',
            label: 'Чатбот создан',
            value: data.name
        });

        router.refresh()

        if (!isOnboarding) {
            const object = await response.json()
            router.push(`/dashboard/chatbots/${object.chatbot.id}/chat`)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Создать новый чатбот</CardTitle>
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
                                    <FormLabel htmlFor="welcomemessage">
                                        Приветственное сообщение
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        value={field.value}
                                        id="welcomemessage"
                                    />
                                    <FormDescription>
                                        Приветственное сообщение, которое будет отправлено пользователю при начале диалога
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>)}
                        />
                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="prompt">
                                        Промпт по умолчанию
                                    </FormLabel >
                                    <Textarea
                                        onChange={field.onChange}
                                        value={field.value}
                                        id="prompt"
                                    />
                                    <FormDescription>
                                        По умолчанию, который будет отправлен в OpenAI для каждого сообщения, вот пример:
                                        &quot;Вы - помощник, который помогает пользователям, посещающим наш сайт, держите ответы короткими, всегда ссылаясь на предоставленную документацию и никогда не просите больше информации.&quot;
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
                                        Выберите файл для поиска
                                    </FormLabel>
                                    <Select<Option, true>
                                        isMulti
                                        closeMenuOnSelect={false}
                                        onChange={value => field.onChange(value.map((v) => v.value))}
                                        value={files.map(file => ({ value: file.id, label: file.name })).filter(option => 
                                            field.value?.includes(option.value)
                                        )}
                                        name="files"
                                        id="files"
                                        options={files.map((file) => ({ value: file.id, label: file.name }))}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <FormDescription>
                                        OpenAI модель будет использовать этот файл для поиска конкретного контента.
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
                                        OpenAI модель
                                    </FormLabel>
                                    <Select<Option>
                                        onChange={value => field.onChange(value?.value)}
                                        value={models
                                            .filter(model => model.id === field.value)
                                            .map(model => ({
                                                value: model.id,
                                                label: model.name
                                            }))[0]}
                                        id="modelId"
                                        options={models
                                            .filter((model: ChatbotModel) => availablesModels.includes(model.name))
                                            .map((model: ChatbotModel) => ({
                                                value: model.id,
                                                label: model.name
                                            }))}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <FormDescription>
                                        OpenAI модель, которая будет использоваться для генерации ответов.
                                        <b> Если у вас нет gpt-4 опции и вы хотите ее использовать, вам нужно иметь учетную запись OpenAI по крайней мере на уровне 1.</b>
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
                                        OpenAI API Key
                                    </FormLabel>
                                    <Input
                                        onChange={field.onChange}
                                        id="openAIKey"
                                        type="password"
                                    />
                                    <FormDescription>
                                        API ключ OpenAI, который будет использоваться для генерации ответов.
                                        Вы можете создать API ключ <Link target="_blank" className="underline" href='https://platform.openai.com/api-keys'>здесь</Link>.
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
                                        Сообщение при ошибке чатбота
                                    </FormLabel>
                                    <Textarea
                                        value={field.value}
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
                            <span>Создать</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
