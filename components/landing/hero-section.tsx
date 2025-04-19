import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Find the right{' '}
                <span className="text-orange-500 dark:text-orange-400">
                  Plans
                </span>{' '}
                for you.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Let our intelligent planner be your perfect study solution. Take
                control of your goals, deadlines, and free time.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="animate-pulse">
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Try it for free
              </Button>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end w-full max-w-xl">
            <div className="relative w-full aspect-square max-w-md">
              <Image
                src="/placeholder-student-reading.png"
                alt="Student reading"
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}