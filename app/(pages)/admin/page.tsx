import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {

    const { user } = await validateRequest()

    if (!user) {
        return redirect("/sign-in")
    }

    if (user.role !== "admin") {
        return redirect("/")
    }

    return (
        <p>You should not see it unless you are a Admin</p>
    )
}