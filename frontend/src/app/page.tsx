'use client';

import { useState } from 'react';
import useMetaMask from '../hooks/useMetaMask';
import { ethers } from 'ethers';
import { getEscrowContract, getAgentIdentityContract } from '../lib/contracts';
import { config, type VerificationType } from '../lib/config';
import { locusClient } from '../lib/locus';
import { veniceClient } from '../lib/venice';
import { uniswapClient } from '../lib/uniswap';
import { Wallet, Briefcase, Bot, Shield, CheckCircle, Clock, Users, ArrowRight, Sparkles, Zap, Lock, Globe } from 'lucide-react';

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

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

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

      const paymentToken = jobForm.paymentToken === 'ETH' 
        ? config.tokens.ETH.address 
        : config.tokens[jobForm.paymentToken as keyof typeof config.tokens].address;
      
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

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-radial opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="glass-header">
        <div className="container-xl">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="icon-container-lg shadow-glow-sm">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Trustr</h1>
                <p className="text-xs text-text-muted">Trustless Escrow Protocol</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 animate-slide-in-right">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-background-secondary border border-card-border">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-text-secondary">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <button onClick={disconnect} className="btn-secondary text-sm">
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connect} 
                  disabled={isWalletLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isWalletLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!isConnected && (
        <section className="relative section-py overflow-hidden">
          <div className="container-xl">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-float">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Base & AI Verification</span>
              </div>
              
              <h2 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                Trustless Payments for{' '}
                <span className="text-gradient-glow">Humans & AI Agents</span>
              </h2>
              
              <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                Guaranteed payment on delivery. Policy-governed escrow with AI-powered verification, 
                seamless swaps, and instant settlement.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <button onClick={connect} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="icon-container mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Native Agents</h3>
                <p className="text-sm text-text-muted">First-class support for AI service providers with automated verification</p>
              </div>
              
              <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="icon-container mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">0.5% Platform Fee</h3>
                <p className="text-sm text-text-muted">Industry-leading low fees with transparent pricing</p>
              </div>
              
              <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="icon-container mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Settlement</h3>
                <p className="text-sm text-text-muted">Real-time payment release upon verified delivery</p>
              </div>
              
              <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="icon-container mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Token Support</h3>
                <p className="text-sm text-text-muted">Pay with ETH, USDC, DAI, or any ERC20 token</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-4 sm:right-8 z-50 px-6 py-4 rounded-xl shadow-soft-lg animate-fade-in flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-success text-white' 
            : 'bg-error text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Shield className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      {isConnected && (
        <main className="container-xl py-8 animate-fade-in">
          {/* Quick Actions */}
          <div className="card-gradient mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
                <p className="text-sm text-text-muted">Manage your jobs and register as an AI agent</p>
              </div>
              <button 
                onClick={handleRegisterAgent}
                className="btn-primary flex items-center space-x-2"
              >
                <Bot className="w-4 h-4" />
                <span>Register as Agent</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2 mb-6 p-1 rounded-xl bg-background-secondary border border-card-border w-fit">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-glow-sm'
                  : 'text-text-secondary hover:text-foreground hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              Create Job
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'browse'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-glow-sm'
                  : 'text-text-secondary hover:text-foreground hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'my-jobs'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-glow-sm'
                  : 'text-text-secondary hover:text-foreground hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              My Jobs
            </button>
          </div>

          {/* Create Job Form */}
          {activeTab === 'create' && (
            <div className="card max-w-4xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Create New Job</h3>
                <p className="text-text-muted">Define your job requirements and payment terms</p>
              </div>
              
              <form onSubmit={handleCreateJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  
                  <div className="flex items-end">
                    <div className="text-xs text-text-muted">
                      <p>Verification powered by</p>
                      <p className="font-semibold text-foreground">Venice AI</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Job Description
                  </label>
                  <textarea
                    required
                    className="textarea-field h-32"
                    placeholder="Describe the work to be done, deliverables, and any specific requirements..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
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
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isCreatingJob}
                    className="btn-primary w-full py-4 text-lg"
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
                      'Create Job'
                    )}
                  </button>
                  <p className="text-xs text-text-muted text-center mt-3">
                    Transaction will require wallet confirmation
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Browse Jobs */}
          {activeTab === 'browse' && (
            <div className="card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Available Jobs</h3>
                <p className="text-text-muted">Browse and apply for jobs posted by clients</p>
              </div>
              <div className="text-center py-16">
                <div className="icon-container-lg mx-auto mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium mb-2">No jobs available yet</p>
                <p className="text-text-muted">Be the first to create a job and kickstart the economy!</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="btn-primary mt-6"
                >
                  Create First Job
                </button>
              </div>
            </div>
          )}

          {/* My Jobs */}
          {activeTab === 'my-jobs' && (
            <div className="card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Jobs</h3>
                <p className="text-text-muted">Track and manage your job postings</p>
              </div>
              <div className="text-center py-16">
                <div className="icon-container-lg mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium mb-2">No jobs found</p>
                <p className="text-text-muted">You haven't created or applied to any jobs yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="btn-primary mt-6"
                >
                  Create Your First Job
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-card-border mt-20 py-12 bg-background-secondary">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg text-gradient">Trustr</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                Trustless escrow protocol for humans and AI agents, built on Base with policy-governed payments.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><span className="hover:text-foreground cursor-pointer transition-colors">Documentation</span></li>
                <li><span className="hover:text-foreground cursor-pointer transition-colors">Smart Contracts</span></li>
                <li><span className="hover:text-foreground cursor-pointer transition-colors">Security Audit</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Integrations</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>MetaMask SDK</li>
                <li>Locus - Data Verification</li>
                <li>Uniswap - Token Swaps</li>
                <li>Venice AI - AI Verification</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-card-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-muted">
                Built on <span className="font-semibold text-foreground">Base</span> with ❤️
              </p>
              <div className="flex items-center gap-6 text-xs text-text-muted">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  Mainnet Ready
                </span>
                <span>© 2026 Trustr Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
