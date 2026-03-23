import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { setMyEvents, setLoading } from '../store/slices/eventSlice.js';
import { Calendar, MapPin, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function MyEvents() {
  const { myEvents, loading } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRegistrations = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get('/registrations/my-events');
        // Backend returns registrations populated with eventId
        const events = data.map(reg => reg.eventId).filter(Boolean);
        dispatch(setMyEvents(events));
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Registered Events</h1>
        <p className="text-base-content/60">Manage your event participations</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : myEvents.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-3xl shadow-inner">
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card card-side bg-base-100 shadow-xl overflow-hidden"
            >
              <figure className="w-1/3">
                <img src={event.image || 'https://picsum.photos/seed/tech/800/400'} alt={event.title} className="h-full object-cover" />
              </figure>
              <div className="card-body w-2/3">
                <h2 className="card-title">{event.title}</h2>
                <div className="flex flex-col gap-1 text-sm text-base-content/60 my-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button onClick={() => handleCancel(event._id)} className="btn btn-outline btn-error btn-sm">
                    <XCircle className="w-4 h-4 mr-1" /> Cancel
                  </button>
                  <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">View</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
