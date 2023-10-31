
import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from '@components/NavBar'
import AuthProvider from '@components/AuthProvider/AuthProvider'



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CRUD',
  description: 'CRUD APP',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
          <AuthProvider>
              <NavBar/>
              {children}
        </AuthProvider> 
      </body>
    </html>
  )
}
