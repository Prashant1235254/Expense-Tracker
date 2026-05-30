"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  created_at?: string;
};

export default function ViewExpensePage() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("expenseTrackerUser");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/expenses?email=${user.email}`
        );

        const data = await response.json();

        setExpenses(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [router]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/delete-expense/${id}`,
        {
          method: "DELETE",
        }
      );

      setExpenses(
        expenses.filter((expense) => expense.id !== id)
      );
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <Header />

      <div className="p-10 min-h-[80vh]">
        <h1 className="text-5xl font-bold text-center mb-10">
          All Expenses
        </h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-center">No Expenses Found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white shadow-lg rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold mb-3">
                  {expense.title}
                </h2>

                <p className="text-lg mb-2">
                  ₹{Number(expense.amount).toFixed(2)}
                </p>

                <p className="mb-2">
                  Category: {expense.category}
                </p>

                {expense.created_at && (
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(
                      expense.created_at
                    ).toLocaleDateString()}
                  </p>
                )}

                <button
                  onClick={() => handleDelete(expense.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}