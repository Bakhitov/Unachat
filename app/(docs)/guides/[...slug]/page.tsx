import Link from "next/link"
import { Icons } from "@/components/icons"
import { DocsPageHeader } from "@/components/page-header"
import { DashboardTableOfContents } from "@/components/toc"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

interface GuidePageProps {
    params: {
        slug: string[]
    }
}

export async function generateMetadata({
    params,
}: GuidePageProps): Promise<Metadata> {
    return {
        title: 'Guide',
        description: 'Guide description',
    }
}

export default async function GuidePage({ params }: GuidePageProps) {
    const tocItems = {
        items: []
    }

    return (
        <main className="relative py-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:py-10 xl:gap-20">
            <div>
                <DocsPageHeader heading="Guide" text="Guide description" />
                <div className="prose max-w-none dark:prose-invert">
                    <p>Guide content will be added here.</p>
                </div>
                <hr className="my-4" />
                <div className="flex justify-center py-6 lg:py-10">
                    <Link
                        href="/guides"
                        className={cn(buttonVariants({ variant: "ghost" }))}
                    >
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        See all guides
                    </Link>
                </div>
            </div>
            <div className="hidden text-sm lg:block">
                <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
                    <DashboardTableOfContents toc={tocItems} />
                </div>
            </div>
        </main>
    )
}
