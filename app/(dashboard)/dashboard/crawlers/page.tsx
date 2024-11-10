
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { CrawlerCreateButton } from "@/components/crawler-create-button"
import { db } from "@/lib/db"
import { CrawlerItem } from "@/components/crawler-item"
import { siteConfig } from "@/config/site"


export const metadata = {
  title: `${siteConfig.name} - Парсеры`,
  description: "Управляйте вашими парсерами и их конфигурацией.",
}

export default async function CrawlersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const crawlers = await db.crawler.findMany({
    where: {
      userId: user.id,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Парсерами" text="Управляйте вашими парсерами и их конфигурацией.">
        <CrawlerCreateButton />
      </DashboardHeader>
      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
        <p className="font-bold text-md">Предупреждение</p>
        <p className="text-sm">Наши парсеры не поддерживают сайты, созданные с использованием javascript во время выполнения. Если ваш сайт не является SSR или статическим, мы не сможем получить контент.</p>
        <p className="text-sm">Мы рекомендуем использовать <a className="underline" href="https://github.com/BuilderIO/gpt-crawler">gpt-crawler</a> для локального кролирования вашего сайта и затем загрузить ваш файл в {siteConfig.name}.</p>
      </div>
      <div>
        {crawlers?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {crawlers.map((crawler: any) => (
              <CrawlerItem key={crawler.id} crawler={crawler} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>Нет парсеров</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              У вас нет парсеров. Начните импортировать контент.
            </EmptyPlaceholder.Description>
            <CrawlerCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell >
  )
}