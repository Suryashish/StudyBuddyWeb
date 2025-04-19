'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the AI generate the perfect plan?',
    answer:
      'Our AI analyzes your learning style, goals, and available time to create a personalized study plan that optimizes your learning efficiency. It adapts as you progress, making real-time adjustments based on your performance.',
  },
  {
    question: 'Can I customize my study plan?',
    answer:
      'Absolutely! While our AI generates an optimal study plan, you maintain full control. You can modify session durations, rearrange topics, or block off dates as needed. The system will readjust around your changes.',
  },
  {
    question: 'Is there a mobile app?',
    answer:
      'Yes, we offer mobile apps for both iOS and Android platforms. These sync seamlessly with your account, allowing you to access your study plan and learning materials on the go.',
  },
  {
    question: 'What happens if I skip a study session?',
    answer:
      'Life happens, and we understand that. If you miss a session, our system will automatically recalibrate your plan, redistributing the content to ensure you still cover everything before your deadline without overwhelming you.',
  },
];

export function FaqSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">FAQ</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></span>
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="hidden lg:block">
            <img
              src="/placeholder-students-discussing.png"
              alt="Students discussing"
              className="max-w-md ml-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}