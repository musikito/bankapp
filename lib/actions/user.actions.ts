'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

/**
 * Authenticates a user by creating an email/password session.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A stringified JSON object representing the newly created session, or null if an error occurred.
 */
export const signIn = async ({ email, password }: signInProps) => {
  console.log("signin", email, password);
  

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
 * Registers a new user account and creates a session for the user.
 *
 * @param userData - An object containing the user's email, password, first name, and last name.
 * @returns A stringified JSON object representing the newly created user account, or null if an error occurred.
 */

export const signUp = async (userData: SignUpParams) => {
  console.log("inside sign up", userData);
  
  // Destruct the userData
  const { email, password, firstName, lastName } = userData;

  try {
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    // Create a session by passing email and password
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
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

