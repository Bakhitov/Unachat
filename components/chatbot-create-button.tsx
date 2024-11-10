"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "./ui/use-toast"
import { Icons } from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface ChatbotCreateButtonProps extends ButtonProps { }

export function ChatbotCreateButton({
    className,
    variant,
    ...props
}: ChatbotCreateButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function GetFiles() {
        const files = await fetch(`/api/files`)
        return await files.json()
    }

    async function newChatbot() {
        setIsLoading(true)

        const files = await GetFiles()

        if (files.length === 0) {
            toast({
                title: "Файл не найден.",
                description: "Пожалуйста, загрузите файл или создайте веб-скрапер для импорта контента.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        router.refresh()

        router.push(`/dashboard/new/chatbot`)
    }

    async function importChatbot() {
        setIsLoading(true)
        router.refresh()
        router.push(`/dashboard/new/importChatbot`)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        buttonVariants({ variant }),
                        {
                            "cursor-not-allowed opacity-60": isLoading,
                        },
                        className
                    )}
                    disabled={isLoading}
                    {...props}
                >
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.add className="mr-2 h-4 w-4" />
                    )}
                    Новый чатбот
                </button>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span
                            onClick={newChatbot}
                            className="flex cursor-pointer items-center text-primary focus:text-primary"
                        >
                            <Icons.badgeplus className="mr-2 h-4 w-4" />
                            Создать чатбота
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span
                            onClick={importChatbot}
                            className="flex cursor-pointer items-center text-primary focus:text-primary"
                        >
                            <Icons.import className="mr-2 h-4 w-4" />
                            Импортировать OpenAI Assistant
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}