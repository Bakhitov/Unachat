"use client"

import { useEffect, useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { advancedSettingsSecurityFormSchema } from "@/lib/validations/advancedSettings"
import { Tag, TagInput } from 'emblor';
import { Switch } from "@/components/ui/switch"

interface ChatbotFormProps extends React.HTMLAttributes<HTMLFormElement> {
    chatbot: Chatbot
}

type FormData = z.infer<typeof advancedSettingsSecurityFormSchema>

export function ChatbotAdvancedSecuritySettingsForm({ chatbot, ...props }: ChatbotFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(advancedSettingsSecurityFormSchema),
        defaultValues: {
            bannedIps: chatbot.bannedIps,
            allowEveryone: chatbot.allowEveryone,
            allowedIpRanges: chatbot.allowedIpRanges,
        },
    })

    const [bannedIps, setBannedIPs] = useState<Tag[]>([]);
    const [bannedIPsActiveTagIndex, setBannedIpsActiveTagIndex] = useState<number | null>(null);

    const [allowedIPs, setAllowedIPs] = useState<Tag[]>([]);
    const [allowedIPsActiveTagIndex, setAllowedIpsActiveTagIndex] = useState<number | null>(null);

    const { setValue } = form;
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        setAllowedIPs(chatbot.allowedIpRanges.map((ip, index) => ({ id: index.toString(), text: ip, label: ip, value: ip })))
        setBannedIPs(chatbot.bannedIps.map((ip, index) => ({ id: index.toString(), text: ip, label: ip, value: ip })))
    }, [chatbot.allowedIpRanges, chatbot.bannedIps])

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/security`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bannedIps: bannedIps.map(ip => ip.text),
                allowEveryone: data.allowEveryone,
                allowedIpRanges: allowedIPs.map(ip => ip.text),
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
                        <CardTitle>Безопасность чатбота</CardTitle>
                        <CardDescription>
                            Здесь вы можете настроить безопасные настройки для вашего чатбота.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="bannedIps"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="bannedIps">
                                        Запрещенные IP и диапазоны IP
                                    </FormLabel>
                                    <FormDescription>
                                        Эта функция позволяет запретить доступ к чатботу по определенным IP и диапазонам IP. Нажмите ENTER после ввода каждого IP или диапазона IP, чтобы добавить несколько.
                                    </FormDescription>
                                    <FormControl>
                                        <TagInput
                                            id="bannedIps"
                                            placeholder="Введите IP-адрес 127.0.0.1"
                                            tags={bannedIps}
                                            className="sm:min-w-[450px]"
                                            inlineTags={false}
                                            setTags={(tags: Tag[] | ((prevTags: Tag[]) => Tag[])) => {
                                                const newTags = Array.isArray(tags) ? tags : tags(bannedIps);
                                                setBannedIPs(newTags);
                                                setValue('bannedIps', newTags.map(tag => tag.text));
                                            }}
                                            activeTagIndex={bannedIPsActiveTagIndex}
                                            setActiveTagIndex={setBannedIpsActiveTagIndex}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="allowEveryone"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Разрешить доступ всем
                                        </FormLabel>
                                        <FormDescription>
                                            Эта функция позволяет всем пользователям получить доступ к чатботу. Вам необходимо разрешить доступ по IP.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="allowedIpRanges"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="allowedIpRanges">
                                        Разрешенные IP и диапазоны IP
                                    </FormLabel>
                                    <FormDescription>
                                        Эта функция позволяет указать IP и диапазоны IP, которые могут получить доступ к чатботу. Нажмите ENTER после ввода каждого IP или диапазона IP, чтобы добавить несколько.
                                    </FormDescription>
                                    <FormControl>
                                        <TagInput
                                            id="allowedIpRanges"
                                            placeholder="Введите диапазон IP 10.0.0.0/16"
                                            tags={allowedIPs}
                                            className="sm:min-w-[450px]"
                                            inlineTags={false}
                                            setTags={(tags: Tag[] | ((prevTags: Tag[]) => Tag[])) => {
                                                const newTags = Array.isArray(tags) ? tags : tags(allowedIPs);
                                                setAllowedIPs(newTags);
                                                setValue('allowedIpRanges', newTags.map(tag => tag.text));
                                            }}
                                            activeTagIndex={allowedIPsActiveTagIndex}
                                            setActiveTagIndex={setAllowedIpsActiveTagIndex}
                                        />
                                    </FormControl>
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
