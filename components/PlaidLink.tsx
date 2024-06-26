import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Plaid, PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { create } from 'domain';
import { set } from 'zod';
import { StyledString } from 'next/dist/build/swc';
import { useRouter } from 'next/navigation';
import { createLinkToken } from '@/lib/actions/user.actions';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {

    const router = useRouter();


    const [token, setToken] = useState("");

   
  /**
   * Fetches a Plaid Link token from the server and sets it in the component state.
   *
   * This effect is triggered whenever the `user` prop changes. It calls the `createLinkToken` function
   * from the `@/lib/actions/user.actions` module to fetch a new Plaid Link token for the current user.
   * The fetched token is then stored in the component's state using the `setToken` function.
   *
   * This token is later used to configure the Plaid Link component, which allows the user to connect their
   * bank account to the application.
   */
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);


  
    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string) => {
            // await exchangePublicToken({
            //     public_token,
            //     user,
            // });

            router.push("/");


        },
        [user]
    );

    // Configuration for the Plaid Link component.
    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);


    return (
        <>
            {variant === "primary" ? (
                <Button
                    onClick={() => open()}
                    disabled={!ready}
                    className="plaidlink-primary"
                >Connect Bank</Button>
            ) : variant === "ghost" ? (
                <Button>Connect Bank</Button>
            ) : (
                <Button>Connect Bank</Button>
            )}
        </>
    );
};

export default PlaidLink