import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "motion/react";
import { MapPin, Users } from "lucide-react";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events/all?limit=50");
        setEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-12 pb-24">
      <header className="text-center space-y-6 py-8">
        {/* text-slate-900 se text ka color black/dark gray ho jayega */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          All Events
        </h1>

        {/* text-slate-600 se paragraph clear dikhega */}
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Explore all the events happening across the campus.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton h-[500px] w-full rounded-[2.5rem]"
            ></div>
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
                    {new Date(event.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <span>
                      {event.registeredCount} / {event.capacity} Registered
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Link
                    to={`/events/${event._id}`}
                    className="btn btn-primary btn-block rounded-2xl h-14 group-hover:btn-secondary transition-all duration-300 font-bold shadow-lg shadow-primary/10 hover:shadow-secondary/30"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
