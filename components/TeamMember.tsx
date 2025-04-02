'use client';

import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';

interface TeamMemberProps {
  name: string;
  role: string;
  quote: string;
  image: string;
  instagram: string;
  linkedin: string;
}

export default function TeamMember({ name, role, quote, image, instagram, linkedin }: TeamMemberProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full h-[400px] perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 z-0">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover filter brightness-50 blur-[2px]"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
              <p className="text-gray-200">{role}</p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl p-6 bg-black/90 backdrop-blur-sm shadow-xl text-white flex flex-col justify-between">
            <div className="flex justify-end space-x-4 z-10">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
            
            <blockquote className="text-lg italic text-center my-auto z-10">
              "{quote}"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
