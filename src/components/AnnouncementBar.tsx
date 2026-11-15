import { useEffect, useState } from 'react';
import { ANNOUNCEMENTS } from '@/data/store';

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setVisible(true);
      }, 250);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-tulsi text-ivory h-9 flex items-center justify-center px-4 text-center">
      <p
        className={`text-[12px] md:text-[13px] font-jakarta tracking-wide transition-opacity duration-base ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {ANNOUNCEMENTS[index]}
      </p>
    </div>
  );
}

