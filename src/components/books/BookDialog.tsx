'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { bookSchema, BookFormData } from '@/services/bookService';
import { Book } from '@/types';

interface BookDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => void;
  book?: Book | null;
}

export function BookDialog({ open, onClose, onSubmit, book }: BookDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<BookFormData>({ resolver: zodResolver(bookSchema) as any, defaultValues: { title: '', author: '', isbn: '', location: '', stock: 1 } });

  useEffect(() => {
    if (book) {
      form.reset({ title: book.title, author: book.author, isbn: book.isbn, location: book.location, stock: book.stock });
    } else {
      form.reset({ title: '', author: '', isbn: '', location: '', stock: 1 });
    }
  }, [book, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? 'Editar Libro' : 'Nuevo Libro'}</DialogTitle>
        </DialogHeader>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl><Input placeholder="Título del libro" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control as any} name="author" render={({ field }) => (
              <FormItem>
                <FormLabel>Autor</FormLabel>
                <FormControl><Input placeholder="Nombre del autor" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control as any} name="isbn" render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl><Input placeholder="978-..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control as any} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl><Input placeholder="Ej: A-01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control as any} name="stock" render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value as number}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{book ? 'Guardar Cambios' : 'Crear Libro'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
