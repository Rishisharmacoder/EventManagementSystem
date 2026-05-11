import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, Upload, Loader2, X } from 'lucide-react';
import { setEvents, setLoading } from '../store/slices/eventSlice.js';
import api from '../services/api.js';

export default function AdminDashboard() {
  const { events, loading } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await api.get('/events/my-events');
        dispatch(setEvents(data));
      } catch (err) {
        console.error("Failed to load admin events", err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchEvents();
  }, [dispatch]);

  // Cloudinary Upload Logic
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (optional, e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB allowed.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Event_image'); 

    setUploading(true);
    try {
      // REPLACE 'your_cloud_name_here' with your actual Cloudinary Cloud Name
      const response = await fetch('https://api.cloudinary.com/v1_1/dqhngndao/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentEvent((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        alert(`Cloudinary Error: ${data.error.message}`);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed to upload image. Check your internet connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/delete/${id}`);
        const updatedEvents = events.filter(e => e._id !== id);
        dispatch(setEvents(updatedEvents));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentEvent({ title: '', description: '', date: '', location: '', capacity: 0, image: '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-base-content/60">Manage your college events</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus className="w-5 h-5 mr-2" /> Create Event
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bfgi-card p-8 group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Total Events</div>
              <div className="text-4xl font-black text-slate-900 tracking-tight mt-1">{events.length}</div>
            </div>
          </div>
        </div>
        <div className="bfgi-card p-8 group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-secondary/5 rounded-2xl text-secondary group-hover:scale-110 transition-transform duration-500">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Registrations</div>
              <div className="text-4xl font-black text-slate-900 tracking-tight mt-1">465</div>
            </div>
          </div>
        </div>
        <div className="bfgi-card p-8 group">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-accent/5 rounded-2xl text-accent group-hover:scale-110 transition-transform duration-500">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Capacity Used</div>
              <div className="text-4xl font-black text-slate-900 tracking-tight mt-1">72%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bfgi-card overflow-hidden border-none shadow-2xl">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Event Management</h3>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm text-slate-400">Export CSV</button>
            <button className="btn btn-ghost btn-sm text-slate-400">Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-slate-400 font-black uppercase tracking-widest text-[10px] py-6 px-8">Event Details</th>
                <th className="text-slate-400 font-black uppercase tracking-widest text-[10px] py-6 px-8">Date & Location</th>
                <th className="text-slate-400 font-black uppercase tracking-widest text-[10px] py-6 px-8">Capacity</th>
                <th className="text-slate-400 font-black uppercase tracking-widest text-[10px] py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <img 
                        src={event.image || 'https://picsum.photos/seed/tech/800/400'} 
                        className="w-12 h-12 rounded-xl object-cover shadow-md" 
                        alt="" 
                        referrerPolicy="no-referrer" 
                      />
                      <div>
                        <div className="font-black text-slate-900 tracking-tight">{event.title}</div>
                        <div className="text-xs text-slate-400 font-bold mt-0.5 line-clamp-1 max-w-xs">{event.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="text-sm font-bold text-slate-600">
                      {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{event.location}</div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <progress className="progress progress-primary w-20 h-2" value={event.registeredCount || 0} max={event.capacity || 100}></progress>
                      <span className="text-xs font-black text-slate-600">{event.registeredCount || 0}/{event.capacity || 100}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(event)} className="btn btn-ghost btn-sm text-primary hover:bg-primary/5">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="btn btn-ghost btn-sm text-error hover:bg-error/5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-xl mb-4">{currentEvent?._id ? 'Edit Event' : 'Create New Event'}</h3>
            <div className="space-y-4">
              
              {/* Image Upload Area */}
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Event Banner</span></label>
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl">
                  {currentEvent?.image ? (
                    <div className="relative w-24 h-24">
                      <img src={currentEvent.image} className="w-full h-full object-cover rounded-lg shadow-md" alt="Preview" />
                      <button 
                        className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1"
                        onClick={() => setCurrentEvent({...currentEvent, image: ''})}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <label className={`btn btn-sm ${uploading ? 'btn-disabled' : 'btn-outline'}`}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                      {uploading ? 'Uploading...' : 'Choose Image'}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    <p className="text-[10px] text-slate-400 mt-2">Recommended: 1200x600px. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Title</span></label>
                <input type="text" className="input input-bordered" value={currentEvent?.title || ''} onChange={e => setCurrentEvent({...currentEvent, title: e.target.value})} />
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Description</span></label>
                <textarea className="textarea textarea-bordered h-24" value={currentEvent?.description || ''} onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Date</span></label>
                  <input 
                    type="date" 
                    className="input input-bordered" 
                    value={currentEvent?.date ? new Date(currentEvent.date).toISOString().split('T')[0] : ''} 
                    onChange={e => setCurrentEvent({...currentEvent, date: e.target.value})} 
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Capacity</span></label>
                  <input type="number" className="input input-bordered" value={currentEvent?.capacity || 0} onChange={e => setCurrentEvent({...currentEvent, capacity: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Location</span></label>
                <input type="text" className="input input-bordered" value={currentEvent?.location || ''} onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})} />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</button>
              <button className="btn btn-primary" disabled={uploading} onClick={async () => {
                if (!currentEvent.title || !currentEvent.date) {
                    alert("Title and Date are required");
                    return;
                }
                try {
                  if (currentEvent._id) {
                    const { data } = await api.put(`/events/update/${currentEvent._id}`, currentEvent);
                    dispatch(setEvents(events.map(e => e._id === data._id ? data : e)));
                  } else {
                    const { data } = await api.post('/events/create', currentEvent);
                    dispatch(setEvents([...events, data.event]));
                  }
                  setShowModal(false);
                } catch(err) {
                  console.error(err);
                  alert("Failed to save event");
                }
              }}>
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}