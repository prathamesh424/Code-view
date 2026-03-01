'use client';

import { motion } from 'framer-motion';
import {
  Layers,
  Activity,
  MemoryStick,
  Bug,
  Palette,
  Globe,
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Multi-Language',
    description: 'JavaScript, Python, C, C++, and Java — all in one playground.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: 'Event Loop Visualization',
    description: 'Watch the JS event loop, microtask queue, and macrotask queue animate in real time.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: <MemoryStick className="w-5 h-5" />,
    title: 'Memory Layout',
    description: 'See stack vs heap allocation, pointer relationships, and memory lifecycle for C/C++.',
    color: 'text-error',
    bg: 'bg-error/10',
  },
  {
    icon: <Bug className="w-5 h-5" />,
    title: 'Step-by-Step Debugger',
    description: 'Breakpoints, call stack, variable inspection, and line-by-line stepping.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Dark & Light Themes',
    description: 'Beautiful dark and light modes with smooth transitions. Easy on the eyes.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Engine Internals',
    description: 'Python GIL, Java JVM & GC, C++ RAII — see what happens under the hood.',
    color: 'text-accent-secondary',
    bg: 'bg-accent-secondary/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to{' '}
            <span className="gradient-text">Understand Code</span>
          </h2>
          <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
            More than a code runner — a visual learning tool that reveals 
            the hidden mechanics of programming languages.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 rounded-xl bg-surface border border-border hover:border-border-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
