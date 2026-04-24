'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loanService, loanSchema, LoanFormData } from '@/services/loanService';
import { bookService } from '@/services/bookService';
import { userService } from '@/services/userService';
import { Book, User } from '@/types';
import { toast } from 'sonner';

const LOAN_DAYS = 14;

export default function NewLoanPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [userActiveLoans, setUserActiveLoans] = useState(0);
  const [success, setSuccess] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<LoanFormData>({ resolver: zodResolver(loanSchema) as any, defaultValues: { userId: '', bookId: '' } });

  useEffect(() => {
    setBooks(bookService.getAll());
    setUsers(userService.getAll());
  }, []);

  function onUserChange(userId: string) {
    const user = users.find(u => u.id === userId) ?? null;
    setSelectedUser(user);
    if (user) setUserActiveLoans(loanService.getUserActiveCount(userId));
    else setUserActiveLoans(0);
  }

  function onBookChange(bookId: string) {
    setSelectedBook(books.find(b => b.id === bookId) ?? null);
  }

  function onSubmit(data: LoanFormData) {
    try {
      loanService.create(data);
      toast.success('Préstamo registrado exitosamente');
      setSuccess(true);
      form.reset();
      setSelectedUser(null);
      setSelectedBook(null);
      setUserActiveLoans(0);
      setBooks(bookService.getAll());
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">Préstamo registrado exitosamente.</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registrar Nuevo Préstamo</CardTitle>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control as any} name="userId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={(val: string | null) => {
                      const id = val ?? '';
                      field.onChange(id);
                      if (id) onUserChange(id);
                      else { setSelectedUser(null); setUserActiveLoans(0); }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar usuario..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} — {u.documentId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {selectedUser && (
                <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${userActiveLoans >= 3 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                  {userActiveLoans >= 3
                    ? <><AlertCircle className="h-4 w-4" /> Este usuario ya tiene 3 préstamos activos (límite máximo)</>
                    : <><CheckCircle2 className="h-4 w-4" /> Préstamos activos: {userActiveLoans} / 3</>
                  }
                </div>
              )}

              <FormField control={form.control as any} name="bookId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Libro</FormLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={(val: string | null) => {
                      const id = val ?? '';
                      field.onChange(id);
                      if (id) onBookChange(id);
                      else setSelectedBook(null);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar libro..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {books.map(b => (
                        <SelectItem key={b.id} value={b.id} disabled={b.stock === 0}>
                          {b.title} — {b.author} {b.stock === 0 ? '(Sin stock)' : `(${b.stock} disponibles)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {selectedBook && selectedBook.stock === 0 && (
                <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-red-50 text-red-700">
                  <AlertCircle className="h-4 w-4" /> Este libro no tiene stock disponible
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Fecha de préstamo:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Fecha de vencimiento:</span>
                  <span className="font-medium text-blue-600">{dueDate.toLocaleDateString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Duración:</span>
                  <span className="font-medium">{LOAN_DAYS} días</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={userActiveLoans >= 3}>
                Registrar Préstamo
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
