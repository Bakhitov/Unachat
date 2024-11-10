"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Crawler } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { crawlerSchema } from "@/lib/validations/crawler"
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
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface CrawlerFormProps extends React.HTMLAttributes<HTMLFormElement> {
    crawler: Pick<Crawler, "id" | "name" | "crawlUrl" | "selector" | "urlMatch" | "maxPagesToCrawl">
}

type FormData = z.infer<typeof crawlerSchema>

export function CrawlerForm({ crawler, className, ...props }: CrawlerFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(crawlerSchema),
        defaultValues: {
            name: crawler?.name || "",
            crawlUrl: crawler?.crawlUrl || "",
            selector: crawler?.selector || "",
            urlMatch: crawler?.urlMatch || "",
            maxPagesToCrawl: crawler?.maxPagesToCrawl || 150
        },
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/crawlers/${crawler.id}`, {
            method: "PATCH",
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
            return toast({
                title: "Что-то пошло не так.",
                description: "Ваш парсер не был обновлен. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваш парсер был успешно обновлен.",
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
                        <CardTitle>Настройки парсера</CardTitle>
                        <CardDescription>
                            Обновите конфигурацию вашего парсера.
                        </CardDescription>
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
                                        defaultValue={crawler?.name || ""}
                                        onChange={field.onChange}
                                        id="name"
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
                                        URL для краулинга
                                    </FormLabel>
                                    <Input
                                        defaultValue={crawler?.crawlUrl || ""}
                                        onChange={field.onChange}
                                        id="crawlUrl"
                                    />
                                    <FormDescription>
                                        URL, с которого мы начнем краулинг. Убедитесь, что URL начинается с протокола https:// или http://
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
                                    </FormLabel >
                                    <Input
                                        defaultValue={crawler?.urlMatch || ""}
                                        onChange={field.onChange}
                                        id="urlmatch"
                                    />
                                    <FormDescription>
                                        Когда мы краулим, мы будем всегда соответствовать этой строке.
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
                                        defaultValue={crawler?.selector || ""}
                                        onChange={field.onChange}
                                        id="selector"
                                    />
                                    <FormDescription>
                                        Селектор будет использоваться для выбора содержимого из определенной части веб-сайта. Вы можете протестировать ваш селектор, когда откроете ваш веб-сайт с F12 в консоли и выполните это: document.querySelector(&quot;[id=&apos;root&apos;]&quot;).
                                        Если вы хотите извлечь все содержимое, просто используйте: &apos;body&apos;
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
                                        Количество страниц для краулинга
                                    </FormLabel>
                                    <Input
                                        id="maxPagesToCrawl"
                                        type="number"
                                        onChange={e => field.onChange(Number(e.target.value))}
                                        value={field.value}
                                    />
                                    <FormDescription>
                                        Установите максимальное количество страниц для краулинга. Вы можете выбрать число от 1 до 200.
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
                            <span>Сохранить</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form >
    )
}