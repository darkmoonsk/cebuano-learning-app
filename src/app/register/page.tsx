import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/presentation/components/forms/register-form";
import { auth } from "@/auth";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md flex flex-col justify-center px-4 py-12">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-[#03045e]">
            Create your account
          </h1>
          <p className="text-gray-600">
            Track your Cebuano learning journey with personalized reviews.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already a member?{" "}
          <Link
            className="text-[#0077b6] hover:text-[#005a8b] transition-colors"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
