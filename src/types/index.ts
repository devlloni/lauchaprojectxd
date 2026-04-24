export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  location: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  documentId: string; // DNI o Legajo
  email?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface LoanWithDetails extends Loan {
  user: User;
  book: Book;
}
