
import React from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown.js';

const CountdownTimer = ({ targetDate, showDays = true }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const TimeUnit = ({ value, label }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-[#1a1a2e] text-[#D4AF37] rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] shadow-premium">
        <span className="text-3xl sm:text-5xl font-bold block" style={{ fontFamily: 'Playfair Display, serif' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">{label}</span>
    </motion.div>
  );

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      {showDays && <TimeUnit value={days} label="Days" />}
      <TimeUnit value={hours} label="Hours" />
      <TimeUnit value={minutes} label="Minutes" />
      <TimeUnit value={seconds} label="Seconds" />
    </div>
  );
};

export default CountdownTimer;
