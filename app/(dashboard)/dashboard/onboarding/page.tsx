import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UploadFileForm } from "@/components/upload-file-form"
import { NewChatbotForm } from "@/components/new-chatbot-form"

import { db } from "@/lib/db"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OpenAIForm } from "@/components/openai-config-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


export const metadata = {
  title: `${siteConfig.name} - Быстрый старт!`,
  description: "Onaychat - Создайте свой первый чатбот",
}

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  let currentStep = 1

  const openAIConfig = await db.openAIConfig.findFirst({
    select: {
      id: true,
      globalAPIKey: true,
    },
    where: {
      userId: user.id,
    },
  })

  if (openAIConfig) {
    currentStep = 2
  }

  const files = await db.file.count({
    where: {
      userId: user.id,
    },
  })

  if (files > 0) {
    currentStep = 3
  }

  const chatbot = await db.chatbot.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (chatbot) {
    currentStep = 4
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Быстрый старт!" text="Пошаговое руководство по созданию вашего первого чатбота">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "md:left-8 md:top-8"
          )}
        >
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Назад
          </>
        </Link>
      </DashboardHeader>
      <div className="flex">
        <aside className="w-64 h-full border-r">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Шаги прогресса</h2>
            <div className="space-y-6">
              <Card className={currentStep > 1 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">1</Badge>
                    <h3 className="text-lg font-medium">Конфигурация</h3>
                  </div>
                </CardHeader>
                {currentStep == 1 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Этот шаг, где мы конфигурируем ваш API Key OpenAI. Вам нужно будет перейти <a target="_blank" className="underline" href="https://platform.openai.com/account/api-keys">сюда</a> для создания вашего API Key. После этого вы можете вставить его в форму ниже.
                    </p>
                  </CardContent>
                }
              </Card>
              <Card className={currentStep > 2 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">2</Badge>
                    <h3 className="text-lg font-medium">Загрузка файла</h3>
                  </div>
                </CardHeader>

                {currentStep == 2 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Этот шаг, где вы загружаете файл для вашего чатбота для использования. Этот файл может быть PDF, Word документом или текстовым файлом. Он будет использован для обучения вашего чатбота.
                    </p>
                  </CardContent>
                }
              </Card>
              <Card className={currentStep > 3 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">3</Badge>
                    <h3 className="text-lg font-medium">Создание чатбота</h3>
                  </div>
                </CardHeader>

                {currentStep == 3 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Этот шаг, где вы создаете вашего первого умный чатбота. После этого мы сможем общаться с ним. 🤖
                    </p>
                  </CardContent>
                }
              </Card>
              <Card className={currentStep > 4 ? "border border-green-500 p-4" : "p-4"}>
                <CardHeader>
                  <div className="flex items-center">
                    <Badge className="mr-2">4</Badge>
                    <h3 className="text-lg font-medium">Чат с чатботом</h3>
                  </div>
                </CardHeader>

                {currentStep == 4 &&
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Чат с вашим чатботом впервые! 🎉
                    </p>
                  </CardContent>
                }
              </Card>
            </div>
          </div>
        </aside>
        <main className="flex-grow p-6">
          {currentStep == 1 &&
            <OpenAIForm user={{ id: user.id }} />
          }
          {currentStep == 2 &&
            <UploadFileForm />
          }
          {currentStep == 3 &&
            <NewChatbotForm user={user} isOnboarding={true} />
          }
          {currentStep == 4 &&
            <div>
              <div className="mb-4 bg-blue-100 border-l-4 border-blue-500 text-black p-4" role="info">
                <p className="font-bold text-md">Поздравляем 🎉 </p>
                <p className="text-sm">Теперь, когда ваш первый чатбот создан, вы можете начать общаться с ним.</p>
                <p className="text-sm">Есть еще один шаг, если вы хотите встроить чатбота на ваш сайт, как мы это сделали для этого сайта, на котором вы сейчас находитесь.</p>
                <br />
                <p className="borderinline-flex items-center text-sm justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background" >
                  <Link href={`/dashboard/chatbots/${chatbot!.id}/embed`} className="flex w-full">
                    <Button>
                    Узнайте, как встроить наш чатбот на ваш сайт
                    </Button>
                  </Link>
                </p>
              </div>
              <iframe
              src={`/embed/${chatbot?.id}/window?chatbox=false`}
              className="overflow-hidden border border-1 rounded-lg shadow-lg w-full h-[65vh]"
              allowFullScreen allow="clipboard-read; clipboard-write"
            ></iframe>
            </div>
          }

        </main>
      </div>
    </DashboardShell >
  )
}