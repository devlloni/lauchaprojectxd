'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserDialog } from '@/components/users/UserDialog';
import { userService, UserFormData } from '@/services/userService';
import { loanService } from '@/services/loanService';
import { User } from '@/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeLoansMap, setActiveLoansMap] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const all = userService.getAll();
    setUsers(all);
    const map: Record<string, number> = {};
    all.forEach(u => { map[u.id] = loanService.getUserActiveCount(u.id); });
    setActiveLoansMap(map);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function handleSubmit(data: UserFormData) {
    try {
      if (editUser) {
        userService.update(editUser.id, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        userService.create(data);
        toast.success('Usuario registrado correctamente');
      }
      setDialogOpen(false);
      setEditUser(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    try {
      userService.delete(deleteId);
      toast.success('Usuario eliminado');
      setDeleteId(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditUser(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400">
            <UsersIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">No hay usuarios registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Nombre Completo</th>
                <th className="px-4 py-3 text-left">DNI / Legajo</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Préstamos Activos</th>
                <th className="px-4 py-3 text-left">Registrado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => {
                const count = activeLoansMap[user.id] ?? 0;
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{user.documentId}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${count >= 3 ? 'bg-red-100 text-red-700' : count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {count} / 3
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setEditUser(user); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <UserDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditUser(null); }}
        onSubmit={handleSubmit}
        user={editUser}
      />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
