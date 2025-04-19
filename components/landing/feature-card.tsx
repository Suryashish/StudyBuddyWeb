'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface FeatureCardProps {
  title: string;
  color: 'purple' | 'yellow' | 'blue' | 'black' | 'orange';
  imageSrc: string;
}

export function FeatureCard({ title, color, imageSrc }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBgColor = () => {
    switch (color) {
      case 'purple':
        return 'bg-purple-900/20 border-purple-800/30 hover:border-purple-700';
      case 'yellow':
        return 'bg-yellow-900/20 border-yellow-800/30 hover:border-yellow-700';
      case 'blue':
        return 'bg-blue-900/20 border-blue-800/30 hover:border-blue-700';
      case 'black':
        return 'bg-gray-900/40 border-gray-800/30 hover:border-gray-700';
      case 'orange':
        return 'bg-orange-900/20 border-orange-800/30 hover:border-orange-700';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Card
      className={cn(
        'overflow-hidden border transition-all duration-300',
        getBgColor(),
        isHovered ? 'translate-y-[-8px] shadow-lg' : ''
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardContent>
    </Card>
  );
}