import { userRepo } from '@/repositories/storage';
import { User } from '@/types';
import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  documentId: z.string().min(1, 'El DNI/Legajo es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

export type UserFormData = z.infer<typeof userSchema>;

export const userService = {
  getAll(): User[] {
    return userRepo.findAll();
  },

  getById(id: string): User | undefined {
    return userRepo.findById(id);
  },

  create(data: UserFormData): User {
    const existing = userRepo.findByDocumentId(data.documentId);
    if (existing) throw new Error('Ya existe un usuario con ese DNI/Legajo');
    return userRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      documentId: data.documentId,
      email: data.email || undefined,
    });
  },

  update(id: string, data: UserFormData): User {
    const existing = userRepo.findByDocumentId(data.documentId);
    if (existing && existing.id !== id) throw new Error('Ya existe un usuario con ese DNI/Legajo');
    const updated = userRepo.update(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      documentId: data.documentId,
      email: data.email || undefined,
    });
    if (!updated) throw new Error('Usuario no encontrado');
    return updated;
  },

  delete(id: string): void {
    const deleted = userRepo.delete(id);
    if (!deleted) throw new Error('Usuario no encontrado');
  },

  fullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  },
};
