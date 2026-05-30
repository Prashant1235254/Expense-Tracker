import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Header />

      <section className="flex flex-col justify-center items-center h-[80vh] text-center px-5">
        <h1 className="text-6xl font-bold mb-6 text-black">
          Manage Your Daily Expenses Easily
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mb-8">
          Track your income and expenses with a modern,
          secure and simple personal finance management system.
        </p>

        <div className="flex gap-5">
          <Link
            href="/register"
            className="bg-black text-white px-8 py-4 rounded-xl text-xl"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="border-2 border-black px-8 py-4 rounded-xl text-xl"
          >
            Login
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}