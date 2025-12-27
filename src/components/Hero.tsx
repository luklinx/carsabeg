"use client";

import Image from "next/image";
import React from "react";
import CustomButton from "@/components/CustomButton";

const Hero: React.FC = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero bg-white text-gray-900 relative overflow-hidden">
      {/* right-positioned decorative background image (public/hero-bg.png) */}
      <div className="absolute top-0 right-0 h-[110vh] w-[60vw] sm:w-[55vw] md:w-[50vw] lg:w-[45vw] xl:w-[40vw] z-0 pointer-events-none overflow-visible">
        <div className="relative w-full h-full">
          <Image
            src="/hero-bg.png"
            alt="decorative background"
            fill
            className={
              "object-cover object-right-top transform origin-top-right " +
              "rotate-[-14deg] sm:rotate-[-12deg] md:rotate-[-10deg] lg:rotate-[-8deg] xl:rotate-[-6deg] " +
              "translate-x-[36%] sm:translate-x-[30%] md:translate-x-[22%] lg:translate-x-[12%] xl:translate-x-[8%] " +
              "-translate-y-[6vh] sm:-translate-y-[6vh] md:-translate-y-[4vh] lg:-translate-y-[2vh] xl:-translate-y-[1vh] " +
              "scale-[1.06] sm:scale-[1.05] md:scale-[1.04] lg:scale-[1.03] xl:scale-[1.02] " +
              "opacity-75 sm:opacity-80 md:opacity-85 lg:opacity-90"
            }
            priority={false}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-10 py-20 relative z-10">
        <div className="flex-1 pt-8 lg:pt-36">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            Find, book, buy or rent a car — quick and super easy!
          </h1>

          <p className="mt-4 text-lg md:text-xl opacity-90 max-w-2xl">
            Streamline your car rental experience with our effortless booking
            process.
          </p>

          <div className="mt-8">
            <CustomButton
              btnType="button"
              handleClick={handleScroll}
              containerStyles="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-full font-black text-lg shadow-lg transition"
              title="Explore Cars"
            />
          </div>
        </div>

        <div className="hero__image-container w-full lg:w-1/2 relative h-64 sm:h-96 lg:h-[420px] flex items-center justify-center">
          <div className="relative w-full h-full max-w-[680px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] lg:drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
            <Image src="/hero.png" alt="hero" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
