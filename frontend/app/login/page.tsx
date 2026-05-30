"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

type User = {
  name: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const storedUsers =
      localStorage.getItem("expenseTrackerUsers");

    if (!storedUsers) {
      alert("No registered users found");
      return;
    }

    const users: User[] =
      JSON.parse(storedUsers);

    const matchedUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!matchedUser) {
      alert("Wrong email or password");
      return;
    }

    localStorage.setItem(
      "expenseTrackerUser",
      JSON.stringify({
        name: matchedUser.name,
        email: matchedUser.email,
      })
    );

    alert("Login Successful");

    router.push("/add-expense");
  };

  return (
    <div>
      <Header />

      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">
            Login
          </h1>

          <div className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <button
              onClick={handleLogin}
              className="bg-black text-white p-3 rounded-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}