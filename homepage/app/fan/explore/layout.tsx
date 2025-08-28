import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Creators | Ann Pale',
  description: 'Discover amazing Haitian creators and book personalized video messages',
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}