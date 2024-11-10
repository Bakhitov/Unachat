
import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import { siteConfig } from '@/config/site'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn(
                'px-2 text-center text-xs leading-normal text-muted-foreground',
                className
            )}
            {...props}
        >
            Разработано на{' '}
            <ExternalLink href={siteConfig.url}>Onaychat</ExternalLink>
        </p>
    )
}