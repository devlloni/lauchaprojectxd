'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, BookMarked, PlusCircle, LayoutDashboard, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventario', icon: BookOpen },
  { href: '/users', label: 'Usuarios', icon: Users },
  { href: '/loans', label: 'Préstamos Activos', icon: BookMarked },
  { href: '/new-loan', label: 'Nueva Operación', icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Library className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-lg font-bold text-white">BiblioGest</h1>
            <p className="text-xs text-slate-400">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">BiblioGest MVP v1.0</p>
      </div>
    </aside>
  );
}
