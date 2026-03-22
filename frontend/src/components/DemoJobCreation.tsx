'use client';

import { useState } from 'react';
import { demoMode, simulateTransaction } from '@/lib/demo';
import Button from './Button';
import Card from './Card';

interface DemoJobCreationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DemoJobCreation({ onSuccess, onCancel }: DemoJobCreationProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skills: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (!/^\d+(\.\d+)?\s*(ETH|USD)$/.test(formData.budget.toUpperCase())) {
      newErrors.budget = 'Budget format: e.g., 2.5 ETH or 5000 USD';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    if (!formData.skills.trim()) {
      newErrors.skills = 'At least one skill is required';
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
      // Simulate transaction
      await simulateTransaction('Creating job posting...', setProgress);

      // Create the job in demo mode
      await demoMode.createJob({
        title: formData.title,
        description: formData.description,
        budget: formData.budget.toUpperCase(),
        deadline: formData.deadline,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      });

      // Success - show completion
      setProgress(100);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      console.error('Demo job creation failed:', error);
      setErrors({ submit: 'Failed to create job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Job</h1>
                <p className="text-slate-400 text-sm">Demo Mode • No real transaction required</p>
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

          {/* Demo Info Banner */}
          <Card className="bg-amber-500/10 border-amber-500/30 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-amber-200">
                <span className="font-medium">Demo Mode:</span> This job will be created instantly with simulated credentials. 
                Perfect for testing the workflow!
              </div>
            </div>
          </Card>
        </div>

        {/* Form */}
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Build DeFi Dashboard"
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.title ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the project requirements, deliverables, and expectations..."
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.description ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            {/* Budget and Deadline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
                  Budget *
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="2.5 ETH or 5000 USD"
                  className={`w-full px-4 py-3 bg-slate-900/50 border ${
                    errors.budget ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                />
                {errors.budget && <p className="mt-1 text-sm text-red-400">{errors.budget}</p>}
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-slate-300 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-slate-900/50 border ${
                    errors.deadline ? 'border-red-500' : 'border-slate-600'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50`}                  />
                  {errors.deadline && <p className="mt-1 text-sm text-red-400">{errors.deadline}</p>}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-2">
                Required Skills *
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Solidity, TypeScript (comma-separated)"
                className={`w-full px-4 py-3 bg-slate-900/50 border ${
                  errors.skills ? 'border-red-500' : 'border-slate-600'
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
              />
              {errors.skills && <p className="mt-1 text-sm text-red-400">{errors.skills}</p>}
              <p className="mt-1 text-sm text-slate-400">Separate multiple skills with commas</p>
            </div>

            {/* Demo Balance Info */}
            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-slate-400">Your Demo Balance:</span>
                  <span className="text-green-400 font-semibold ml-2">
                    {demoMode.getBalance()} ETH
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Demo tokens reset when you exit demo mode
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Job... {progress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Job Posting
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
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Validating</span>
              <span>Simulating</span>
              <span>Confirming</span>
              <span>Complete</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

