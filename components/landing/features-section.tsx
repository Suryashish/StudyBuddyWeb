import { FeatureCard } from './feature-card';

const features = [
  {
    title: 'AI-Powered Learning Engine',
    color: 'purple',
    imageSrc: 'https://via.placeholder.com/400x300/4B0082/FFFFFF?text=AI+Learning',
  },
  {
    title: 'Dynamic Study Scheduler',
    color: 'yellow',
    imageSrc: 'https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Study+Scheduler',
  },
  {
    title: 'Interactive Topic Visualizer',
    color: 'blue',
    imageSrc: 'https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Topic+Visualizer',
  },
  {
    title: 'Personalized Revision Suggestions',
    color: 'black',
    imageSrc: 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Revision+Suggestions',
  },
  {
    title: 'Performance Analytics Dashboard',
    color: 'orange',
    imageSrc: 'https://via.placeholder.com/400x300/FF4500/FFFFFF?text=Analytics+Dashboard',
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
            src="/placeholder-runner.png"
            alt="Student running"
            className="w-72 h-auto"
          />
        </div>
      </div>
    </section>
  );
}