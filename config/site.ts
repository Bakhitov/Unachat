import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Onaychat",
  description:
    "Onaychat - An SaaS Platform for Crafting Chatbots with OpenAI's Assistant.",
  url: process.env.NEXTAUTH_URL || "https://onaychat.vercel.app",
  ogImage: "https://www.openassistantgpt.io/dashboard.png",
  links: {
    twitter: "https://twitter.com/onaychat",
    instagram: "https://www.instagram.com/onaychat",
  },
}