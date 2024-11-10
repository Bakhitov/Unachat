import Link from "next/link";

import { Metadata } from "next";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import GithubLoginForm from "@/components/github-login-form";
import GoogleLoginForm from "@/components/google-login-form";

export const metadata: Metadata = {
  title: "Войти",
  description: "Войти в ваш аккаунт",
}

export default async function Login() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Назад
        </>
      </Link>
      <div data-aos="fade-up" data-aos-duration="1000" className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.bot className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Войти в Onaychat
          </h1>
          <p className="text-sm text-muted-foreground">
            Используйте ваш Google или Github аккаунт для входа.
          </p>
          <div className="py-4">
            <GoogleLoginForm />
            <br/>
            <GithubLoginForm />
          </div>
          <p className="text-sm text-muted-foreground">
            При подключении вашего аккаунта, вы соглашаетесь с нашими <a href="/docs/legal/terms">Условиями обслуживания</a> и <a href="/docs/legal/privacy">Политикой конфиденциальности</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
