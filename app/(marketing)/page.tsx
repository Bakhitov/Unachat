import { GithubCard } from "@/components/github-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { FAQ } from '@/components/faq';
import { freePlan, basicPlan, proPlan } from "@/config/subscriptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IndexPage() {

  return (
    <>
      <section data-aos="fade-up" className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 py-12 md:py-24 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xl border shadow-md bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Найти нас в 𝕏
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Создать AI чат-бота с помощью Onaychat
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Платформа для создания чат-ботов с помощью API Assistant. Мы предлагаем бесшовную интеграцию для безупречного включения чат-бота на ваш сайт.
          </p>
          <div className="space-x-4 space-y-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              <Icons.bot className="h-4 w-4 mr-2"></Icons.bot>
              Начать бесплатно
            </Link>
          </div>
          <Image data-aos="zoom-in" priority={false} className="mt-10 border shadow-lg" src="/dashboard.png" width={810} height={540} alt="Dashboard" />
        </div>
      </section>
      <section data-aos="fade-up" id="chat" className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Попробуйте наш демо AI чат-бот прямо сейчас
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Задайте любой вопрос о нашей платформе и посмотрите, как он ответит.
          </p>
          <div className="min-w-[85%] min-h-[15rem] text-left items-left pt-6">
            <iframe
              src="/embed/cm34soy3n0008weepcpcvmyif/window?chatbox=false&defaultMessage=How%20many%20chatbot%20can%20I%20create%20for%20free?"
              className="overflow-hidden border border-1 rounded-lg shadow-lg w-full h-[65vh]"
              allowFullScreen allow="clipboard-read; clipboard-write"
            ></iframe>
          </div>
        </div>
      </section>
      <section data-aos="fade-up" id="features" className="container space-y-6 py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Возможности
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Создайте своего AI чат-бота с помощью Unachat. Просто предоставьте URL и мы закончим работу.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-6">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid" viewBox="0 0 256 260"><path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" /></svg>
              <div className="space-y-2">
                <h3 className="font-bold">OpenAI Assistants</h3>
                <p className="text-sm">
                  Мы используем OpenAI Assistant для создания нашего чат-бота. Вы можете использовать GPT-4, GTP-3.5 и GPT-4o
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 190.5 190.5"><path fill="#fff" d="M95.252 142.873c26.304 0 47.627-21.324 47.627-47.628s-21.323-47.628-47.627-47.628-47.627 21.324-47.627 47.628 21.323 47.628 47.627 47.628z" /><path fill="#229342" d="m54.005 119.07-41.24-71.43a95.227 95.227 0 0 0-.003 95.25 95.234 95.234 0 0 0 82.496 47.61l41.24-71.43v-.011a47.613 47.613 0 0 1-17.428 17.443 47.62 47.62 0 0 1-47.632.007 47.62 47.62 0 0 1-17.433-17.437z" /><path fill="#fbc116" d="m136.495 119.067-41.239 71.43a95.229 95.229 0 0 0 82.489-47.622A95.24 95.24 0 0 0 190.5 95.248a95.237 95.237 0 0 0-12.772-47.623H95.249l-.01.007a47.62 47.62 0 0 1 23.819 6.372 47.618 47.618 0 0 1 17.439 17.431 47.62 47.62 0 0 1-.001 47.633z" /><path fill="#1a73e8" d="M95.252 132.961c20.824 0 37.705-16.881 37.705-37.706S116.076 57.55 95.252 57.55 57.547 74.431 57.547 95.255s16.881 37.706 37.705 37.706z" /><path fill="#e33b2e" d="M95.252 47.628h82.479A95.237 95.237 0 0 0 142.87 12.76 95.23 95.23 0 0 0 95.245 0a95.222 95.222 0 0 0-47.623 12.767 95.23 95.23 0 0 0-34.856 34.872l41.24 71.43.011.006a47.62 47.62 0 0 1-.015-47.633 47.61 47.61 0 0 1 41.252-23.815z" /></svg>
              <div className="space-y-2">
                <h3 className="font-bold">Легкая интеграция</h3>
                <p className="text-sm">
                  Добавьте несколько строк кода на ваш сайт, и чат-бот будет работать.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Icons.import></Icons.import>
              <div className="space-y-2">
                <h3 className="font-bold">Получение заявок</h3>
                <p className="text-sm">
                  Пользователи могут вводить контактную информацию с вопросом, и вы можете собирать заявки.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Icons.key></Icons.key>
              <div className="space-y-2">
                <h3 className="font-bold">Без дополнительных затрат</h3>
                <p className="text-sm">
                  Вы получаете счет напрямую от OpenAI.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Icons.folder></Icons.folder>
              <div className="space-y-2">
                <h3 className="font-bold">Прикрепление файлов</h3>
                <p className="text-sm">
                  Вы можете прикрепить файл CSV, XML, изображения и т.д. в чат, и чат-бот будет анализировать его.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {/** can add text eher */}
          </p>
        </div>
      </section>

      <section data-aos="fade-up" id="integrations" className="container py-12 md:py-24 lg:py-32">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Совместимость с вашей платформой
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Легко интегрировать с популярными веб-платформами.
              </p>
            </div>
            <div className="w-full max-w-4xl">
              <div className="grid w-full items-center justify-center gap-12 md:grid-cols-4 lg:gap-6">
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Image
                    alt="WordPress"
                    className="rounded-lg aspect-[2/1] overflow-hidden object-contain object-center"
                    height="60"
                    src="/wordpress.svg"
                    width="120"
                  />
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Image
                    alt="Shopify"
                    className="rounded-lg aspect-[2/1] overflow-hidden object-contain object-center"
                    height="60"
                    src="/shopify.svg"
                    width="120"
                  />
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Image
                    alt="Squarespace"
                    className="rounded-lg aspect-[2/1] overflow-hidden object-contain object-center"
                    height="60"
                    src="/squarespace.svg"
                    width="120"
                  />
                </div>
                <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                  <Image
                    alt="Wix"
                    className="rounded-lg aspect-[2/1] overflow-hidden object-contain object-center"
                    height="60"
                    src="/wix.svg"
                    width="120"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section data-aos="fade-up" id="low-code" className="container space-y-6 py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Простой скрипт, легко вставляется в любой сайт
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Наш чат-бот требует минимального количества кода для реализации на вашем сайте.
            Вы можете следовать нашей документации, чтобы узнать, как реализовать наш чат-бот на вашем сайте.
          </p>
          <Image alt="code example" className="mt-6 shadow-xl border rounded-lg" width={550} height={550} src="/code_example.png" />
        </div>
      </section>
      <section data-aos="fade-up" id="pricing" className="container py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Выберите подходящий план для вас</h2>
              <p className="max-w-[800px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Все планы включают в себя все, что необходимо для создания чат-бота.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{freePlan.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">${freePlan.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Идеально для персональных проектов, экспериментов или просто для изучения наших мощных инструментов.
                </p>
                <ul className="space-y-1">
                  <li>✓ {freePlan.maxChatbots} Чат-ботов</li>
                  <li>✓ {freePlan.maxCrawlers} Парсеров</li>
                  <li>✓ {freePlan.maxFiles} Файлов</li>
                  <li>✓ {freePlan.maxMessagesPerMonth} Сообщений в месяц</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="p-6 border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                Популярный
              </Badge>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{basicPlan.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">${basicPlan.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Для организаций, которые требуют сотрудничества и развертывания нескольких чат-ботов.
                </p>
                <ul className="space-y-1">
                  <li>✓ {basicPlan.maxChatbots} Чат-ботов</li>
                  <li>✓ {basicPlan.maxCrawlers} Парсеры</li>
                  <li>✓ {basicPlan.maxFiles} Файлы</li>
                  <li>✓ Настройки</li>
                  <li>✓ Неограниченные сообщения</li>
                  <li>✓ Заявки клиентов / Сбор лидов</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{proPlan.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">${proPlan.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Специализированные решения для крупномасштабных операций и сложных требований.
                </p>
                <ul className="space-y-1">
                  <li>✓ {proPlan.maxChatbots} Чат-ботов</li>
                  <li>✓ {proPlan.maxCrawlers} Парсеры</li>
                  <li>✓ {proPlan.maxFiles} Файлы</li>
                  <li>✓ Настройки</li>
                  <li>✓ Неограниченные сообщения</li>
                  <li>✓ Заявки клиентов / Сбор лидов</li>
                  <li>✓ Удаление лейбла разработано c Onaychat</li>
                  <li>✓ Прикрепление файлов</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">ENTERPRISE</CardTitle>
                <CardDescription className="text-2xl font-bold">$X</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Индивидуальный план для больших предприятий. Свяжитесь с нами для получения дополнительной информации.
                </p>
                <ul className="space-y-1">
                  <li>✓ X Чат-ботов</li>
                  <li>✓ X Парсеров</li>
                  <li>✓ X Файлов</li>
                  <li>✓ Все функции из других планов.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center mt-10 text-center">
            <Link href="/dashboard/billing" className={cn(buttonVariants({ size: "lg" }))}>
              Купить наш платный план прямо сейчас!
            </Link>
          </div>
        </div>
      </section>
      <section data-aos="fade-up" id="faq" className="container space-y-6 py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            FAQ
          </h2>
          <div className="w-full text-left">
            <FAQ />
          </div>
        </div>
      </section>
    </>
  );
}
