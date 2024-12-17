import { NextResponse } from "next/server";

// Simulated database
let books: { id: number; title: string; author: string; available: boolean }[] =
  [{ id: 1, title: "Harry Potter", author: "J.K. Rowling", available: true }];

// GET: Fetch all books
export async function GET() {
  try {
    return NextResponse.json(books, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Error fetching books" },
      { status: 500 }
    );
  }
}

// POST: Add a new book
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newBook = { id: Date.now(), ...body };
    books.push(newBook);
    return NextResponse.json(
      { message: "Book added", book: newBook },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Error adding book" }, { status: 500 });
  }
}

// PUT: Update an existing book
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const index = books.findIndex((b) => b.id === body.id);
    if (index === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    books[index] = { ...books[index], ...body };
    return NextResponse.json(
      { message: "Book updated", book: books[index] },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Error updating book" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a book
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    books = books.filter((b) => b.id !== id);
    return NextResponse.json({ message: "Book deleted" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Error deleting book" },
      { status: 500 }
    );
  }
}
