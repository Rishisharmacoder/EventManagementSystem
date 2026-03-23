import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../services/api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/user/login', { emailId: email, password });
      
      if (data.user.role === 'admin') {
        dispatch(setCredentials(data.user));
        navigate('/admin');
      } else {
        await api.post('/user/logout');
        setError('Access Denied. You are not authorized for the Admin Portal.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md bg-base-100 shadow-2xl border-t-4 border-secondary"
      >
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="w-12 h-12 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-secondary">Admin Portal</h2>
            <p className="text-base-content/60">Secure access for event managers</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 py-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Admin Email</span>
              </label>
              <input 
                type="email" 
                placeholder="admin@bfcet.com" 
                className="input input-bordered w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="input input-bordered w-full pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn btn-secondary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {!loading && <LogIn className="w-5 h-5 mr-2" />}
              Admin Login
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="link link-hover text-sm">Back to Student Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
