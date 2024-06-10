import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-8">Welcome to Codemancer</h1>
      <p className="text-lg mb-4">Please sign in to access.</p>
      <a
        href="/api/auth/signin"
        className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition duration-200"
      >
        Sign In
      </a>
    </div>
  );
}
