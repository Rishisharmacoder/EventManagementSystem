import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import api from '../services/api.js';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');

    try {
      // Split full name to pass to backend
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';
      
      const { data } = await api.post('/user/register', {
        firstName, lastName, emailId: email, password
      });
      
      dispatch(setCredentials(data.user));
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bfgi-card w-full max-w-md p-10 md:p-12"
      >
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="bg-primary/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Join BFGI</h2>
            <p className="text-slate-500 font-medium">Create your student account</p>
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
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="input input-bordered w-full pl-10" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                <input 
                  type="email" 
                  placeholder="email@bfcet.com" 
                  className="input input-bordered w-full pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
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

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="input input-bordered w-full pl-10" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {!loading && <UserPlus className="w-5 h-5 mr-2" />}
              Sign Up
            </button>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm">Already have an account? <Link to="/login" className="link link-primary font-semibold">Login</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
