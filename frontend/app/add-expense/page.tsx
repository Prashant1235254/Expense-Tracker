"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AddExpensePage() {
  const router = useRouter();

  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("expenseTrackerUser");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleAddExpense = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("expenseTrackerUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!title || !amount || !category) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/add-expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            amount: Number(amount),
            category,
            email: user.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed");
      }

      alert("Expense Added Successfully");

      setTitle("");
      setAmount("");
      setCategory("");

      window.location.href = "/view-expense";
    } catch {
      setError("Unable to add expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <Header />

      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl">
          <h1 className="text-4xl font-bold text-center mb-8">
            Add Expense
          </h1>

          {error && (
            <p className="text-red-500 text-center mb-5">
              {error}
            </p>
          )}

          <form
            onSubmit={handleAddExpense}
            className="flex flex-col gap-5"
          >
            <input
              type="text"
              placeholder="Expense Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white p-3 rounded-lg disabled:bg-gray-500"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}