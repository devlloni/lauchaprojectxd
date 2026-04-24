import { loanRepo } from '@/repositories/storage';
import { bookService } from './bookService';
import { userService } from './userService';
import { Loan, LoanWithDetails } from '@/types';
import { z } from 'zod';

const MAX_LOANS_PER_USER = 3;
const LOAN_DAYS = 14;

export const loanSchema = z.object({
  userId: z.string().min(1, 'Selecciona un usuario'),
  bookId: z.string().min(1, 'Selecciona un libro'),
});

export type LoanFormData = z.infer<typeof loanSchema>;

export const loanService = {
  getActiveLoans(): LoanWithDetails[] {
    return loanRepo.findActive().map(loan => this.enrich(loan)).filter(Boolean) as LoanWithDetails[];
  },

  getAllLoans(): LoanWithDetails[] {
    return loanRepo.findAll().map(loan => this.enrich(loan)).filter(Boolean) as LoanWithDetails[];
  },

  enrich(loan: Loan): LoanWithDetails | null {
    const user = userService.getById(loan.userId);
    const book = bookService.getById(loan.bookId);
    if (!user || !book) return null;
    return { ...loan, user, book };
  },

  create(data: LoanFormData): Loan {
    const user = userService.getById(data.userId);
    if (!user) throw new Error('Usuario no encontrado');

    const book = bookService.getById(data.bookId);
    if (!book) throw new Error('Libro no encontrado');

    if (book.stock <= 0) throw new Error('No hay stock disponible para este libro');

    const activeLoans = loanRepo.findActiveByUser(data.userId);
    if (activeLoans.length >= MAX_LOANS_PER_USER) {
      throw new Error(`El usuario ya tiene ${MAX_LOANS_PER_USER} préstamos activos (máximo permitido)`);
    }

    const alreadyHasBook = activeLoans.some(l => l.bookId === data.bookId);
    if (alreadyHasBook) throw new Error('El usuario ya tiene prestado este libro');

    const loanDate = new Date();
    const dueDate = new Date(loanDate);
    dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

    const loan = loanRepo.create({
      userId: data.userId,
      bookId: data.bookId,
      loanDate: loanDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'active',
    });

    bookService.decrementStock(data.bookId);

    return loan;
  },

  return(loanId: string): Loan {
    const loan = loanRepo.findById(loanId);
    if (!loan) throw new Error('Préstamo no encontrado');
    if (loan.status === 'returned') throw new Error('Este préstamo ya fue devuelto');

    const updated = loanRepo.update(loanId, {
      status: 'returned',
      returnDate: new Date().toISOString(),
    });

    bookService.incrementStock(loan.bookId);

    return updated!;
  },

  getUserActiveCount(userId: string): number {
    return loanRepo.findActiveByUser(userId).length;
  },

  isOverdue(loan: Loan): boolean {
    return loan.status === 'active' && new Date() > new Date(loan.dueDate);
  },

  getDashboardStats() {
    const allBooks = bookService.getAll();
    const allUsers = userService.getAll();
    const activeLoans = loanRepo.findActive();
    const allLoans = loanRepo.findAll();
    const overdueLoans = activeLoans.filter(l => this.isOverdue(l));

    return {
      totalBooks: allBooks.length,
      totalUsers: allUsers.length,
      activeLoans: activeLoans.length,
      overdueLoans: overdueLoans.length,
      totalLoans: allLoans.length,
      booksInStock: allBooks.reduce((sum, b) => sum + b.stock, 0),
    };
  },
};
