import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../services/api.js';

export default function Login() {
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
      dispatch(setCredentials(data.user));
      
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bfgi-card w-full max-w-md p-10 md:p-12"
      >
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="bg-primary/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Access the BFGI Student Event Portal</p>
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
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {!loading && <LogIn className="w-5 h-5 mr-2" />}
              Login
            </button>
          </form>

          <div className="divider">OR</div>

          <div className="text-center space-y-2">
            <p className="text-sm">Don't have an account? <Link to="/signup" className="link link-primary font-semibold">Sign Up</Link></p>
            <p className="text-xs text-base-content/40 italic">Admin? <Link to="/admin-login" className="link link-secondary">Login here</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
