/**
 * A React component that displays an animated counter with a specified amount.
 *
 * @param {object} props - The component props.
 * @param {number} props.amount - The amount to be displayed in the counter.
 * @returns {JSX.Element} - The rendered AnimatedCounter component.
 */
"use client";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <CountUp
        duration={2.75}
        decimals={2}
        decimal=","
        prefix="$"
        end={amount}
      />
    </div>
  );
};

export default AnimatedCounter;
