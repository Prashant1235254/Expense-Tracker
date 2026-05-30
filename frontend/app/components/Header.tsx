"use client";

import Link from "next/link";

export default function Header() {
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("expenseTrackerUser");

  const handleLogout = () => {
    localStorage.removeItem("expenseTrackerUser");

    alert("Logout Successful");

    window.location.href = "/login";
  };

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        Expense Tracker
      </h1>

      <nav className="flex gap-6 items-center">
        <Link href="/">Home</Link>

        {isLoggedIn ? (
          <>
            <Link href="/add-expense">
              Add Expense
            </Link>

            <Link href="/view-expense">
              View Expense
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              Login
            </Link>

            <Link href="/register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}