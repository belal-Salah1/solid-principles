export interface Book {
  id: number;
  title: string;
  isAvailable: boolean;
}

export interface Notifier {
  notify(message: string): void;
}


export interface ReadableLibrary {
  getBook(_bookId: number): Book | undefined;
}

export interface BorrowableLibrary {
  borrowBook(_bookId: number): boolean;
  returnBook(_bookId: number): boolean;
}

export interface Library extends ReadableLibrary, BorrowableLibrary {
  books: Book[];
  addBook(_book: Book): number;
}


export class LibraryImpl implements Library {
  constructor(private _notifier: Notifier) {}

  books: Book[] = [
    { id: 1, title: 'Book One', isAvailable: true },
    { id: 2, title: 'Book Two', isAvailable: true },
    { id: 3, title: 'Book Three', isAvailable: true },
  ];

  addBook(_book: Book): number {
    this.books.push(_book);
    this._notifier.notify(`Book "${_book.title}" has been added.`);
    return _book.id;
  }

  borrowBook(_bookId: number): boolean {
    const book = this.books.find((book) => book.id === _bookId);
    if (book && book.isAvailable) {
      book.isAvailable = false;
      this._notifier.notify(`Book "${book.title}" has been borrowed.`);
      return true;
    }
    return false;
  }

  returnBook(_bookId: number): boolean {
    const book = this.books.find((book) => book.id === _bookId);
    if (book && !book.isAvailable) {
      book.isAvailable = true;
      this._notifier.notify(`Book "${book.title}" has been returned.`);
      return true;
    }
    return false;
  }

  getBook(_bookId: number): Book | undefined {
    const book = this.books.find((book) => book.id === _bookId);
    if (book) {
      this._notifier.notify(`Book "${book.title}" has been retrieved.`);
    }
    return book;
  }
}

export class ConsoleNotifier implements Notifier {
  notify(message: string): void {
    console.log(message);
  }
}

export class EmailNotifier implements Notifier {
  emails: string[] = [];
  notify(message: string): void {
    this.emails.push(message);
  }
}

const myLibrary = new LibraryImpl(new ConsoleNotifier());

myLibrary.addBook({ id: 4, title: 'Book Four', isAvailable: true });
console.log(myLibrary.borrowBook(1)); 
console.log(myLibrary.getBook(2)); 
console.log(myLibrary.returnBook(3));
