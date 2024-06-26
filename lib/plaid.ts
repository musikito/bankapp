/**
 * Initializes a Plaid API client with the provided client ID and secret.
 * The client is configured to use the Plaid Sandbox environment.
 *
 * @returns {PlaidApi} A Plaid API client instance.
 */
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments.Sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
