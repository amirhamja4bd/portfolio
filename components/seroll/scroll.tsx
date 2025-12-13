"use client";
import React, { useEffect, useState } from "react";

const ScrollProgress: React.FC = () => {
  const [percent, setPercent] = useState<number>(0);
  const circumference: number = 30 * 2 * Math.PI;

  const handleScroll = () => {
    const winScroll: number =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height: number =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setPercent(Math.round((winScroll / height) * 100));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="">
      {/* Top bar */}
      <div className="fixed inset-y-0 right-0 z-500000000000">
        <div
          className="w-1 bg-primary"
          style={{ height: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScrollProgress;
