import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/app-sidebar";

export default async function Home() {

  const { user } = await validateRequest()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <AdminDashboard />
    </div>
  );
}
