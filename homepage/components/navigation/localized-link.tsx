"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { ComponentProps } from "react"

interface LocalizedLinkProps extends ComponentProps<typeof Link> {
  href: string
  children: React.ReactNode
}

/**
 * A wrapper around Next.js Link that automatically includes the current locale
 * in the href to ensure navigation maintains the user's language preference.
 */
export function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const locale = useLocale()

  // If href already includes a locale, don't add another one
  const hasLocale = href.startsWith('/en/') || href.startsWith('/fr/') || href.startsWith('/ht/')

  // If it's an external link or already has locale, use as-is
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || hasLocale) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  // Add current locale to the href
  const localizedHref = `/${locale}${href === '/' ? '' : href}`

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  )
}