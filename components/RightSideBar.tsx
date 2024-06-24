/**
 * The `RightSideBar` component renders the right sidebar of the application, which includes the user's profile information and a section for displaying the user's bank accounts.
 *
 * @param {RightSidebarProps} props - The props passed to the `RightSideBar` component.
 * @param {User} props.user - The user object containing the user's name and email.
 * @param {Transaction[]} props.transactions - An array of transaction objects.
 * @param {BankAccount[]} props.banks - An array of bank account objects.
 * @returns {JSX.Element} - The rendered `RightSideBar` component.
 */
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BankCard from "./BankCard";

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user?.name[0]}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {user?.name}
              <p className="profile-email">{user?.email}</p>
            </h1>
          </div>
        </div>
      </section>
      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
            <h2 className="text-14 font-semibold text-gray-600"> Add Bank</h2>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col itemms-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={user.name}
                showBalance={false}
              />
            </div>
            <div className="absolute right-0 top-8 z-0 w-[90%]">
              <BankCard
                key={banks[1].$id}
                account={banks[1]}
                userName={user?.name}
                showBalance={false}
              />
            </div>
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSideBar;
