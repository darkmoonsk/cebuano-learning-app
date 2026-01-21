import { ForgotPasswordForm } from "@/presentation/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md flex flex-col justify-center px-4 py-12">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-[#03045e]">
            Forgot your password?
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a reset link.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
