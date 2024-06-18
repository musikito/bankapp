'use client';
import Link from 'next/link'
import Image from "next/image";
import { useState } from 'react';

const AuthForm = ({ type }: { type: string }) => {
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
        <>
          TODO FORM 
          {/* Form */}
        </>
      )}
    </section>
  );
};

export default AuthForm