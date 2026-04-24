'use client';

import { useEffect, useState, useCallback } from 'react';
import { BookMarked, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { loanService } from '@/services/loanService';
import { LoanWithDetails } from '@/types';
import { toast } from 'sonner';

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanWithDetails[]>([]);
  const [returnId, setReturnId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoans(loanService.getActiveLoans());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function handleReturn() {
    if (!returnId) return;
    try {
      loanService.return(returnId);
      toast.success('Devolución registrada. Stock actualizado.');
      setReturnId(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Mostrando {loans.length} préstamo{loans.length !== 1 ? 's' : ''} activo{loans.length !== 1 ? 's' : ''}</p>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400">
            <BookMarked className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">No hay préstamos activos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Libro</th>
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">DNI/Legajo</th>
                <th className="px-4 py-3 text-left">Préstamo</th>
                <th className="px-4 py-3 text-left">Vencimiento</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map(loan => {
                const overdue = loanService.isOverdue(loan);
                return (
                  <tr key={loan.id} className={`hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{loan.book.title}</td>
                    <td className="px-4 py-3 text-gray-700">{loan.user.firstName} {loan.user.lastName}</td>
                    <td className="px-4 py-3 font-mono text-gray-500 text-xs">{loan.user.documentId}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(loan.loanDate).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {overdue && <Clock className="h-3.5 w-3.5 text-red-500" />}
                        <span className={`text-xs ${overdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                          {new Date(loan.dueDate).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={overdue ? 'destructive' : 'secondary'}>
                        {overdue ? 'Vencido' : 'Activo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="outline" onClick={() => setReturnId(loan.id)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Devolver
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!returnId} onOpenChange={open => !open && setReturnId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registrar Devolución</AlertDialogTitle>
            <AlertDialogDescription>
              Se registrará la devolución y el stock del libro será actualizado automáticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturn}>Confirmar Devolución</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
