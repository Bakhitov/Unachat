
import { DashboardConfig } from "@/types"

export const dashboardConfig: DashboardConfig = {
    mainNav: [
        {
            title: "Поддержка",
            href: "/dashboard/support",
        },
    ],
    sidebarNav: [
        {
            title: "Дашборд",
            href: "/dashboard",
            icon: "dashboard",
        },
        {
            title: "Чатботы",
            href: "/dashboard/chatbots",
            icon: "bot",
        },
        {
            title: "Краулеры",
            href: "/dashboard/crawlers",
            icon: "post",
        },
        {
            title: "Файлы",
            href: "/dashboard/files",
            icon: "folder",
        },
        {
            title: "Экспорты",
            href: "/dashboard/exports",
            icon: "download",
        },
        {
            title: "Платежи",
            href: "/dashboard/billing",
            icon: "billing",
        },
        {
            title: "Настройки",
            href: "/dashboard/settings",
            icon: "settings",
        }
    ],
}