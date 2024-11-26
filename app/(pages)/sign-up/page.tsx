import SignUpForm from "@/app/components/SignUpForm"
import { validateRequest } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function SignUpPage() {

    const user = await validateRequest();
    
    if (user) {
        return redirect("/")
    }
    return (
        <div className=" flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <h1 className=" font-bold text-2xl">Sign Up to continue</h1>
                <SignUpForm />
            </div>
        </div>
    )
}