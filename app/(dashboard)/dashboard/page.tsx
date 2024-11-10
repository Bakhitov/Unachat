import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ChatbotCreateButton } from "@/components/chatbot-create-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { MessagesOverview } from "@/components/message-overview"
import { Button } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { InquiryItem } from "@/components/inquiry-item"
import { ErrorShortItem } from "@/components/error-short-item"
import { constructMetadata } from "@/lib/construct-metadata"

export const metadata = constructMetadata()

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const bots = await db.chatbot.count({
    where: {
      userId: user.id,
    },
  })

  const crawlers = await db.crawler.count({
    where: {
      userId: user.id,
    },
  })

  const files = await db.file.count({
    where: {
      userId: user.id,
    },
  })

  const messageCountLast30Days = await db.message.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    }
  })

  // get message for each day for the last 7 days
  const messages = await db.message.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    },
    select: {
      createdAt: true,
    },
  })

  const data: any = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    data.push({ name: formattedDate, total: 0 });
  }

  // Count messages for each day
  messages.forEach(message => {
    const messageDate = message.createdAt.toISOString().split('T')[0];
    const dataEntry = data.find(entry => entry.name === messageDate);
    if (dataEntry) {
      dataEntry.total++;
    }
  });

  // Reverse the data array to start from the oldest date
  data.reverse();

  const chatbotIds = await db.chatbot.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  })

  const userInquiries = await db.clientInquiries.findMany({
    select: {
      id: true,
      chatbotId: true,
      threadId: true,
      email: true,
      inquiry: true,
      createdAt: true,
    },
    where: {
      chatbotId: {
        in: chatbotIds.map(chatbot => chatbot.id),
      },
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  const chatbotErrors = await db.chatbotErrors.findMany({
    where: {
      chatbotId: {
        in: chatbotIds.map(chatbot => chatbot.id),
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  const chatbotNamesForIds = await db.chatbot.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
    }
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Дашборд" text="Добро пожаловать в ваш чатбот">
        <ChatbotCreateButton />
      </DashboardHeader>
      <div>
        {bots === 0 &&
          <div className="mb-4 bg-blue-100 border-l-4 border-blue-500 text-black p-4" role="info">
            <p className="font-bold text-md">Добро пожаловать в {siteConfig.name} 🎉</p>
            <p className="text-sm">Вы, вероятно, новичок на этой платформе.</p>
            <p className="text-sm">Мы рекомендуем начать с нашего <a className="underline" href="/dashboard/onboarding">Быстрый старт! </a> для пошагового руководства по созданию вашего первого чатбота.</p>
            <p className="text-sm">Если вы предпочитаете, вы можете также начать с нашего <a target="_blank" className="underline" href="/guides/how-to-build-smart-chatbot-for-your-webiste">учебника</a>.</p>
            <br />
            <a href="/dashboard/onboarding"><Button><p className="pr-2">Открыть быстрый старт</p>  <Icons.help className="h-4 w-4" /> ‍</Button></a>
          </div>
        }
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего чатботов
              </CardTitle>
              <Icons.bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bots}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего парсеров
              </CardTitle>
              <Icons.post className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crawlers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего файлов
              </CardTitle>
              <Icons.folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Сообщений за 30 дней
              </CardTitle>
              <Icons.message className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageCountLast30Days}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Сообщений за день</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <MessagesOverview items={data} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Последние запросы пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            {userInquiries.length ?
              <div className="grid gap-2 w-full">
                {
                  userInquiries.map((inquiry) => (
                    <InquiryItem key={inquiry.id} inquiry={inquiry} chatbotName={
                      chatbotNamesForIds.find(chatbot => chatbot.id === inquiry.chatbotId)?.name || ''
                    }></InquiryItem>
                  ))
                }
              </div>
              :
              <div className="grid gap-10">
                <EmptyPlaceholder className="border-0">
                  <EmptyPlaceholder.Icon name="help" />
                  <EmptyPlaceholder.Title>Нет новых запросов пользователей</EmptyPlaceholder.Title>
                  <EmptyPlaceholder.Description>
                    У вас нет новых запросов пользователей. Запросы пользователей по умолчанию отключены, вы можете их включить в настройках вашего чатбота.
                  </EmptyPlaceholder.Description>
                </EmptyPlaceholder>
              </div>
            }
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Последние ошибки чатбота</CardTitle>
        </CardHeader>
        <CardContent>
          {chatbotErrors.length ?
            <div className="grid gap-2 w-full">
              {
                chatbotErrors.map((error) => (
                  <ErrorShortItem key={error.id} error={error} chatbotName={
                    chatbotNamesForIds.find(chatbot => chatbot.id === error.chatbotId)?.name || ''
                  }></ErrorShortItem>
                ))
              }
            </div>
            :
            <div className="grid gap-10">
              <EmptyPlaceholder className="border-0">
                <EmptyPlaceholder.Icon name="warning" />
                <EmptyPlaceholder.Title>Нет ошибок чатбота</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Если у вас есть ошибки, вы увидите подробный разбор ошибок, созданных пользователями в вашем чатботе.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </div>
          }
        </CardContent>
      </Card>
    </DashboardShell >
  )
}