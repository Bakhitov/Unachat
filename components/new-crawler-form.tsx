"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { crawlerSchema } from "@/lib/validations/crawler"
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


type FormData = z.infer<typeof crawlerSchema>

export function NewCrawlerForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(crawlerSchema),
        defaultValues: {
            selector: "body",
            maxPagesToCrawl: 150
        }
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/crawlers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                crawlUrl: data.crawlUrl,
                selector: data.selector,
                urlMatch: data.urlMatch,
                maxPagesToCrawl: data.maxPagesToCrawl
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            if (response.status === 402) {
                return toast({
                    title: "Предел парсоеров достигнут.",
                    description: "Пожалуйста, обновитесь до более высокого плана.",
                    variant: "destructive",
                })
            }

            return toast({
                title: "Что-то пошло не так.",
                description: "Ваш парсер не был сохранен. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваш парсер был успешно сохранен.",
        })
        const json = await response.json()
        router.push(`/dashboard/crawlers/${json.id}/crawl`)
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
                        <CardTitle>Создать новый парсер</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        Отображаемое название
                                    </FormLabel>
                                    <Input
                                        id="name"
                                        onChange={field.onChange}
                                        size={32}
                                    />
                                    <FormDescription>
                                        Отображаемое название в панели управления
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="crawlUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="crawlUrl">
                                    URL для кролирования
                                    </FormLabel >
                                    <Input
                                        onChange={field.onChange}
                                        id="crawlUrl"
                                    />
                                    <FormDescription>
                                        URL, с которого мы начнем кролирование. Убедитесь, что URL начинается с протокола https:// или http://
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="urlMatch"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="urlmatch">
                                        URL Match
                                    </FormLabel>
                                    <Input
                                        id="urlmatch"
                                        onChange={field.onChange}
                                    />
                                    <FormDescription>
                                        Когда мы кролим, мы будем всегда сопоставлять с этой строкой.
                                        Если вы хотите кролить все, поставьте ту же значение, что и URL для кролирования.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="selector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="selector">
                                        Селектор
                                    </FormLabel>
                                    <Input
                                        id="selector"
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                    <FormDescription>
                                        Селектор будет использоваться для получения контента из определенной части сайта.
                                        Вы можете протестировать ваш селектор, когда откроете ваш сайт с F12 в консоли и сделаете это: document.querySelector(&quot;[id=&apos;root&apos;]&quot;).
                                        Если вы хотите извлечь все контент, просто используйте: &apos;body&apos;
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxPagesToCrawl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="maxPagesToCrawl">
                                        Количество страниц для кролирования
                                    </FormLabel>
                                    <Input
                                        id="maxPagesToCrawl"
                                        type="number"
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                    />
                                    <FormDescription>
                                        Установите максимальное количество страниц для кролирования. Вы можете выбрать число от 1 до 200.
                                        Если у вас более 200 страниц, мы рекомендуем использовать ваш API или другую решение для получения данных.
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
        </Form >
    )
}
