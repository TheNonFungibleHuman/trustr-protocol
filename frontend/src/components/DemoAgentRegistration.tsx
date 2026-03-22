'use client';

import { useState } from 'react';
import { demoMode, simulateTransaction } from '@/lib/demo';
import Button from './Button';
import Card from './Card';

interface DemoAgentRegistrationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DemoAgentRegistration({ onSuccess, onCancel }: DemoAgentRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    hourlyRate: '',
    isAvailable: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 30) {
      newErrors.bio = 'Bio must be at least 30 characters';
    }
    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = 'Hourly rate is required';
    } else if (!/^\d+(\.\d+)?\s*(ETH|USD)$/.test(formData.hourlyRate.toUpperCase())) {
      newErrors.hourlyRate = 'Rate format: e.g., 0.1 ETH/hour or 50 USD/hour';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setProgress(0);

    try {
      await simulateTransaction('Registering as agent...', setProgress);

      await demoMode.registerAgent({
        name: formData.name,
        specialty: formData.specialty,
        isAvailable: formData.isAvailable
      });

      setProgress(100);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      console.error('Demo agent registration failed:', error);
      setErrors({ submit: 'Failed to register. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Register as Agent</h1>
                <p className="text-slate-400 text-sm">Demo Mode • Instant registration</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Card className="bg-amber-500/10 border-amber-500/30 p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-amber-200">
                <span className="font-medium">Demo Mode:</span> Your agent profile will be created instantly. 
                Start browsing and applying to jobs right away!
              </div>
            </div>
          </Card>
        </div>

        {/* Form */}
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., CodeMaster_Pro, SecurityFirst"
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.name ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              <p className="mt-1 text-sm text-slate-400">Choose a professional name that will be visible to employers</p>
            </div>

            {/* Specialty */}
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-slate-300 mb-2">
                Primary Specialty *
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="e.g., Smart Contract Development, UI/UX Design, Security Auditing"
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.specialty ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50`}
              />
              {errors.specialty && <p className="mt-1 text-sm text-red-400">{errors.specialty}</p>}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                Professional Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your experience, skills, and what makes you the perfect candidate..."
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.bio ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none`}
              />
              {errors.bio && <p className="mt-1 text-sm text-red-400">{errors.bio}</p>}
              <p className="mt-1 text-sm text-slate-400">Minimum 30 characters. Highlight your expertise and past achievements.</p>
            </div>

            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-300 mb-2">
                Hourly Rate *
              </label>
              <input
                type="text"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="0.1 ETH/hour or 50 USD/hour"
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.hourlyRate ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50`}
              />
              {errors.hourlyRate && <p className="mt-1 text-sm text-red-400">{errors.hourlyRate}</p>}
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-600">
              <div>
                <h4 className="text-sm font-medium text-white">Available for Work</h4>
                <p className="text-xs text-slate-400">Make your profile visible to employers</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isAvailable ? 'bg-green-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Expected Stats */}
            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Your Agent Profile Will Include:</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">5.0</div>
                  <div className="text-xs text-slate-400">Starting Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-xs text-slate-400">Jobs Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">Demo</div>
                  <div className="text-xs text-slate-400">Account Type</div>
                </div>
              </div>
            </Card>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onCancel}
                variant="secondary"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering... {progress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete Registration
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Progress Bar */}
        {isSubmitting && (
          <div className="mt-6">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

