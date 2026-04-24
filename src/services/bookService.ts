import { bookRepo } from '@/repositories/storage';
import { Book } from '@/types';
import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  author: z.string().min(1, 'El autor es obligatorio'),
  isbn: z.string().min(1, 'El ISBN es obligatorio'),
  location: z.string().min(1, 'La ubicación es obligatoria'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
});

export type BookFormData = z.infer<typeof bookSchema>;

export const bookService = {
  getAll(): Book[] {
    return bookRepo.findAll();
  },

  search(query: string): Book[] {
    if (!query.trim()) return bookRepo.findAll();
    return bookRepo.search(query);
  },

  getById(id: string): Book | undefined {
    return bookRepo.findById(id);
  },

  create(data: BookFormData): Book {
    return bookRepo.create(data);
  },

  update(id: string, data: BookFormData): Book {
    const updated = bookRepo.update(id, data);
    if (!updated) throw new Error('Libro no encontrado');
    return updated;
  },

  delete(id: string): void {
    const deleted = bookRepo.delete(id);
    if (!deleted) throw new Error('Libro no encontrado');
  },

  decrementStock(id: string): void {
    const book = bookRepo.findById(id);
    if (!book) throw new Error('Libro no encontrado');
    if (book.stock <= 0) throw new Error('Sin stock disponible');
    bookRepo.update(id, { stock: book.stock - 1 });
  },

  incrementStock(id: string): void {
    const book = bookRepo.findById(id);
    if (!book) throw new Error('Libro no encontrado');
    bookRepo.update(id, { stock: book.stock + 1 });
  },
};
