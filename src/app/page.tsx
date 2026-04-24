'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Users, BookMarked, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loanService } from '@/services/loanService';
import { LoanWithDetails } from '@/types';

interface Stats {
  totalBooks: number;
  totalUsers: number;
  activeLoans: number;
  overdueLoans: number;
  totalLoans: number;
  booksInStock: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, totalUsers: 0, activeLoans: 0, overdueLoans: 0, totalLoans: 0, booksInStock: 0 });
  const [recentLoans, setRecentLoans] = useState<LoanWithDetails[]>([]);

  useEffect(() => {
    setStats(loanService.getDashboardStats());
    const active = loanService.getActiveLoans();
    setRecentLoans(active.slice(0, 5));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total de Libros" value={stats.totalBooks} icon={BookOpen} color="blue" />
        <StatsCard title="Usuarios Registrados" value={stats.totalUsers} icon={Users} color="green" />
        <StatsCard title="Préstamos Activos" value={stats.activeLoans} icon={BookMarked} color="blue" />
        <StatsCard title="Préstamos Vencidos" value={stats.overdueLoans} icon={AlertTriangle} color="red" />
        <StatsCard title="Total Préstamos" value={stats.totalLoans} icon={TrendingUp} color="green" />
        <StatsCard title="Ejemplares en Stock" value={stats.booksInStock} icon={Package} color="amber" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-700">Préstamos Activos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLoans.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay préstamos activos</p>
          ) : (
            <div className="space-y-3">
              {recentLoans.map(loan => {
                const overdue = loanService.isOverdue(loan);
                return (
                  <div key={loan.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{loan.book.title}</p>
                      <p className="text-xs text-gray-500">{loan.user.firstName} {loan.user.lastName} · Vence: {new Date(loan.dueDate).toLocaleDateString('es-AR')}</p>
                    </div>
                    <Badge variant={overdue ? 'destructive' : 'secondary'}>
                      {overdue ? 'Vencido' : 'Activo'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
