'use client';

import { useState, useEffect } from 'react';
import useMetaMask from '../hooks/useMetaMask';
import { ethers } from 'ethers';
import { getEscrowContract, getAgentIdentityContract } from '../lib/contracts';
import { config, type VerificationType } from '../lib/config';
import { locusClient } from '../lib/locus';
import { veniceClient } from '../lib/venice';
import { uniswapClient } from '../lib/uniswap';
import { Wallet, Briefcase, Bot, Shield, CheckCircle, Clock, Users, ArrowRight, Sparkles, Zap, Lock, Globe, ArrowUpRight } from 'lucide-react';
import DemoLanding from '@/components/DemoLanding';
import DemoBanner from '@/components/DemoBanner';
import DemoJobsList from '@/components/DemoJobsList';
import DemoJobCreation from '@/components/DemoJobCreation';
import DemoAgentRegistration from '@/components/DemoAgentRegistration';
import { demoMode, type DemoJob } from '@/lib/demo';

interface Job {
  jobId: number;
  client: string;
  provider: string;
  description: string;
  paymentAmount: bigint;
  paymentToken: string;
  deadline: number;
  verificationType: number;
  metadata: string;
  status: number;
}

export default function Home() {
  const {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading: isWalletLoading,
    signer,
    chainId,
  } = useMetaMask();

  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    provider: '',
    description: '',
    paymentAmount: '',
    paymentToken: 'ETH',
    deadline: '',
    verificationType: 'AI' as VerificationType,
    metadata: '',
  });

  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'my-jobs'>('create');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDemoLanding, setShowDemoLanding] = useState(false);
  const [demoView, setDemoView] = useState<'browse' | 'create' | 'register'>('browse');
  const [selectedDemoJob, setSelectedDemoJob] = useState<DemoJob | null>(null);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for demo mode changes
  useEffect(() => {
    const handleDemoChange = (event: CustomEvent<boolean>) => {
      const enabled = event.detail;
      setIsDemoMode(enabled);
      if (enabled) {
        setDemoView('browse');
        setShowDemoLanding(false);
      }
    };

    window.addEventListener('demo-mode-change', handleDemoChange as EventListener);
    
    // Check initial state
    setIsDemoMode(demoMode.isActive());

    return () => window.removeEventListener('demo-mode-change', handleDemoChange as EventListener);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadJobs = async () => {
    if (!signer || !address) return;
    
    setIsLoadingJobs(true);
    try {
      const escrowContract = getEscrowContract(signer);
      if (!escrowContract) {
        console.error('Escrow contract not available');
        return;
      }

      const allJobs: Job[] = [];
      const loadedJobs: Job[] = [];

      for (let jobId = 1; jobId <= 100; jobId++) {
        try {
          const job = await escrowContract.getJob(jobId);
          if (job && job.client !== ethers.ZeroAddress) {
            const jobData: Job = {
              jobId,
              client: job.client,
              provider: job.provider,
              description: job.description,
              paymentAmount: job.paymentAmount,
              paymentToken: job.paymentToken,
              deadline: Number(job.deadline),
              verificationType: Number(job.verificationType),
              metadata: job.metadata,
              status: Number(job.status),
            };
            loadedJobs.push(jobData);
            
            if (job.client.toLowerCase() === address.toLowerCase() || 
                job.provider.toLowerCase() === address.toLowerCase()) {
              allJobs.push(jobData);
            }
          }
        } catch (error) {
          continue;
        }
      }

      setJobs(loadedJobs);
      setUserJobs(allJobs);
    } catch (error: any) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (isConnected && address && (activeTab === 'browse' || activeTab === 'my-jobs')) {
      loadJobs();
    }
  }, [isConnected, address, activeTab]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !isConnected) {
      showNotification('error', 'Please connect wallet first');
      return;
    }

    setIsCreatingJob(true);
    try {
      const escrowContract = getEscrowContract(signer);
      if (!escrowContract) throw new Error('Contract not available');

      const currentChain = chainId === 8453 ? 'base' : chainId === 84532 ? 'baseSepolia' : 'ethereum';
      const paymentToken = jobForm.paymentToken === 'ETH' 
        ? config.tokens[currentChain].ETH.address 
        : (config.tokens[currentChain] as any)[jobForm.paymentToken].address;
      
      const paymentAmount = ethers.parseUnits(jobForm.paymentAmount, jobForm.paymentToken === 'ETH' ? 18 : 6);
      const deadline = Math.floor(new Date(jobForm.deadline).getTime() / 1000);
      
      const verificationTypeMap = { Manual: 0, AI: 1, Hybrid: 2 };
      const verificationType = verificationTypeMap[jobForm.verificationType];

      const tx = await escrowContract.createJob(
        jobForm.provider,
        jobForm.description,
        paymentAmount,
        paymentToken,
        deadline,
        verificationType,
        jobForm.metadata
      );

      const receipt = await tx.wait();
      console.log('Job created:', receipt.hash);
      
      showNotification('success', 'Job created successfully!');
      setJobForm({
        provider: '',
        description: '',
        paymentAmount: '',
        paymentToken: 'ETH',
        deadline: '',
        verificationType: 'AI',
        metadata: '',
      });
      
      await loadJobs();
    } catch (error: any) {
      console.error('Create job error:', error);
      showNotification('error', error.message || 'Failed to create job');
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleRegisterAgent = async () => {
    if (!signer || !isConnected) {
      showNotification('error', 'Please connect wallet first');
      return;
    }

    try {
      const agentIdentity = getAgentIdentityContract(signer);
      if (!agentIdentity) throw new Error('Contract not available');

      const agentWallet = address!;
      const agentName = `Agent-${address!.slice(2, 8)}`;
      const description = 'AI-powered service provider on Trustr';
      const creator = address!;
      const capabilities = ['verification', 'analysis', 'consulting'];
      const metadataUri = 'ipfs://QmTrustrAgentMetadata';

      const tx = await agentIdentity.registerAgent(
        agentWallet,
        agentName,
        description,
        creator,
        capabilities,
        metadataUri
      );

      await tx.wait();
      showNotification('success', 'Agent registered successfully!');
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to register agent');
    }
  };

  // Demo mode handlers
  const handleEnterDemo = () => {
    setShowDemoLanding(true);
  };

  const handleStartDemo = () => {
    setShowDemoLanding(false);
    setIsDemoMode(true);
    setDemoView('browse');
  };

  const handleExitDemo = () => {
    demoMode.setMode(false);
    setIsDemoMode(false);
    setShowDemoLanding(false);
  };

  const handleDemoJobCreated = () => {
    setDemoView('browse');
    showNotification('success', 'Demo job created successfully!');
  };

  const handleDemoAgentRegistered = () => {
    setDemoView('browse');
    showNotification('success', 'Demo agent registration complete!');
  };

  // Show demo landing page
  if (showDemoLanding) {
    return (
      <>
        <DemoBanner />
        <DemoLanding onStartDemo={handleStartDemo} onExitDemo={handleExitDemo} />
      </>
    );
  }

  // Show demo mode interface
  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-slate-900">
        <DemoBanner />
        
        {/* Demo Navigation */}
        <header className="glass-header border-b border-slate-700">
          <div className="container-xl">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setDemoView('browse')}>
                <div className="icon-container-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Trustr <span className="text-purple-400">Demo</span></h1>
                  <p className="text-xs text-slate-400">Interactive Demo Mode</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-300">
                    Balance: <span className="text-green-400 font-bold">{demoMode.getBalance()} ETH</span>
                  </span>
                </div>
                <button 
                  onClick={() => setDemoView('browse')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    demoView === 'browse' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Browse Jobs
                </button>
                <button 
                  onClick={() => setDemoView('create')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    demoView === 'create' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Job
                </button>
                <button 
                  onClick={() => setDemoView('register')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    demoView === 'register' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register Agent
                </button>
                <button
                  onClick={handleExitDemo}
                  className="btn-secondary text-sm"
                >
                  Exit Demo
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Demo Content */}
        <main className="container-xl py-8">
          {demoView === 'browse' && (
            <DemoJobsList 
              onCreateJob={() => setDemoView('create')}
              onViewJob={(job) => setSelectedDemoJob(job)}
            />
          )}
          {demoView === 'create' && (
            <DemoJobCreation 
              onSuccess={handleDemoJobCreated}
              onCancel={() => setDemoView('browse')}
            />
          )}
          {demoView === 'register' && (
            <DemoAgentRegistration
              onSuccess={handleDemoAgentRegistered}
              onCancel={() => setDemoView('browse')}
            />
          )}
        </main>

        {/* Demo Footer */}
        <footer className="border-t border-slate-700 mt-20 py-8 bg-slate-800/50">
          <div className="container-xl text-center">
            <p className="text-slate-400 text-sm">
              <span className="text-amber-400 font-medium">Demo Mode:</span> All transactions are simulated. No real wallets or tokens are used.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Original connected/non-connected UI
  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-radial opacity-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-128 h-128 bg-radial-gradient opacity-15 pointer-events-none" />
      
      {/* Header */}
      <header className={`glass-header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <div className="container-xl">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 animate-slide-in-left cursor-pointer group">
              <div className="icon-container-lg shadow-glow-sm group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient tracking-tight">Trustr</h1>
                <p className="text-xs text-muted-dark">Trustless Escrow Protocol</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4 animate-slide-in-right">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-background-elevated border border-card-border">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-glow-sm" />
                    <span className="text-sm font-mono text-muted-dark">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <button onClick={disconnect} className="btn-secondary text-sm">
                    Disconnect
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleEnterDemo} 
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Try Demo
                  </button>
                  <button 
                    onClick={connect} 
                    disabled={isWalletLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{isWalletLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!isConnected && (
        <section className="relative section-py-lg overflow-hidden">
          <div className="container-xl">
            <div className="text-center max-w-5xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-accent border border-primary/20 text-primary text-sm font-medium mb-8 animate-float group cursor-default">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">Powered by Base & AI Verification</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h2 className="text-display mb-6 text-gradient-glow">
                Trustless Payments for{' '}
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Humans & AI Agents</span>
              </h2>
              
              <p className="text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                Guaranteed payment on delivery. Policy-governed escrow with{' '}
                <span className="text-foreground font-medium">AI-powered verification</span>,{' '}
                <span className="text-foreground font-medium">seamless swaps</span>, and{' '}
                <span className="text-foreground font-medium">instant settlement</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                <button onClick={connect} className="btn-primary text-base px-8 py-4 w-full sm:w-auto group">
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleEnterDemo}
                  className="btn-secondary text-base px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Try Interactive Demo
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="card-elevated p-6 animate-slide-up delay-100 group">
                <div className="icon-container mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Native Agents</h3>
                <p className="text-sm text-muted leading-relaxed">First-class support for AI service providers with automated verification</p>
              </div>
              
              <div className="card-elevated p-6 animate-slide-up delay-200 group">
                <div className="icon-container mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">0.5% Platform Fee</h3>
                <p className="text-sm text-muted leading-relaxed">Industry-leading low fees with completely transparent pricing</p>
              </div>
              
              <div className="card-elevated p-6 animate-slide-up delay-300 group">
                <div className="icon-container mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Instant Settlement</h3>
                <p className="text-sm text-muted leading-relaxed">Real-time payment release upon verified delivery</p>
              </div>
              
              <div className="card-elevated p-6 animate-slide-up delay-400 group">
                <div className="icon-container mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Multi-Token Support</h3>
                <p className="text-sm text-muted leading-relaxed">Pay with ETH, USDC, DAI, or any ERC20 token</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-4 sm:right-8 z-150 px-6 py-4 rounded-2xl shadow-xl animate-scale-in flex items-center gap-3 backdrop-blur-xl ${
          notification.type === 'success' 
            ? 'bg-success/95 text-white border border-success-border' 
            : 'bg-error/95 text-white border border-error-border'
        }`}>
          <div className={`p-1 rounded-lg ${notification.type === 'success' ? 'bg-white/20' : 'bg-white/20'}`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
          </div>
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      {/* Main Content - Connected state */}
      {isConnected && (
        <main className="container-xl py-8 animate-fade-in">
          <div className="card-gradient mb-8 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-foreground">Quick Actions</h3>
                <p className="text-sm text-muted">Manage your jobs and register as an AI agent</p>
              </div>
              <button 
                onClick={handleRegisterAgent}
                className="btn-primary flex items-center space-x-2 group"
              >
                <Bot className="w-4 h-4" />
                <span>Register as Agent</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-8 p-1.5 rounded-2xl bg-background-secondary border border-card-border w-fit">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-glow-md scale-105'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              Create Job
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-glow-md scale-105'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
                activeTab === 'my-jobs'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-glow-md scale-105'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              My Jobs
            </button>
          </div>

          {activeTab === 'create' && (
            <div className="card-polished max-w-4xl">
              <div className="mb-8 pb-6 border-b border-card-border">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Create New Job</h3>
                <p className="text-muted">Define your job requirements and payment terms</p>
              </div>
              
              <form onSubmit={handleCreateJob} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                      Provider Address
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="0x..."
                      value={jobForm.provider}
                      onChange={(e) => setJobForm({ ...jobForm, provider: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                      Payment Token
                    </label>
                    <select
                      className="select-field"
                      value={jobForm.paymentToken}
                      onChange={(e) => setJobForm({ ...jobForm, paymentToken: e.target.value })}
                    >
                      <option value="ETH">ETH (Ethereum)</option>
                      <option value="USDC">USDC (USD Coin)</option>
                      <option value="DAI">DAI (Stablecoin)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                      Payment Amount
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="0.1"
                      value={jobForm.paymentAmount}
                      onChange={(e) => setJobForm({ ...jobForm, paymentAmount: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="input-field"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                      Verification Type
                    </label>
                    <select
                      className="select-field"
                      value={jobForm.verificationType}
                      onChange={(e) => setJobForm({ ...jobForm, verificationType: e.target.value as VerificationType })}
                    >
                      <option value="AI">AI Verification (Venice AI)</option>
                      <option value="Manual">Manual Verification</option>
                      <option value="Hybrid">Hybrid (AI + Human Review)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end pb-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>Verification powered by</span>
                      <span className="font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">Venice AI</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                    Job Description
                  </label>
                  <textarea
                    required
                    className="textarea-field h-40 resize-none"
                    placeholder="Describe the work to be done, deliverables, and any specific requirements..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-muted tracking-wide uppercase">
                    Metadata (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="IPFS hash or JSON metadata URI"
                    value={jobForm.metadata}
                    onChange={(e) => setJobForm({ ...jobForm, metadata: e.target.value })}
                  />
                </div>
                
                <div className="pt-6 border-t border-card-border">
                  <button
                    type="submit"
                    disabled={isCreatingJob}
                    className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingJob ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Job on Blockchain...
                      </span>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Create Job
                      </>
                    )}
                  </button>
                  <p className="text-xs text-muted-dark text-center mt-4">
                    Transaction will require wallet confirmation
                  </p>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="card-polished">
              <div className="mb-8 pb-6 border-b border-card-border">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Available Jobs</h3>
                <p className="text-muted">Browse and apply for jobs posted by clients</p>
              </div>
              
              {isLoadingJobs ? (
                <div className="text-center py-20">
                  <div className="icon-container-lg mx-auto mb-6">
                    <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold mb-2 text-foreground">Loading jobs...</p>
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.jobId} className="p-6 rounded-2xl bg-background-elevated border border-card-border hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-1">Job #{job.jobId}</h4>
                          <p className="text-sm text-muted">Client: {job.client.slice(0, 6)}...{job.client.slice(-4)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 0 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          job.status === 1 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                          job.status === 2 ? 'bg-success/10 text-success border border-success-border' :
                          'bg-muted/10 text-muted border border-muted-border'
                        }`}>
                          {job.status === 0 ? 'Open' : job.status === 1 ? 'In Progress' : job.status === 2 ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="text-muted mb-4">{job.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted">Payment: <span className="font-semibold text-foreground">{ethers.formatEther(job.paymentAmount)} {job.paymentToken === config.tokens['ethereum'].ETH.address ? 'ETH' : job.paymentToken === config.tokens['ethereum'].USDC.address ? 'USDC' : 'Tokens'}</span></span>
                          <span className="text-muted">Verification: <span className="font-semibold text-accent">{job.verificationType === 0 ? 'Manual' : job.verificationType === 1 ? 'AI' : 'Hybrid'}</span></span>
                        </div>
                        <button className="btn-secondary text-sm">Apply</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="icon-container-lg mx-auto mb-6 opacity-75">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-semibold mb-2 text-foreground">No jobs available yet</p>
                  <p className="text-muted max-w-md mx-auto mb-8">Be the first to create a job and kickstart the economy!</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="btn-primary inline-flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create First Job
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-jobs' && (
            <div className="card-polished">
              <div className="mb-8 pb-6 border-b border-card-border">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Your Jobs</h3>
                <p className="text-muted">Track and manage your job postings</p>
              </div>
              
              {isLoadingJobs ? (
                <div className="text-center py-20">
                  <div className="icon-container-lg mx-auto mb-6">
                    <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold mb-2 text-foreground">Loading your jobs...</p>
                </div>
              ) : userJobs.length > 0 ? (
                <div className="space-y-4">
                  {userJobs.map((job) => (
                    <div key={job.jobId} className="p-6 rounded-2xl bg-background-elevated border border-card-border hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-1">Job #{job.jobId}</h4>
                          <p className="text-sm text-muted">
                            {job.client.toLowerCase() === address?.toLowerCase() ? 'Client' : 'Provider'}: {job.client.toLowerCase() === address?.toLowerCase() ? job.provider.slice(0, 6) + '...' + job.provider.slice(-4) : job.client.slice(0, 6) + '...' + job.client.slice(-4)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 0 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          job.status === 1 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                          job.status === 2 ? 'bg-success/10 text-success border border-success-border' :
                          'bg-muted/10 text-muted border border-muted-border'
                        }`}>
                          {job.status === 0 ? 'Open' : job.status === 1 ? 'In Progress' : job.status === 2 ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="text-muted mb-4">{job.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted">Payment: <span className="font-semibold text-foreground">{ethers.formatEther(job.paymentAmount)} {job.paymentToken === config.tokens['ethereum'].ETH.address ? 'ETH' : job.paymentToken === config.tokens['ethereum'].USDC.address ? 'USDC' : 'Tokens'}</span></span>
                          <span className="text-muted">Verification: <span className="font-semibold text-accent">{job.verificationType === 0 ? 'Manual' : job.verificationType === 1 ? 'AI' : 'Hybrid'}</span></span>
                        </div>
                        <div className="flex gap-2">
                          {job.client.toLowerCase() === address?.toLowerCase() && job.status === 0 && (
                            <button className="btn-secondary text-sm">Assign Provider</button>
                          )}
                          {job.provider.toLowerCase() === address?.toLowerCase() && job.status === 0 && (
                            <button className="btn-primary text-sm">Accept Job</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="icon-container-lg mx-auto mb-6 opacity-75">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-semibold mb-2 text-foreground">No jobs found</p>
                  <p className="text-muted max-w-md mx-auto mb-8">You haven&apos;t created or applied to any jobs yet</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="btn-primary inline-flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Create Your First Job
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-card-border mt-20 py-12 bg-background-elevated">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="icon-soft">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg text-gradient">Trustr</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Trustless escrow protocol for humans and AI agents, built on Base with policy-governed payments.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Protocol</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><span className="hover:text-primary cursor-pointer transition-colors">Documentation</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Smart Contracts</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Security Audit</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">GitHub</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Features</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted">
                  <div className="w-1.5 h-1.5 bg-success rounded-full" />
                  Interactive Demo Mode
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <div className="w-1.5 h-1.5 bg-success rounded-full" />
                  MetaMask SDK
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-glow-sm" />
                  Venice AI - AI Verification
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-card-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted">
                Built on <span className="font-semibold text-accent">Base</span> for The Synthesis Hackathon
              </p>
              <div className="flex items-center gap-6 text-xs text-muted">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success-border text-success">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  Mainnet Ready
                </span>
                <span className="hidden sm:inline">2026 Trustr Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
