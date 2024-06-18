'use client';
import Link from 'next/link'
import Image from "next/image";
import { useState } from 'react';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';

const AuthForm = ({ type }: { type: string }) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof authFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // UseState to store the user.
  const [user, setUser] = useState(null);
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image src="/icons/logo.svg" width={34} height={34} alt="logo" />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-grey-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-grey-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {/** * Renders either a Plaid Link component or a form, depending on
      whether the user is linked or not. * If the user is linked, the Plaid Link
      component is rendered, allowing the user to link their account. * If the
      user is not linked, a form is rendered, allowing the user to sign in or
      sign up. */}
      {user ? (
        <div className="flex  flex-col gap-4">
          TODO Plaid Link
          {/* Plaid Link */}
        </div>
      ) : (
        /**
         * Renders a form with email and password fields, and a submit button.
         * The form is managed using the `useForm` hook and the `zodResolver` from the `@hookform/resolvers/zod` library.
         * The form values are validated using the `authFormSchema` Zod schema.
         * When the form is submitted, the `onSubmit` function is called with the validated form values.
         */
        <>
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Email field */}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter Your Email"
              />
              {/* Password field */}
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter Your Password"
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </>
      )}
    </section>
  );
};

export default AuthForm