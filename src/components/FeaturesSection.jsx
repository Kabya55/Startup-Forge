"use client";

import { 
  Magnifier, 
  ChartLine, 
  Factory, 
  Globe, 
  Thunderbolt, 
  ShieldCheck 
} from "@gravity-ui/icons";
import { motion } from "motion/react";

const features = [
  {
    icon: <Magnifier className="w-6 h-6 text-violet-400" />,
    title: "Smart Search",
    description: "Find the best opportunities for you using advanced search algorithms.",
  },
  {
    icon: <ChartLine className="w-6 h-6 text-violet-400" />,
    title: "Instant Insights",
    description: "Get detailed analytics on your opportunity search performance.",
  },
  {
    icon: <Factory className="w-6 h-6 text-violet-400" />,
    title: "Top Startups",
    description: "Get hired by the top startups in the tech industry.",
  },
  {
    icon: <Globe className="w-6 h-6 text-violet-400" />,
    title: "Global Reach",
    description: "Access remote and on-site opportunities worldwide.",
  },
  {
    icon: <Thunderbolt className="w-6 h-6 text-violet-400" />,
    title: "Auto Apply",
    description: "Automatically apply to opportunities that match your profile.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-violet-400" />,
    title: "Secure Platform",
    description: "Your data is safe and secure with our advanced encryption.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className="bg-black py-24 text-white relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 text-violet-500 font-semibold tracking-wider text-sm mb-4 uppercase">
              <span className="w-8 h-[1px] bg-violet-500/50" />
              Everything You Need
              <span className="w-8 h-[1px] bg-violet-500/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Everything you need
              <br />
              to succeed
            </h2>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              variants={item}
              key={index}
              className="group flex gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:bg-violet-500/10 group-hover:border-violet-500/30">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
