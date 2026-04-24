import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BiblioGest - Sistema de Gestión Bibliotecaria',
  description: 'Sistema de gestión de biblioteca: libros, usuarios y préstamos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
