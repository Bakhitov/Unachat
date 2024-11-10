import * as React from "react"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  simpleFooter?: boolean
}

export function SiteFooter({ simpleFooter, className }: SiteFooterProps) {
  return (
    <footer className="p-2 m-5 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {!simpleFooter &&
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">О приложении</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-base text-gray-500 hover:text-blue-500" href="/login">
                    App
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Соц.сети</h3>
              <ul className="space-y-2">
                <li>
                  <Link target="_blank" className="text-base text-gray-500 hover:text-blue-500" href={siteConfig.links.twitter}>
                    Twitter
                  </Link>
                </li>
                <li>  
                  <Link target="_blank" className="text-base text-gray-500 hover:text-blue-500" href={siteConfig.links.instagram}>
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        }
        <div className="flex justify-between items-center border-t border-gray-200 mt-8 pt-4">
          <div className="text-sm text-gray-500 flex flex-row"> <Icons.bot className="mr-2" /> © 2024 Onaychat. All rights reserved.</div>
          <div className="flex items-center space-x-4">
            <Link className="text-sm text-gray-500 hover:text-blue-500" href="#">
            </Link>
            <Link className="text-sm text-gray-500 hover:text-blue-500" href="#">
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}