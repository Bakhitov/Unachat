"use client"

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
import { toast } from "@/components/ui/use-toast"
import { Chatbot } from "@prisma/client"
import { customizationSchema } from "@/lib/validations/customization"
import { useEffect, useRef, useState } from "react"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { GradientPicker } from "@/components/gradient-picker"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

interface ChatbotOperationsProps {
    chatbot: Chatbot
}

export function CustomizationSettings({ chatbot }: ChatbotOperationsProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [bubbleColor, setBubbleColor] = useState('')
    const [bubbleLogoColor, setBubbleLogoColor] = useState('')
    const [chatHeaderBackgroundColor, setChatHeaderBackgroundColor] = useState('')
    const [chatHeaderTextColor, setChatHeaderTextColor] = useState('')
    const [userBubbleColor, setUserBubbleColor] = useState('')
    const [userBubbleMessageColor, setUserBubbleMessageColor] = useState('')
    const [chatbotLogoURL, setChatbotLogoURL] = useState('')
    const [useDefaultImage, setUseDefaultImage] = useState<boolean>(true)

    const [isSaving, setIsSaving] = useState<boolean>(false)

    const form = useForm<z.infer<typeof customizationSchema>>({
        resolver: zodResolver(customizationSchema),
        defaultValues: {
            chatTitle: "",
            chatMessagePlaceHolder: "",
            bubbleColor: "",
            bubbleTextColor: "",
            chatHeaderBackgroundColor: "",
            chatHeaderTextColor: "",
            userReplyBackgroundColor: "",
            userReplyTextColor: "",
        },
    })

    useEffect(() => {
        const { setValue } = form;
        setValue("chatTitle", chatbot.chatTitle)
        setValue("chatMessagePlaceHolder", chatbot.chatMessagePlaceHolder)
        setValue("chatInputStyle", chatbot.chatInputStyle)
        setValue('chatHistoryEnabled', chatbot.chatHistoryEnabled)

        setBubbleColor(chatbot.bubbleColor)
        setBubbleLogoColor(chatbot.bubbleTextColor)
        setChatHeaderBackgroundColor(chatbot.chatHeaderBackgroundColor)
        setChatHeaderTextColor(chatbot.chatHeaderTextColor)
        setUserBubbleColor(chatbot.userReplyBackgroundColor)
        setUserBubbleMessageColor(chatbot.userReplyTextColor)
        setChatbotLogoURL(chatbot.chatbotLogoURL || '')

        if (chatbot.chatbotLogoURL) {
            setUseDefaultImage(false)
        }
    }, [
        chatbot.chatTitle,
        chatbot.chatMessagePlaceHolder,
        chatbot.chatInputStyle,
        chatbot.chatHistoryEnabled,
        chatbot.bubbleColor,
        chatbot.bubbleTextColor,
        chatbot.chatHeaderBackgroundColor,
        chatbot.chatHeaderTextColor,
        chatbot.userReplyBackgroundColor,
        chatbot.userReplyTextColor,
        chatbot.chatbotLogoURL,
        form
    ])

    useEffect(() => {
        if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
            setUseDefaultImage(false)
        }
    }, [inputFileRef.current?.files])

    async function onSubmit(data: z.infer<typeof customizationSchema>) {
        setIsSaving(true)

        if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
        }

        const fileImage = inputFileRef.current.files[0];

        const formData = new FormData();
        formData.append('chatTitle', data.chatTitle || '');
        formData.append('chatMessagePlaceHolder', data.chatMessagePlaceHolder || '');
        formData.append('bubbleColor', bubbleColor);
        formData.append('bubbleTextColor', bubbleLogoColor);
        formData.append('chatHeaderBackgroundColor', chatHeaderBackgroundColor);
        formData.append('chatHeaderTextColor', chatHeaderTextColor);
        formData.append('userReplyBackgroundColor', userBubbleColor);
        formData.append('userReplyTextColor', userBubbleMessageColor);
        formData.append('chatInputStyle', data.chatInputStyle);
        formData.append('chatHistoryEnabled', String(data.chatHistoryEnabled));

        if (useDefaultImage) {
            formData.set('chatbotLogoFilename', '');
            formData.set('chatbotLogo', '');
        } else if (fileImage) {
            formData.append('chatbotLogoFilename', fileImage.name);
            formData.append('chatbotLogo', fileImage);
        } else {
            formData.set('chatbotLogoFilename', 'keep-current-image');
            formData.set('chatbotLogo', '');
        }

        formData.append('useDefaultImage', String(useDefaultImage));

        const response = await fetch(`/api/chatbots/${chatbot.id}/config/customization?`, {
            method: "PATCH",
            body: formData,
        });

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
                description: "Ваш чатбот не обновлен. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        }

        toast({
            description: "Ваш чатбот обновлен.",
        })
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div>
                        <h3 className="mb-4 text-lg font-medium">Настройки чатбота</h3>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="chatTitle"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Заголовок чатбота
                                            </FormLabel>
                                            <FormDescription>
                                                Измените заголовок чатбота.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chatMessagePlaceHolder"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Текст заполнителя ввода сообщения
                                            </FormLabel>
                                            <FormDescription>
                                                Обновите текст заполнителя ввода сообщения.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="bubbleColor"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-4">
                                            <h1>Настройка виджета чатбота</h1>
                                            <div className="flex">
                                                <div className="flex flex-col w-full justify space-y-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Цвет чатбота
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите цвет, который вы хотите использовать для чатбота.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <GradientPicker background={bubbleColor} setBackground={setBubbleColor} />
                                                        </FormControl>
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Цвет логотипа чатбота
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите цвет, который вы хотите использовать для логотипа чатбота.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <GradientPicker withGradient={false} background={bubbleLogoColor} setBackground={setBubbleLogoColor} />
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="flex w-full items-center text-center justify-center">
                                                    <div className="ml-4 mr-4 shadow-lg border bg-white border-gray-200 rounded-full p-4" style={{ background: bubbleColor }}>
                                                        <Icons.message style={{ color: bubbleLogoColor }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="headerColor"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-4">
                                            <h1>Настройка заголовка чатбота</h1>
                                            <div className="flex">
                                                <div className="flex flex-col w-full justify space-y-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Цвет фона заголовка чатбота
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите цвет, который вы хотите использовать для фона заголовка чатбота.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <GradientPicker background={chatHeaderBackgroundColor} setBackground={setChatHeaderBackgroundColor} />
                                                        </FormControl>
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Цвет текста заголовка чатбота
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите цвет, который вы хотите использовать для текста заголовка чатбота.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <GradientPicker withGradient={false} background={chatHeaderTextColor} setBackground={setChatHeaderTextColor} />
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="flex w-full items-center text-center justify-center">
                                                    <div style={{ background: chatHeaderBackgroundColor }} className="flex rounded-t-lg shadow justify-between items-center p-4">
                                                        <h3 style={{ color: chatHeaderTextColor }} className="text-xl font-semibold">Чат с нашим AI</h3>
                                                        <div>
                                                            <Button variant="ghost">
                                                                <Icons.close style={{ color: chatHeaderTextColor }} className="h-5 w-5 text-gray-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="userReply"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-4">
                                            <h1>Настройка ответа пользователя</h1>
                                            <div className="flex">
                                                <div className="flex flex-col w-full justify space-y-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Цвет фона сообщения пользователя
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите цвет, который вы хотите использовать для фона сообщения пользователя.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <GradientPicker withGradient={false} background={userBubbleColor} setBackground={setUserBubbleColor} />
                                                        </FormControl>
                                                    </div>

                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Цвет текста сообщения пользователя
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите цвет, который вы хотите использовать для текста сообщения пользователя.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <GradientPicker withGradient={false} background={userBubbleMessageColor} setBackground={setUserBubbleMessageColor} />
                                                        </FormControl>
                                                    </div>

                                                </div>
                                                <div className="flex w-full items-center text-center justify-center">
                                                    <div key="0" className="flex w-5/6 items-end gap-2">
                                                        <div className="rounded-lg p-2" style={{ background: userBubbleColor }}>
                                                            <p className="text-md" style={{ color: userBubbleMessageColor }}> Я нуждаюсь в помощи с настройкой. Какой цвет выбрать?</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="chatbotLogo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-4">
                                            <h1>Изображения</h1>
                                            <div className="flex">
                                                <div className="flex flex-col w-full justify space-y-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Выберите изображение чатбота
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Выберите изображение, которое вы хотите использовать для чатбота. Изображение будет отображаться как профильное изображение чатбота.
                                                            Размер изображения должен быть 32x32 пикселя.
                                                        </FormDescription>
                                                        <FormControl>
                                                            <div className="space-y-2">
                                                                <Input name="file" ref={inputFileRef} type="file" onChange={
                                                                    (e) => {
                                                                        if (e.target.files && e.target.files.length > 0) {
                                                                            setUseDefaultImage(false)
                                                                        } else {
                                                                            setUseDefaultImage(true)
                                                                        }
                                                                    }
                                                                } />
                                                                <div className="flex space-x-2 flex-row">
                                                                    <Checkbox onCheckedChange={() => {
                                                                        setUseDefaultImage(!useDefaultImage)
                                                                    }} checked={useDefaultImage} ></Checkbox> <span className="text-sm text-muted-foreground">Использовать изображение по умолчанию</span>
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="flex w-full items-center text-center justify-center">
                                                    {chatbotLogoURL ? <Image className="boder rounded shadow" width={32} height={32} src={chatbotLogoURL} alt="chatbot logo" /> : <Icons.bot className="h-10 w-10" />}
                                                </div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="chatInputStyle"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-left justify-between rounded-lg border p-4">
                                        <div className="space-y-4">
                                            <h1>Стили</h1>
                                            <div className="flex">
                                                <div className="flex flex-col w-full justify space-y-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Измените стиль ввода сообщения
                                                        </FormLabel>
                                                        <FormDescription>
                                                            У вас есть два варианта: стандартный стиль или стиль полной ширины.
                                                            <br />
                                                            Стандартный стиль - это стандартный стиль ввода сообщения, ширина которого составляет половину экрана пользователя в режиме работы на компьютере.
                                                            <br />
                                                            Стиль полной ширины - это полная ширина экрана пользователя в режиме работы на компьютере.
                                                            <br />
                                                            Оба стиля имеют одинаковое поведение на мобильном режиме или режиме виджета, они будут влиять на интеграции с окнами.
                                                        </FormDescription>

                                                    </div>
                                                    <FormControl>
                                                        <RadioGroup
                                                            defaultValue={chatbot.chatInputStyle}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="default" id="default" />
                                                                <Label htmlFor="default">Стандартный стиль</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="full-width" id="full-width" />
                                                                <Label htmlFor="full-width">Полная ширина</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chatHistoryEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                История чата
                                            </FormLabel>
                                            <FormDescription>
                                                Включите или отключите историю чата. Включение истории чата позволит пользователям просматривать предыдущие чаты с вашим чатботом.
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
        </div>
    )
}
