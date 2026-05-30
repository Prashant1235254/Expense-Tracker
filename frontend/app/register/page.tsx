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

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const storedUsers =
      localStorage.getItem("expenseTrackerUsers");

    const users: User[] = storedUsers
      ? JSON.parse(storedUsers)
      : [];

    const userExists = users.find(
      (user) => user.email === email
    );

    if (userExists) {
      alert("User already exists");
      return;
    }

    const newUser: User = {
      name,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem(
      "expenseTrackerUsers",
      JSON.stringify(users)
    );

    alert("Registration Successful");

    router.push("/login");
  };

  return (
    <div>
      <Header />

      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">
            Register
          </h1>

          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <button
              onClick={handleRegister}
              className="bg-black text-white p-3 rounded-lg"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}