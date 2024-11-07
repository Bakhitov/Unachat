import { Metadata } from "next"

interface DocPageProps {
    params: {
        slug: string[]
    }
}

export async function generateMetadata({
    params,
}: DocPageProps): Promise<Metadata> {
    return {
        title: 'Documentation',
        description: 'Documentation for the project',
    }
}

export default async function DocPage({ params }: DocPageProps) {
    return (
        <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">
                <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="flex-1 space-y-4">
                        <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                            Documentation
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Welcome to the documentation.
                        </p>
                    </div>
                </div>
                <div className="prose max-w-none dark:prose-invert">
                    <p>Documentation content will be added here.</p>
                </div>
            </div>
            <div className="hidden text-sm xl:block">
                <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
                    {/* Table of contents placeholder */}
                </div>
            </div>
        </main>
    )
}
