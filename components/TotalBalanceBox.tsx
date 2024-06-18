/**
 * Renders a total balance box component that displays the total current balance, number of bank accounts, and a doughnut chart visualization of the account balances.
 *
 * @param accounts - An array of account objects, each with a balance property.
 * @param totalCurrentBalance - The total current balance across all accounts.
 * @param totalBanks - The total number of bank accounts.
 * @returns A React component that renders the total balance box.
 */
"use client";
import { formatAmount } from "@/lib/utils";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  accounts = [],
  totalCurrentBalance,
  totalBanks,
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Banks Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance: </p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
            {/* {formatAmount(totalCurrentBalance)} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
