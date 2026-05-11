import React, { useEffect } from 'react';
import { motion } from 'framer-motion'; // Check if your import was 'motion/react', usually it is 'framer-motion'
import { useSelector, useDispatch } from 'react-redux';
import { setMyEvents, setLoading } from '../store/slices/eventSlice.js';
import { Calendar, MapPin, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function MyEvents() {
  const { myEvents = [], loading } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRegistrations = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get('/registrations/my-events');
        
        // Debugging: Console check karein ki data kya aa raha hai
        console.log("Registration Data:", data);

        // Safety Check: Agar backend directly event objects bhej raha hai ya nested
        let eventsData = [];
        if (Array.isArray(data)) {
          eventsData = data
            .map(reg => (typeof reg.eventId === 'object' ? reg.eventId : reg)) 
            .filter(event => event && event._id); // Sirf valid events rakhein
        }

        dispatch(setMyEvents(eventsData));
      } catch (err) {
        console.error("Failed to load registrations", err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchRegistrations();
  }, [dispatch]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      try {
        // ID check: ensure we are sending the registration ID if needed, 
        // but here we use event ID as per your existing logic
        await api.delete(`/registrations/cancel/${id}`);
        const updated = myEvents.filter(e => e._id !== id);
        dispatch(setMyEvents(updated));
      } catch (err) {
        console.error(err);
        alert("Failed to cancel registration");
      }
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold">My Registered Events</h1>
        <p className="text-base-content/60">Manage your event participations</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : !myEvents || myEvents.length === 0 ? (
        <div className="text-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
          <Calendar className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
          <h3 className="text-xl font-semibold">No events found</h3>
          <p className="text-base-content/60 mb-6">You haven't registered for any events yet.</p>
          <Link to="/" className="btn btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myEvents.map((event) => (
            <motion.div 
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex-col sm:flex-row bg-base-100 shadow-xl overflow-hidden border border-base-200"
            >
              <figure className="w-full sm:w-1/3 h-48 sm:h-auto shrink-0">
                <img 
                  src={event.image || 'https://picsum.photos/seed/tech/800/400'} 
                  alt={event.title} 
                  className="h-full w-full object-cover" 
                />
              </figure>
              <div className="card-body w-full sm:w-2/3 p-6">
                <h2 className="card-title text-lg font-bold line-clamp-1">{event.title}</h2>
                <div className="flex flex-col gap-2 text-sm text-base-content/70 my-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button onClick={() => handleCancel(event._id)} className="btn btn-ghost btn-sm text-error hover:bg-error/10">
                    <XCircle className="w-4 h-4 mr-1" /> Cancel
                  </button>
                  <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm px-6">View</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}