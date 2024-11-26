"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signInSchema } from "../definations/type"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "../(pages)/actions/auth.action"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"


export default function SignInForm() {

        // routing
        const router = useRouter();
        // 1. Define your form.
        const form = useForm<z.infer<typeof signInSchema>>({
            resolver: zodResolver(signInSchema),
            defaultValues: {
            username: "",
            password: "",
            },
        })
 
        // 2. Define a submit handler.
        async function onSubmit(values: z.infer<typeof signInSchema>) {
            const res = await signIn(values)

            if(res.error) {
                toast({
                    variant: "destructive",
                    description: res.error
                })
            } else if (res.success) {
                toast({
                    variant: "default",
                    description: "Signed In successfully"
                })

                router.push("/")
            }
        }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="*****" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit">Submit</Button>
                
            </form>
        </Form>
    )
}