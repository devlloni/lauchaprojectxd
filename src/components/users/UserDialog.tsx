'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userSchema, UserFormData } from '@/services/userService';
import { User } from '@/types';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
}

export function UserDialog({ open, onClose, onSubmit, user }: UserDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<UserFormData>({ resolver: zodResolver(userSchema) as any, defaultValues: { firstName: '', lastName: '', documentId: '', email: '' } });

  useEffect(() => {
    if (user) {
      form.reset({ firstName: user.firstName, lastName: user.lastName, documentId: user.documentId, email: user.email ?? '' });
    } else {
      form.reset({ firstName: '', lastName: '', documentId: '', email: '' });
    }
  }, [user, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        </DialogHeader>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control as any} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input placeholder="Nombre" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control as any} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl><Input placeholder="Apellido" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control as any} name="documentId" render={({ field }) => (
              <FormItem>
                <FormLabel>DNI / Legajo</FormLabel>
                <FormControl><Input placeholder="Número de documento o legajo" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control as any} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email (opcional)</FormLabel>
                <FormControl><Input type="email" placeholder="email@ejemplo.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{user ? 'Guardar Cambios' : 'Registrar Usuario'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
