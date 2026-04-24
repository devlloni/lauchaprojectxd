'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { BookDialog } from '@/components/books/BookDialog';
import { bookService, BookFormData } from '@/services/bookService';
import { Book } from '@/types';
import { toast } from 'sonner';

export default function InventoryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setBooks(bookService.search(query));
  }, [query]);

  useEffect(() => { refresh(); }, [refresh]);

  function handleSubmit(data: BookFormData) {
    try {
      if (editBook) {
        bookService.update(editBook.id, data);
        toast.success('Libro actualizado correctamente');
      } else {
        bookService.create(data);
        toast.success('Libro creado correctamente');
      }
      setDialogOpen(false);
      setEditBook(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    try {
      bookService.delete(deleteId);
      toast.success('Libro eliminado');
      setDeleteId(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const stockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Sin stock</Badge>;
    if (stock <= 2) return <Badge variant="outline" className="text-amber-600 border-amber-300">{stock} disponibles</Badge>;
    return <Badge variant="secondary" className="text-green-700">{stock} disponibles</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título, autor o ISBN..."
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => { setEditBook(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Libro
        </Button>
      </div>

      {books.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">No se encontraron libros</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Autor</th>
                <th className="px-4 py-3 text-left">ISBN</th>
                <th className="px-4 py-3 text-left">Ubicación</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map(book => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{book.title}</td>
                  <td className="px-4 py-3 text-gray-600">{book.author}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{book.isbn}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{book.location}</span>
                  </td>
                  <td className="px-4 py-3">{stockBadge(book.stock)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditBook(book); setDialogOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(book.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BookDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditBook(null); }}
        onSubmit={handleSubmit}
        book={editBook}
      />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este libro?</AlertDialogTitle>
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
