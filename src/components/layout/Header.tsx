'use client';

import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/inventory': 'Inventario de Libros',
  '/users': 'Gestión de Usuarios',
  '/loans': 'Préstamos Activos',
  '/new-loan': 'Nueva Operación',
};

export function Header() {
  const pathname = usePathname();
  const title = titles[pathname] ?? 'BiblioGest';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </header>
  );
}
