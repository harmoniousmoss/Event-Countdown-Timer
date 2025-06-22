"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Define countdown start and end dates
const COUNTDOWN_START = new Date("2025-06-18T14:00:00Z"); // 9 PM WIB (UTC+7) on 18 June 2025
const COUNTDOWN_END = new Date("2026-06-18T14:00:00Z"); // 9 PM WIB (UTC+7) on 18 June 2026

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [daysSinceStart, setDaysSinceStart] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const startTime = COUNTDOWN_START.getTime();
      const endTime = COUNTDOWN_END.getTime();

      // Check if countdown should start
      if (now < startTime) {
        setHasStarted(false);
        setIsActive(false);
        return;
      }

      // Check if countdown has ended
      if (now >= endTime) {
        setIsActive(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate time remaining
      setHasStarted(true);
      setIsActive(true);
      const distance = endTime - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      // Calculate days since start
      const daysSinceStartCalc = Math.floor(
        (now - startTime) / (1000 * 60 * 60 * 24)
      );
      setDaysSinceStart(Math.max(0, daysSinceStartCalc));
    }, 1000);

    // Initial calculation immediately
    const initialNow = new Date().getTime();
    const initialStartTime = COUNTDOWN_START.getTime();
    const initialEndTime = COUNTDOWN_END.getTime();

    if (initialNow < initialStartTime) {
      setHasStarted(false);
      setIsActive(false);
    } else if (initialNow >= initialEndTime) {
      setHasStarted(true);
      setIsActive(false);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      setHasStarted(true);
      setIsActive(true);
      const distance = initialEndTime - initialNow;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }

    const initialDaysSinceStart = Math.floor(
      (initialNow - initialStartTime) / (1000 * 60 * 60 * 24)
    );
    setDaysSinceStart(Math.max(0, initialDaysSinceStart));

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalDays = Math.floor(
    (COUNTDOWN_END.getTime() - COUNTDOWN_START.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const progressPercentage = Math.min(100, (daysSinceStart / totalDays) * 100);

  const TimeUnit = ({
    value,
    label,
    delay = 0,
  }: {
    value: number;
    label: string;
    delay?: number;
  }) => (
    <div
      className={`flex flex-col items-center transform transition-all duration-700 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 min-w-[100px] md:min-w-[120px] border border-white/20">
          <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent tabular-nums leading-none">
            {value.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
      <div className="text-sm md:text-base font-semibold text-purple-200/90 mt-3 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  if (!hasStarted) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Countdown Awaiting
          </h2>
          <p className="text-purple-200/80 mb-6 text-lg">
            The countdown will begin on:
          </p>
          <p className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {formatDate(COUNTDOWN_START)}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isActive && hasStarted) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Event Has Begun!
          </h2>
          <p className="text-purple-200/80 text-lg">
            The countdown has ended. The event began on:
          </p>
          <p className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-4">
            {formatDate(COUNTDOWN_END)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
      <CardContent className="p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Time Remaining
          </h2>
          <p className="text-purple-200/80 text-lg">
            Event starts: {formatDate(COUNTDOWN_END)}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-purple-200/90 uppercase tracking-wider">
              Journey Progress
            </span>
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Day {daysSinceStart} of {totalDays}
            </span>
          </div>

          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div
              className="absolute -top-1 -bottom-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1 transition-all duration-1000 ease-out"
              style={{
                left: `${progressPercentage}%`,
                transform: "translateX(-50%)",
              }}
            ></div>
          </div>

          <div className="text-center mt-6">
            <div className="inline-flex items-center space-x-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {daysSinceStart}
              </span>
              <span className="text-purple-200/80 text-lg">days elapsed</span>
            </div>
            <div className="text-sm text-purple-300/60 mt-1">
              {progressPercentage.toFixed(1)}% complete
            </div>
          </div>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
          <TimeUnit value={timeLeft.days} label="Days" delay={0} />
          <TimeUnit value={timeLeft.hours} label="Hours" delay={100} />
          <TimeUnit value={timeLeft.minutes} label="Minutes" delay={200} />
          <TimeUnit value={timeLeft.seconds} label="Seconds" delay={300} />
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 backdrop-blur-sm">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50"></div>
            <span className="text-sm font-semibold text-purple-200 uppercase tracking-wider">
              Live Countdown Active
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
