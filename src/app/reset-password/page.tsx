import { ResetPasswordForm } from "@/presentation/components/forms/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md flex flex-col justify-center px-4 py-12">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-[#03045e]">
            Reset your password
          </h1>
          <p className="text-gray-600">
            Choose a new password for your account.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
