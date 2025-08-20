export const metadata = {
  title: 'Ann Pale Backend API',
  description: 'Backend API for Ann Pale platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}