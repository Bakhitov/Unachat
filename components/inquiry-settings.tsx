"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { buttonVariants } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Chatbot } from "@prisma/client"
import { Icons } from "./icons"
import { inquiryCustomizationSchema } from "@/lib/validations/inquiryCustomization"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"

interface ChatbotOperationsProps {
    chatbot: Pick<Chatbot, "id" | "name" | "modelId">
}

export function InquirySettings({ chatbot }: ChatbotOperationsProps) {
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const form = useForm<z.infer<typeof inquiryCustomizationSchema>>({
        resolver: zodResolver(inquiryCustomizationSchema),
        defaultValues: {
            inquiryEnabled: false,
        },
    })

    useEffect(() => {
        fetch(`/api/chatbots/${chatbot.id}/config`, {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            form.setValue("inquiryEnabled", data.inquiryEnabled)
            form.setValue("inquiryLinkText", data.inquiryLinkText)
            form.setValue("inquiryTitle", data.inquiryTitle)
            form.setValue("inquirySubtitle", data.inquirySubtitle)
            form.setValue("inquiryEmailLabel", data.inquiryEmailLabel)
            form.setValue("inquiryMessageLabel", data.inquiryMessageLabel)
            form.setValue("inquirySendButtonText", data.inquirySendButtonText)
            form.setValue("inquiryAutomaticReplyText", data.inquiryAutomaticReplyText)
            form.setValue("inquiryDisplayLinkAfterXMessage", data.inquiryDisplayLinkAfterXMessage)
        })
    }, [chatbot.id, form])

    async function onSubmit(data: z.infer<typeof inquiryCustomizationSchema>) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/inquiry`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inquiryEnabled: data.inquiryEnabled,
                inquiryLinkText: data.inquiryLinkText,
                inquiryTitle: data.inquiryTitle,
                inquirySubtitle: data.inquirySubtitle,
                inquiryEmailLabel: data.inquiryEmailLabel,
                inquiryMessageLabel: data.inquiryMessageLabel,
                inquirySendButtonText: data.inquirySendButtonText,
                inquiryAutomaticReplyText: data.inquiryAutomaticReplyText,
                inquiryDisplayLinkAfterXMessage: data.inquiryDisplayLinkAfterXMessage,
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
                    title: "Чатбот не настраиваемый.",
                    description: "Пожалуйста, обновитесь до более высокого плана.",
                    variant: "destructive",
                })
            }

            return toast({
                title: "Что-то пошло не так.",
                description: "Настройки запроса не были обновлены. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Настройки запроса были обновлены.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="inquiryEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Включить форму для заявок
                                        </FormLabel>
                                        <FormDescription>
                                            Включить или отключить форму для заявок пользователя / поддержки. Когда включена, пользователи могут создавать заявки в чатбот и вы будете видеть их в панели управления.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryLinkText"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Текст формы заявки
                                        </FormLabel>
                                        <FormDescription>
                                            Текст, который просит пользователей нажать на ссылку, ведущую к форме заявки.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryTitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Заголовок формы заявки
                                        </FormLabel>
                                        <FormDescription>
                                            Заголовок формы заявки.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquirySubtitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Подзаголовок формы заявки
                                        </FormLabel>
                                        <FormDescription>
                                            Подзаголовок формы заявки.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryAutomaticReplyText"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Текст автоматического ответа на заявку
                                        </FormLabel>
                                        <FormDescription>
                                            Текст, который будет отправлен пользователю после того, как они отправят заявку.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryEmailLabel"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Текст над полем ввода email
                                        </FormLabel>
                                        <FormDescription>
                                            Текст, который будет отображаться над полем ввода email.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryMessageLabel"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Текст над полем ввода сообщения
                                        </FormLabel>
                                        <FormDescription>
                                            Текст, который будет отображаться над полем ввода сообщения.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquirySendButtonText"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Текст в кнопке отправки
                                        </FormLabel>
                                        <FormDescription>
                                            Текст, который будет отображаться в кнопке отправки.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inquiryDisplayLinkAfterXMessage"
                            render={({ field }) => (
                                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Отобразить ссылку после X ответов чатбота
                                        </FormLabel>
                                        <FormDescription>
                                        Количество ответов чатбота после которого будет отображаться форма заявки. Чем больше число, тем меньше заявок вы будете получать.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={5}
                                            defaultValue={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
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
            </form>
        </Form>
    )
}
