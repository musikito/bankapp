'use server';

import { revalidatePath } from "next/cache";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from "@/lib/plaid";
import { parse } from "path";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";


/**
 * Environment variables that store the IDs for the Appwrite database, user collection, and bank collection.
 */
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;


/**
 * Authenticates a user by creating an email/password session.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A stringified JSON object representing the newly created session, or null if an error occurred.
 */
export const signIn = async ({ email, password }: signInProps) => {

  try {
    // Create an account client
    const { account } = await createAdminClient();
    // Create a session for the user
    const response = await account.createEmailPasswordSession(email, password);

    // Return the response as a stringified JSON object
    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
  }
};



/**
 * Creates a new user account, including a Dwolla customer account, and stores the user's information in the database.
 *
 * @param userData - An object containing the user's sign up information, including email, password, first name, and last name.
 * @returns A promise that resolves to the newly created user document.
 */
export const signUp = async (userData: SignUpParams) => {
  // Destruct the userData
  const { email, password, firstName, lastName } = userData;

  // Create new user account
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating new user account");

    // Create Dwolla customer account
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    // If fails then throw an error
    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    // Otherwise extract the customer id from the url
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    /**
     * Creates a new user document in the database with the provided user data, including the user's ID from the Appwrite account creation and the Dwolla customer ID and URL.
     *
     * @param userData - An object containing the user's sign up information, including email, password, first name, and last name.
     * @param newUserAccount - The newly created Appwrite user account object.
     * @param dwollaCustomerId - The ID of the newly created Dwolla customer account.
     * @param dwollaCustomerUrl - The URL of the newly created Dwolla customer account.
     * @returns A promise that resolves to the newly created user document.
     */
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    /**
     * Creates a new email/password session for the user and sets the session cookie.
     *
     * @param email - The email address of the user.
     * @param password - The password of the user.
     * @returns A promise that resolves to the created session object.
     */
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};



/**
 * Retrieves the currently logged in user.
 * @returns {Promise<string|null>} The currently logged in user as a stringified JSON object, 
 * or null if there is no logged in user.
 */
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    // Get the currently logged in user
    const user = await account.get();
    // Return the user
    return parseStringify(user);
  } catch (error) {
    return null;
  }
};



/**
 * Logs out the currently logged in user by deleting the current session.
 * @returns {Promise<void>} A promise that resolves when the logout operation is complete.
 */
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    // Delete the current session
    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

/**
 * Creates a Plaid Link token for the given user.
 * @param user - The user object for which to create the Link token.
 * @returns A promise that resolves to an object containing the generated Link token.
 */

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: { client_user_id: user.$id },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    // Create the response
    const response = await plaidClient.linkTokenCreate(tokenParams);

    // Send the response
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log("Error", error);
  }
};


/**
 * Creates a new bank account document in the database for the given user.
 * @param accessToken - The access token obtained from Plaid for the user's bank account.
 * @param userId - The ID of the user the bank account belongs to.
 * @param accountId - The ID of the bank account.
 * @param bankId - The ID of the bank the account belongs to.
 * @param fundingSourceUrl - The URL for the funding source of the bank account.
 * @param sharableId - A unique ID for the bank account that can be shared.
 * @returns A promise that resolves to the created bank account document.
 */
export const createBankAccount = async ({
  accessToken,
  userId,
  accountId,
  bankId,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        accessToken,
        userId,
        accountId,
        bankId,
        fundingSourceUrl,
        sharableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};





export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("An error occurred while creating exchanging token:", error);
  }
};
