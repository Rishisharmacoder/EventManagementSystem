import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Clock, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../services/api.js';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    setRegistering(true);
    try {
      await api.post(`/registrations/register/${id}`);
      setSuccess(true);
      setEvent(prev => ({ ...prev, registeredCount: (prev.registeredCount || 0) + 1 }));
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data?.error || "Registration failed or already registered");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  );

  if (!event) return <div className="text-center py-20">Event not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header Image */}
      <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
          <div className="text-white space-y-2">
            <h1 className="text-4xl font-bold">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</div>
              <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">About the Event</h2>
              <p className="text-base-content/80 leading-relaxed">{event.description}</p>
              
              <div className="divider"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Clock className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-sm text-base-content/60">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Info className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold">Organizer</p>
                    <p className="text-sm text-base-content/60">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl sticky top-8">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4">Registration</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Spots Available</span>
                  <span className="font-bold">{event.capacity - event.registeredCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Total Capacity</span>
                  <span className="font-bold">{event.capacity}</span>
                </div>
                <progress className="progress progress-primary w-full" value={event.registeredCount} max={event.capacity}></progress>
              </div>

              {success ? (
                <div className="alert alert-success">
                  <CheckCircle className="w-5 h-5" />
                  <span>Successfully Registered!</span>
                </div>
              ) : (
                <button 
                  onClick={handleRegister}
                  className={`btn btn-primary w-full ${registering ? 'loading' : ''}`}
                  disabled={registering || (event.registeredCount >= event.capacity)}
                >
                  {event.registeredCount >= event.capacity ? 'Event Full' : 'Register Now'}
                </button>
              )}

              {!isAuthenticated && !success && (
                <div className="flex items-center gap-2 text-xs text-warning mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please login to register</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
