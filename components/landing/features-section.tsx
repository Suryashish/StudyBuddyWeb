import { FeatureCard } from './feature-card';

const features = [
  {
    title: 'AI-Powered Learning Engine',
    color: 'purple',
    imageSrc: '/landingimages/Group 1.svg',
  },
  {
    title: 'Dynamic Study Scheduler',
    color: 'yellow',
    imageSrc: '/landingimages/Group 1.svg',
  },
  {
    title: 'Interactive Topic Visualizer',
    color: 'blue',
    imageSrc: '/landingimages/Group 1.svg',
  },
  {
    title: 'Personalized Revision Suggestions',
    color: 'black',
    imageSrc: '/landingimages/Group 1.svg',
  },
  {
    title: 'Performance Analytics Dashboard',
    color: 'orange',
    imageSrc: '/landingimages/Group 1.svg',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              color={feature.color as any}
              imageSrc={feature.imageSrc}
            />
          ))}
        </div>

        {/* Runner illustration on the side */}
        <div className="hidden lg:block absolute right-0 bottom-0 transform translate-x-1/4">
          <img
            src="/landingimages/Transhumans - Coffee 1.svg"
            alt="Student running"
            className="w-72 h-auto"
          />
        </div>
      </div>
    </section>
  );
}