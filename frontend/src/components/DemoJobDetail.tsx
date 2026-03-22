'use client';

import { useState } from 'react';
import { demoMode, simulateTransaction, DemoJob } from '@/lib/demo';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

interface DemoJobDetailProps {
  job: DemoJob;
  onBack: () => void;
}

export default function DemoJobDetail({ job, onBack }: DemoJobDetailProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [proposalText, setProposalText] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = async () => {
    if (!proposalText.trim()) return;

    setIsApplying(true);
    setProgress(0);

    await simulateTransaction('Submitting proposal...', setProgress);
    await demoMode.submitProposal(job.id, 'demo-agent-current');

    setHasApplied(true);
    setIsApplying(false);
    setProgress(100);
  };

  const handleCompleteJob = async () => {
    setIsCompleting(true);
    setProgress(0);

    await simulateTransaction('Completing job...', setProgress);
    await demoMode.completeJob(job.id);

    setIsCompleting(false);
    setProgress(100);
  };

  const getStatusColor = (status: DemoJob['status']) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </button>

      {/* Job Header */}
      <Card className="bg-slate-800/50 border-slate-700 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{job.title}</h1>
              <Badge className={getStatusColor(job.status)}>
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Posted by {job.employer}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400 mb-1">{job.budget}</div>
            <div className="text-slate-400 text-sm">Budget</div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-slate-300 leading-relaxed">{job.description}</p>
        </div>

        {/* Job Details Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Deadline</span>
            </div>
            <div className="text-white font-semibold">{new Date(job.deadline).toLocaleDateString()}</div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm">Required Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Payment Type</span>
            </div>
            <div className="text-white font-semibold">Escrow Protected</div>
          </div>
        </div>

        {/* Demo Info */}
        <Card className="bg-amber-500/10 border-amber-500/30 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-amber-200">
              <span className="font-medium">Demo Mode:</span> This is a simulated job. You can practice applying and 
              completing the workflow without any real commitments or payments.
            </div>
          </div>
        </Card>
      </Card>

      {/* Action Section */}
      {job.status === 'open' && !hasApplied ? (
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Submit Your Proposal</h3>
          <textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            placeholder="Explain why you're the perfect fit for this job. Include your approach, timeline, and any relevant experience..."
            rows={6}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none mb-4"
          />
          <Button
            onClick={handleApply}
            disabled={!proposalText.trim() || isApplying}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4"
          >
            {isApplying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting Proposal... {progress}%</span>
              </div>
            ) : (
              'Submit Proposal'
            )}
          </Button>
          {isApplying && (
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      ) : hasApplied ? (
        <Card className="bg-green-500/10 border-green-500/30 p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Proposal Submitted!</h3>
          <p className="text-slate-400 mb-6">
            Your proposal has been submitted. In demo mode, you can simulate completing the job.
          </p>
          <Button
            onClick={handleCompleteJob}
            disabled={isCompleting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4"
          >
            {isCompleting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Completing Job... {progress}%</span>
              </div>
            ) : (
              'Simulate Job Completion'
            )}
          </Button>
          {isCompleting && (
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      ) : job.status === 'completed' ? (
        <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Job Completed</h3>
          <p className="text-slate-400">This job has been completed and payment has been released.</p>
        </Card>
      ) : null}
    </div>
  );
}

