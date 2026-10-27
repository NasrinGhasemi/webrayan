import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
  title: "احراز هویت",
};

export default function AuthLayoutRoot({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}
