"use server";

import { Client } from "dwolla-v2";

/**
 * Determines the Dwolla environment based on the `DWOLLA_ENV` environment variable.
 *
 * @returns {string} The Dwolla environment, either "sandbox" or "production".
 * @throws {Error} If the `DWOLLA_ENV` environment variable is not set to either "sandbox" or "production".
 */
const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

/**
 * Creates a Dwolla client instance with the appropriate environment, key, and secret.
 *
 * The Dwolla environment is determined by the `DWOLLA_ENV` environment variable, which should be set to either "sandbox" or "production".
 * The Dwolla API key and secret are read from the `DWOLLA_KEY` and `DWOLLA_SECRET` environment variables, respectively.
 *
 * @returns {Client} A Dwolla client instance configured with the appropriate environment, key, and secret.
 */
const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

/**
 * Creates a Dwolla funding source using a Plaid processor token.
 *
 * @param options - An object containing the necessary parameters to create a Dwolla funding source.
 * @param options.customerId - The ID of the Dwolla customer to associate the funding source with.
 * @param options.fundingSourceName - The name to give the new funding source.
 * @param options.plaidToken - The Plaid processor token to use for the funding source.
 * @returns {Promise<string>} The URL of the newly created funding source.
 */
// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
};

/**
 * Creates a new on-demand authorization for the Dwolla client.
 *
 * This function creates a new on-demand authorization using the Dwolla client instance. The on-demand authorization is used to authorize actions on behalf of a Dwolla customer.
 *
 * @returns {Promise<{ href: string }>} The authorization link that can be used to authorize actions on behalf of a Dwolla customer.
 */
export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
};

/**
 * Creates a new Dwolla customer.
 *
 * @param newCustomer - An object containing the necessary parameters to create a new Dwolla customer.
 * @returns {Promise<string>} The URL of the newly created Dwolla customer.
 */
export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
  }
};

/**
 * Creates a new transfer between two Dwolla funding sources.
 *
 * This function creates a new transfer between two Dwolla funding sources. The transfer is initiated by specifying the source and destination funding source URLs, as well as the transfer amount.
 *
 * @param sourceFundingSourceUrl - The URL of the source funding source.
 * @param destinationFundingSourceUrl - The URL of the destination funding source.
 * @param amount - The amount to be transferred, in USD.
 * @returns {Promise<string>} The URL of the newly created transfer.
 */
export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

/**
 * Adds a new funding source to a Dwolla customer.
 *
 * This function creates a new on-demand authorization link with Dwolla, and then uses that link to add a new funding source to the specified Dwolla customer. The funding source is identified by the provided bank name and processor token.
 *
 * @param dwollaCustomerId - The ID of the Dwolla customer to add the funding source to.
 * @param processorToken - The token obtained from the payment processor (e.g. Plaid) to identify the funding source.
 * @param bankName - The name of the bank associated with the funding source.
 * @returns {Promise<string>} The URL of the newly created funding source.
 */
export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};
