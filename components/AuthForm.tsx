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
import { Loader2 } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import { Console, log } from 'console';

const AuthForm = ({ type }: { type: string }) => {
    // UseRouter to redirect to the home page.
    const router = useRouter();
    // UseState to store the user.
    const [user, setUser] = useState(null);
    // UseState to store the isLoading.
    const [isLoading, setIsLoading] = useState(false);
    // Function to handle the schema
    const formSchema = authFormSchema(type);


    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
   

    try {
      // Sign Up with Appwrite & create plaid token
      if (type === "sign-up") {
        // Get user info from data
        const newUser = await signUp(data);

        // Set the user.
        setUser(newUser);
      }

      if (type === "sign-in") {
        // console.log("data", data);
    
        const response = await signIn ({
          email: data.email,
          password: data.password,
        });
     
        // console.log('response',response);
      

        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }; // End of onSubmit


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
                            {/** Sign Up fields partial component*/}
                            {type === 'sign-up' && (
                                <>
                                    <div className='flex gap-4'>

                                        {/* First Name field */}
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label="First Name"
                                            placeholder="Enter Your First name"
                                        />
                                        {/* Last Name field */}
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Enter Your Last Name"
                                        />
                                    </div>

                                    {/* Address field */}
                                    <CustomInput
                                        control={form.control}
                                        name="address1"
                                        label="Address"
                                        placeholder="Enter Your Address"
                                    />
                                    {/* City field */}
                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        label="City"
                                        placeholder="Enter Your City"
                                    />
                                    <div className='flex gap-4'>
                                        {/* State field */}
                                        <CustomInput
                                            control={form.control}
                                            name="state"
                                            label="State"
                                            placeholder="ex: NY"
                                        />
                                        {/* Postal code field */}
                                        <CustomInput
                                            control={form.control}
                                            name="postalCode"
                                            label="Postal Code"
                                            placeholder="ex: 12345"
                                        />
                                    </div>
                                    <div className='flex gap-4'>
                                        {/* DOB field */}
                                        <CustomInput
                                            control={form.control}
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            placeholder="YYYY-MM-DD"
                                        />
                                        {/* SSN field */}
                                        <CustomInput
                                            control={form.control}
                                            name="ssn"
                                            label="SSN"
                                            placeholder="123"
                                        />
                                    </div>


                                </>
                            )}




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
                            <div className='flex flex-col gap-4'>
                                {/** Submit button */}
                                <Button type="submit" disabled={isLoading} className='form-btn'>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> &nbsp;
                                            Loading...
                                        </>
                                    ) : type === "sign-in" ? "Sign In" : "Sign Up"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === "sign-in"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                            {type === "sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </footer>

                </>
            )}
        </section>
    );
};

export default AuthForm