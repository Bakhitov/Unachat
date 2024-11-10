"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChatbotMessagesExport, File } from "@prisma/client"

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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Url } from "next/dist/shared/lib/router/router"


interface MessagesExportOperationsProps {
    messagesExport: Pick<ChatbotMessagesExport, "id" | "blobDownloadUrl" | "blobUrl"> | undefined
}

export function MessagesExportOperations({ messagesExport }: MessagesExportOperationsProps) {
    const router = useRouter()
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

    async function deleteMessageExport(messageExportId: string) {
        const response = await fetch(`/api/exports/${messageExportId}`, {
            method: "DELETE",
        })

        if (!response?.ok) {
            toast({
                title: "Ошибка при удалении экспорта.",
                description: "Экспорт не был удален. Пожалуйста, попробуйте снова.",
                variant: "destructive",
            })
        } else {
            toast({
                title: "Экспорт удален.",
                description: "Экспорт был успешно удален.",
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
                    <DropdownMenuItem>
                        <Link href={messagesExport?.blobDownloadUrl as Url} className="flex w-full">
                            Скачать
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
                            Вы уверены, что хотите удалить экспорт?
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

                                await deleteMessageExport(messagesExport?.id || "")

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
