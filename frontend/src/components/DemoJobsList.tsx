'use client';

import { useState, useEffect } from 'react';
import { demoMode, DemoJob } from '@/lib/demo';
import Card from './Card';
import Badge from './Badge';

interface DemoJobsListProps {
  onCreateJob: () => void;
  onViewJob: (job: DemoJob) => void;
}

export default function DemoJobsList({ onCreateJob, onViewJob }: DemoJobsListProps) {
  const [jobs, setJobs] = useState<DemoJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load demo jobs
    setJobs(demoMode.getJobs());
    setIsLoading(false);

    // Listen for demo mode changes
    const handleDemoChange = () => {
      setJobs(demoMode.getJobs());
    };

    window.addEventListener('demo-mode-change', handleDemoChange as EventListener);
    return () => window.removeEventListener('demo-mode-change', handleDemoChange as EventListener);
  }, []);

  const getStatusColor = (status: DemoJob['status']) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-slate-800/50 border-slate-700 p-6 animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-slate-700 rounded w-full mb-2" />
            <div className="h-4 bg-slate-700 rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Available Jobs</h2>
          <p className="text-slate-400 text-sm">Demo Mode • {jobs.length} jobs posted</p>
        </div>
        <button
          onClick={onCreateJob}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Post Job
        </button>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Jobs Yet</h3>
          <p className="text-slate-400 mb-4">Be the first to create a job posting in demo mode!</p>
          <button
            onClick={onCreateJob}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Create Your First Job →
          </button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <Card
              key={job.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={() => onViewJob(job)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {job.title}
                    </h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{job.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-green-400">{job.budget}</div>
                  <div className="text-xs text-slate-500">Budget</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{getTimeAgo(job.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Demo Info */}
      <Card className="bg-amber-500/10 border-amber-500/30 p-4 mt-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-amber-200">
            <span className="font-medium">Demo Mode:</span> These are simulated jobs for testing. 
            Click any job to view details and practice the workflow without real commitments.
          </div>
        </div>
      </Card>
    </div>
  );
}

