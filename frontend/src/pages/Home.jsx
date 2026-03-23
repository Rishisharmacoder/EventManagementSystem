import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { setEvents, setLoading } from '../store/slices/eventSlice.js';
import { Calendar, MapPin, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function Home() {
  const { events, loading } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get('/events/all');
        dispatch(setEvents(data));
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchEvents();
  }, [dispatch]);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl"
      >
        <img 
          src="https://picsum.photos/seed/campus-bfgi/1920/1080" 
          alt="BFGI Campus" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-8 md:px-20">
          <div className="max-w-3xl text-white space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-secondary font-bold text-xs tracking-[0.2em] uppercase"
            >
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              BABA FARID GROUP OF INSTITUTIONS
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Ignite Your <br/>
              <span className="text-secondary">Potential</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-xl font-medium">
              A hub of innovation, culture, and excellence. Discover and participate in events that shape your future.
            </p>
            <div className="flex flex-wrap gap-5 pt-6">
              <button className="btn btn-secondary btn-lg rounded-2xl px-12 text-white shadow-2xl shadow-secondary/30 hover:shadow-secondary/50 transition-all active:scale-95 font-bold">Explore Events</button>
              <button className="btn btn-ghost btn-lg rounded-2xl px-12 text-white border-2 border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all active:scale-95 font-bold">Learn More</button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section - Dashboard Style */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Total Events', value: '500+', icon: Calendar, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Students', value: '10,000+', icon: Users, color: 'text-secondary', bg: 'bg-secondary/5' },
          { label: 'Placements', value: '95%', icon: ArrowRight, color: 'text-accent', bg: 'bg-accent/5' },
          { label: 'Awards', value: '100+', icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/5' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bfgi-card p-10 text-center group relative overflow-hidden"
          >
            <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-[1.5rem] ${stat.bg} mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-secondary transition-colors duration-500"></div>
          </motion.div>
        ))}
      </section>

      {/* Latest Events */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-xs font-black tracking-[0.2em] uppercase rounded-full">
              What's Happening
            </div>
            <h2 className="section-title">Upcoming Campus Events</h2>
            <p className="section-subtitle">Stay updated with the latest technical, cultural, and academic events happening across the campus.</p>
          </div>
          <Link to="/events" className="btn btn-ghost text-primary font-bold hover:bg-primary/5 group">
            View All Events <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-[500px] w-full rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bfgi-card group overflow-hidden flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500"></div>
                  <div className="absolute top-6 left-6 glass-panel rounded-2xl p-3 text-center min-w-[70px]">
                    <span className="block text-2xl font-black text-primary leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1 block">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{event.title}</h3>
                    <p className="text-slate-500 line-clamp-2 leading-relaxed font-medium">{event.description}</p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
                      <div className="p-2 bg-slate-50 rounded-xl"><MapPin className="w-4 h-4 text-primary" /></div>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
                      <div className="p-2 bg-slate-50 rounded-xl"><Users className="w-4 h-4 text-primary" /></div>
                      <span>{event.registeredCount} / {event.capacity} Registered</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Link to={`/events/${event._id}`} className="btn btn-primary btn-block rounded-2xl h-14 group-hover:btn-secondary transition-all duration-300 font-bold shadow-lg shadow-primary/10 hover:shadow-secondary/30">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why Join Section - Modern Split Layout */}
      <section className="bg-slate-900 rounded-[4rem] p-10 md:p-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/10 text-secondary text-xs font-black tracking-[0.2em] uppercase rounded-full">
                Excellence Hub
              </div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">Why Participate in <br/><span className="text-secondary">BFGI Events?</span></h2>
              <p className="text-slate-400 text-xl leading-relaxed font-medium">
                Our events are designed to provide students with real-world exposure, networking opportunities, and a platform to showcase their talents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Skill Development', desc: 'Master new technologies and soft skills.' },
                { title: 'Industry Interaction', desc: 'Connect with experts and leaders.' },
                { title: 'Cultural Exchange', desc: 'Celebrate diversity and creativity.' },
                { title: 'Innovation Hub', desc: 'Turn your ideas into reality.' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
                    <span className="font-black text-lg tracking-tight">{item.title}</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium pl-5">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <button className="btn btn-secondary btn-lg rounded-2xl px-12 font-bold shadow-2xl shadow-secondary/20">Get Started Now</button>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img src="https://picsum.photos/seed/bfgi-1/600/800" className="rounded-[3rem] shadow-2xl transition-transform hover:scale-105 duration-700" alt="Campus Life" referrerPolicy="no-referrer" />
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                  <div className="text-4xl font-black text-secondary">100+</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Awards Won</div>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-secondary p-8 rounded-[2.5rem] shadow-2xl shadow-secondary/20">
                  <div className="text-4xl font-black text-white">95%</div>
                  <div className="text-sm font-bold text-white/80 uppercase tracking-widest mt-1">Placement Rate</div>
                </div>
                <img src="https://picsum.photos/seed/bfgi-2/600/800" className="rounded-[3rem] shadow-2xl transition-transform hover:scale-105 duration-700" alt="Campus Life" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
