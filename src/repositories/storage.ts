import { Book, User, Loan } from '@/types';

const KEYS = {
  BOOKS: 'bibliogest_books',
  USERS: 'bibliogest_users',
  LOANS: 'bibliogest_loans',
};

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// In-memory cache
let books: Book[] = [];
let users: User[] = [];
let loans: Loan[] = [];
let initialized = false;

function init() {
  if (initialized) return;
  books = load<Book>(KEYS.BOOKS);
  users = load<User>(KEYS.USERS);
  loans = load<Loan>(KEYS.LOANS);

  if (books.length === 0) seedBooks();
  if (users.length === 0) seedUsers();

  initialized = true;
}

function seedBooks() {
  const seed: Book[] = [
    { id: '1', title: 'El Aleph', author: 'Jorge Luis Borges', isbn: '978-84-206-3795-5', location: 'A-01', stock: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', isbn: '978-84-397-0418-9', location: 'A-02', stock: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '978-84-670-5033-5', location: 'B-01', stock: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', title: 'Ficciones', author: 'Jorge Luis Borges', isbn: '978-84-206-3796-2', location: 'A-01', stock: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', title: 'La Metamorfosis', author: 'Franz Kafka', isbn: '978-84-206-8068-5', location: 'B-02', stock: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  books = seed;
  save(KEYS.BOOKS, books);
}

function seedUsers() {
  const seed: User[] = [
    { id: '1', firstName: 'Ana', lastName: 'García', documentId: '12345678', email: 'ana@mail.com', createdAt: new Date().toISOString() },
    { id: '2', firstName: 'Luis', lastName: 'Martínez', documentId: '87654321', email: 'luis@mail.com', createdAt: new Date().toISOString() },
  ];
  users = seed;
  save(KEYS.USERS, users);
}

// ── Books ──────────────────────────────────────────────────────────────
export const bookRepo = {
  findAll(): Book[] { init(); return [...books]; },
  findById(id: string): Book | undefined { init(); return books.find(b => b.id === id); },
  create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
    init();
    const book: Book = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    books.push(book);
    save(KEYS.BOOKS, books);
    return book;
  },
  update(id: string, data: Partial<Omit<Book, 'id' | 'createdAt'>>): Book | null {
    init();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return null;
    books[idx] = { ...books[idx], ...data, updatedAt: new Date().toISOString() };
    save(KEYS.BOOKS, books);
    return books[idx];
  },
  delete(id: string): boolean {
    init();
    const len = books.length;
    books = books.filter(b => b.id !== id);
    save(KEYS.BOOKS, books);
    return books.length < len;
  },
  search(query: string): Book[] {
    init();
    const q = query.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  },
};

// ── Users ──────────────────────────────────────────────────────────────
export const userRepo = {
  findAll(): User[] { init(); return [...users]; },
  findById(id: string): User | undefined { init(); return users.find(u => u.id === id); },
  findByDocumentId(docId: string): User | undefined { init(); return users.find(u => u.documentId === docId); },
  create(data: Omit<User, 'id' | 'createdAt'>): User {
    init();
    const user: User = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    users.push(user);
    save(KEYS.USERS, users);
    return user;
  },
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    init();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    save(KEYS.USERS, users);
    return users[idx];
  },
  delete(id: string): boolean {
    init();
    const len = users.length;
    users = users.filter(u => u.id !== id);
    save(KEYS.USERS, users);
    return users.length < len;
  },
};

// ── Loans ──────────────────────────────────────────────────────────────
export const loanRepo = {
  findAll(): Loan[] { init(); return [...loans]; },
  findById(id: string): Loan | undefined { init(); return loans.find(l => l.id === id); },
  findByUser(userId: string): Loan[] { init(); return loans.filter(l => l.userId === userId); },
  findActive(): Loan[] { init(); return loans.filter(l => l.status !== 'returned'); },
  findActiveByUser(userId: string): Loan[] { init(); return loans.filter(l => l.userId === userId && l.status !== 'returned'); },
  create(data: Omit<Loan, 'id'>): Loan {
    init();
    const loan: Loan = { ...data, id: crypto.randomUUID() };
    loans.push(loan);
    save(KEYS.LOANS, loans);
    return loan;
  },
  update(id: string, data: Partial<Omit<Loan, 'id'>>): Loan | null {
    init();
    const idx = loans.findIndex(l => l.id === id);
    if (idx === -1) return null;
    loans[idx] = { ...loans[idx], ...data };
    save(KEYS.LOANS, loans);
    return loans[idx];
  },
};
