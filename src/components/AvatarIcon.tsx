import React from 'react';

interface AvatarIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative rounded-full overflow-hidden bg-gradient-to-b from-[#f3e7e9] via-[#e3eeff] to-[#e0c3fc] p-0.5 shadow-md flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Anime / Illustrated user portrait matching the reference image */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full rounded-full bg-[#f8fafc]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft background glow */}
        <circle cx="50" cy="50" r="48" fill="#F1F5F9" />
        
        {/* Shoulders / High-collar black jacket matching mockup */}
        <path
          d="M18 96C18 80 32 74 50 74C68 74 82 80 82 96"
          fill="#1E293B"
        />
        {/* Jacket collar & inner shirt */}
        <path
          d="M36 75L50 87L64 75"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M44 78L50 84L56 78"
          fill="#FFFFFF"
        />
        
        {/* Neck */}
        <path
          d="M42 62H58V75C58 75 54 78 50 78C46 78 42 75 42 75V62Z"
          fill="#FBD38D"
        />
        {/* Neck shadow */}
        <path
          d="M42 62C46 66 54 66 58 62V67C54 70 46 70 42 67V62Z"
          fill="#F6AD55"
        />

        {/* Head / Face */}
        <path
          d="M28 42C28 28 37 20 50 20C63 20 72 28 72 42C72 56 61 65 50 65C39 65 28 56 28 42Z"
          fill="#FEEBC8"
        />

        {/* Ears */}
        <circle cx="27" cy="44" r="5" fill="#FEEBC8" />
        <circle cx="73" cy="44" r="5" fill="#FEEBC8" />

        {/* Headset / Headphones band around ears (like in mockup) */}
        <rect x="23" y="38" width="6" height="12" rx="3" fill="#0F172A" />
        <rect x="71" y="38" width="6" height="12" rx="3" fill="#0F172A" />

        {/* Cute anime dark messy hair */}
        <path
          d="M24 38C22 30 28 16 48 14C68 12 76 24 76 34C78 37 77 43 75 45C72 38 72 32 68 28C64 36 57 32 50 30C46 34 38 32 34 35C30 38 29 44 26 46C24 44 24 40 24 38Z"
          fill="#0F172A"
        />
        <path
          d="M32 26C38 20 48 18 56 20C62 21 68 25 70 29C66 26 60 24 54 25C47 26 41 29 36 33L32 26Z"
          fill="#334155"
        />
        {/* Bangs / Fringe over forehead */}
        <path
          d="M32 34L36 42L42 35L48 44L53 35L60 43L64 36L68 40C68 36 67 31 64 28C56 31 46 29 40 33L32 34Z"
          fill="#0F172A"
        />

        {/* Friendly anime eyes */}
        <ellipse cx="40" cy="44" rx="3.5" ry="4" fill="#0F172A" />
        <circle cx="41" cy="42.5" r="1.5" fill="#FFFFFF" />

        <ellipse cx="60" cy="44" rx="3.5" ry="4" fill="#0F172A" />
        <circle cx="61" cy="42.5" r="1.5" fill="#FFFFFF" />

        {/* Cheerful anime smile */}
        <path
          d="M45 52C47 55 53 55 55 52"
          stroke="#C05621"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Subtle cute blush */}
        <ellipse cx="34" cy="48" rx="3" ry="1.5" fill="#FEB2B2" opacity="0.8" />
        <ellipse cx="66" cy="48" rx="3" ry="1.5" fill="#FEB2B2" opacity="0.8" />
      </svg>
    </div>
  );
};
