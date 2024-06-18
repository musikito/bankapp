import HeaderBox from '@/components/HeaderBox'
import RightSideBar from '@/components/RightSideBar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {

  const loggedIn = { firstName: 'JoseMiguel', lastName: "Marte", email: "tumusicalatina@gmail.com" };
  return (
    <section className="home">
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Manage and budget your money"
          />
          <TotalBalanceBox
            accounts={[]}
            totalCurrentBalance={12356.43}
            totalBanks={1}

          />
        </header>
        RECENT TRANSACTIONS
      </div>
      {/** Right Side bar */}
      <RightSideBar
        user={loggedIn}
        transactions={[]}
        banks={[{currentBalance: 123.45},{currentBalance:4000.00}]}
      />
    </section>
  )
}

export default Home