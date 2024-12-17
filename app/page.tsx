"use client";
import { useState, useEffect } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({ title: "", author: "", available: true });
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch books
  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  };

  // Add or update book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const res = await fetch("/api/books", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { ...form, id: editId } : form),
    });
    if (res.ok) {
      fetchBooks();
      setForm({ title: "", author: "", available: true });
      setEditId(null);
    }
  };

  // Delete book
  const handleDelete = async (id: number) => {
    const res = await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchBooks();
  };

  // Populate form for editing
  const handleEdit = (book: Book) => {
    setForm({
      title: book.title,
      author: book.author,
      available: book.available,
    });
    setEditId(book.id);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <select
            value={form.available.toString()}
            onChange={(e) =>
              setForm({ ...form, available: e.target.value === "true" })
            }
            className="border p-2 rounded"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          {editId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* Books Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Available</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.available ? "Yes" : "No"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
