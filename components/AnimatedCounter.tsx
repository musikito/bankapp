'use client';
import React from 'react'
import CountUp from 'react-countup'

const AnimatedCounter = ({ amount }: { amount: number }) =>{
    return (
    <div className="w-full flex justify-center items-center">
            <CountUp
                duration={2.75}
                decimals={2}
                decimal=','
                prefix='$'
                end={amount} />
        </div>

    )
}

export default AnimatedCounter