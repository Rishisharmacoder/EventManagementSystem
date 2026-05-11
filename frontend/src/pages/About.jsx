import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Users, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>
        
        <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-secondary font-bold text-xs tracking-[0.2em] uppercase"
          >
            About The Institution
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tighter"
          >
            Baba Farid Group of <br/>
            <span className="text-secondary">Institutions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            A premier educational institution committed to academic excellence, 
            holistic development, and fostering a vibrant campus culture.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 -mt-12 relative z-20 space-y-16">
        
        {/* Mission Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Legacy</h2>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                Established with a vision to provide quality education, Baba Farid Group of Institutions (BFGI) 
                has emerged as a leading educational hub. We focus on transforming students into industry-ready 
                professionals through rigorous academics, practical exposure, and continuous innovation.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Trophy className="w-5 h-5" /> 100+ Awards
                </div>
                <div className="flex items-center gap-2 font-bold text-secondary">
                  <Users className="w-5 h-5" /> 10,000+ Alumni
                </div>
              </div>
            </div>
            <div className="h-64 rounded-3xl overflow-hidden shadow-lg">
              <img 
                src="https://babafaridgroup.edu.in/assets/upload/university-pic.jpg" 
                alt="Campus" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </motion.div>

        {/* Event Culture Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900">Vibrant Event Culture</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Education at BFGI goes beyond classrooms. Our dynamic event ecosystem is designed to nurture talent, foster leadership, and celebrate diversity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Technical Fests",
                color: "text-primary",
                bg: "bg-primary/5",
                desc: "Hackathons, coding challenges, and tech symposiums that push the boundaries of innovation."
              },
              {
                icon: Users,
                title: "Cultural Events",
                color: "text-secondary",
                bg: "bg-secondary/5",
                desc: "Youth fests, dance competitions, and art exhibitions celebrating our rich cultural heritage."
              },
              {
                icon: BookOpen,
                title: "Workshops & Seminars",
                color: "text-accent",
                bg: "bg-accent/5",
                desc: "Industry expert sessions and hands-on workshops to bridge the gap between academia and industry."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-[3rem] p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-black">Ready to experience the vibrant campus life?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of students in discovering and participating in exciting events across the campus.
            </p>
            <Link to="/events" className="btn bg-white hover:bg-slate-100 btn-lg rounded-2xl text-slate-900 font-black shadow-xl hover:scale-105 transition-transform border-none">
              Explore All Events <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
