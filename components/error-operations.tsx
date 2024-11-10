"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChatbotErrors } from "@prisma/client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"


interface ErrorOperationsProps {
    error: Pick<ChatbotErrors, "id" | "createdAt" | "chatbotId"> | undefined
}

export function ErrorOperations({ error }: ErrorOperationsProps) {
    const router = useRouter()
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

    async function deleteError(chatbotId: string, errorId: string) {
        const response = await fetch(`/api/chatbots/${chatbotId}/errors/${errorId}`, {
            method: "DELETE",
        })

        if (!response?.ok) {
            toast({
                title: "Что-то пошло не так.",
                description: "Ваша ошибка не была удалена. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        } else {
            toast({
                title: "Ошибка удалена.",
                description: "Ваша ошибка была успешно удалена.",
                variant: "default",
            })
        }

        router.refresh()
        return true
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Скачать</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Вы уверены, что хотите удалить эту ошибку?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие не может быть отменено.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (event: { preventDefault: () => void }) => {
                                event.preventDefault()
                                setIsDeleteLoading(true)

                                await deleteError(error?.chatbotId || "", error?.id || "")

                                setIsDeleteLoading(false)
                                setShowDeleteAlert(false)
                                router.refresh()
                            }}
                            className="bg-red-600 focus:ring-red-600"
                        >
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Удалить</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
