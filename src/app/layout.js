import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gibson School Systems – Making Young People Strong People',
  description: 'Gibson School Systems - Making Young People Strong People, Making Strong People Stronger.',
  icons: {
    icon: 'https://gyaschool.com/wp-content/uploads/2023/09/cropped-GSS-Logo-1-32x32.png',
    apple: 'https://gyaschool.com/wp-content/uploads/2023/09/cropped-GSS-Logo-1-180x180.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
