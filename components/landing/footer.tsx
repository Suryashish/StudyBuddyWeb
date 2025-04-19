import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Contact',
    links: [
      { name: 'Email', href: '#' },
      { name: 'Phone', href: '#' },
      { name: 'Support', href: '#' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { name: 'Math', href: '#' },
      { name: 'Science', href: '#' },
      { name: 'Languages', href: '#' },
      { name: 'Humanities', href: '#' },
    ],
  },
  {
    title: 'Features',
    links: [
      { name: 'AI Planner', href: '#' },
      { name: 'Scheduling', href: '#' },
      { name: 'Visualizations', href: '#' },
      { name: 'Analytics', href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'FAQs', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'Documentation', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-10 w-10" />
            <span className="font-bold text-3xl">StudyBuddy</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium text-lg mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm text-gray-400">
          <p>© 2025 StudyBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}