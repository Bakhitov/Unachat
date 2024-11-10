"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { openAIConfigSchema } from "@/lib/validations/openaiConfig"
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
import { Form, FormField, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id">
}

type FormData = z.infer<typeof openAIConfigSchema>

export function OpenAIForm({ user, className, ...props }: UserNameFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(openAIConfigSchema),
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/users/${user.id}/openai`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                globalAPIKey: data.globalAPIKey,
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            if (response.status === 400) {
                return toast({
                    title: "Неверный API ключ.",
                    description: "Ваш API ключ был неверным, попробуйте создать новый.",
                    variant: "destructive",
                })
            }

            return toast({
                title: "Что-то пошло не так.",
                description: "Ваша конфигурация OpenAI не была обновлена. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваша конфигурация OpenAI была обновлена.",
        })

        router.refresh()
        window.location.reload()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card className={cn(className)}>
                    <CardHeader>
                        <CardTitle>Конфигурация вашего аккаунта</CardTitle>
                        <CardDescription>
                            Ваш глобальный API ключ для OpenAI будет использован для всех ваших глобальных конфигураций. Важно установить его перед созданием чатбота.
                            Вы можете создать ваш API ключ <Link target="_blank" className="underline" href='https://platform.openai.com/api-keys'>здесь</Link>.
                            <br className="pb-2" />
                            <br className="pb-2" />
                            Вам необходимо <Link className="underline" href="https://platform.openai.com/settings/organization/billing/payment-methods"> добавить способ оплаты </Link> к вашему аккаунту OpenAI, чтобы увеличить ограничения по скорости, даже если вы используете их бесплатные кредиты.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="globalAPIKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="globalAPIKey">
                                        Глобальный API ключ OpenAI
                                    </FormLabel>
                                    <Input
                                        type="password"
                                        onChange={field.onChange}
                                        id="globalAPIKey"
                                    />
                                    <FormDescription>
                                        Этот API ключ будет использован для вашей глобальной конфигурации. Вы можете выбрать создать новый для вашего чатбота.
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
                            <span>Сохранить</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}