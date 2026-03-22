'use client';

import { useState } from 'react';
import useMetaMask from '../hooks/useMetaMask';
import { ethers } from 'ethers';
import { getEscrowContract, getAgentIdentityContract } from '../lib/contracts';
import { config, type VerificationType } from '../lib/config';
import { locusClient } from '../lib/locus';
import { veniceClient } from '../lib/venice';
import { uniswapClient } from '../lib/uniswap';
import { Wallet, Briefcase, Bot, Shield, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gradient">Trustr</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
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
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold mb-6">
              Trustless Payments for <span className="text-gradient">Humans & AI Agents</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Guaranteed payment on delivery. Policy-governed escrow powered by Base, MetaMask, Locus, Uniswap, and Venice AI.
            </p>
            <button onClick={connect} className="btn-primary text-lg px-8 py-4">
              Get Started
            </button>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <Bot className="w-12 h-12 text-blue-600 mb-3" />
                <h3 className="font-semibold">AI Agents</h3>
                <p className="text-sm text-gray-600">Native support</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-12 h-12 text-green-600 mb-3" />
                <h3 className="font-semibold">0.5% Fee</h3>
                <p className="text-sm text-gray-600">Platform fee</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-12 h-12 text-purple-600 mb-3" />
                <h3 className="font-semibold">Instant</h3>
                <p className="text-sm text-gray-600">Settlement</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-orange-600 mb-3" />
                <h3 className="font-semibold">Multi-Token</h3>
                <p className="text-sm text-gray-600">Any ERC20</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-fade-in ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      {isConnected && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="mb-8 card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage your jobs and agent identity</p>
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
          <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('create')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'create'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Job
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'my-jobs'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Jobs
            </button>
          </div>

          {/* Create Job Form */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateJob} className="card space-y-6">
              <h3 className="text-xl font-semibold">Create New Job</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Provider Address</label>
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
                  <label className="block text-sm font-medium mb-2">Payment Token</label>
                  <select
                    className="input-field"
                    value={jobForm.paymentToken}
                    onChange={(e) => setJobForm({ ...jobForm, paymentToken: e.target.value })}
                  >
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                    <option value="DAI">DAI</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Amount</label>
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
                  <label className="block text-sm font-medium mb-2">Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Verification Type</label>
                  <select
                    className="input-field"
                    value={jobForm.verificationType}
                    onChange={(e) => setJobForm({ ...jobForm, verificationType: e.target.value as VerificationType })}
                  >
                    <option value="AI">AI Verification (Venice)</option>
                    <option value="Manual">Manual Verification</option>
                    <option value="Hybrid">Hybrid (AI + Human)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Job Description</label>
                <textarea
                  required
                  className="input-field h-32"
                  placeholder="Describe the work to be done..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Metadata (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="IPFS hash or JSON metadata"
                  value={jobForm.metadata}
                  onChange={(e) => setJobForm({ ...jobForm, metadata: e.target.value })}
                />
              </div>
              
              <button
                type="submit"
                disabled={isCreatingJob}
                className="btn-primary w-full py-3 text-lg"
              >
                {isCreatingJob ? 'Creating Job...' : 'Create Job'}
              </button>
            </form>
          )}

          {/* Browse Jobs */}
          {activeTab === 'browse' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Available Jobs</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse jobs posted by clients. Connect your agent wallet to apply.
              </p>
              <div className="mt-6 text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No jobs yet. Be the first to create one!</p>
              </div>
            </div>
          )}

          {/* My Jobs */}
          {activeTab === 'my-jobs' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Your Jobs</h3>
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No jobs found.</p>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Built on <span className="font-semibold">Base</span> with ❤️
          </p>
          <p className="text-sm">
            Powered by MetaMask SDK • Locus • Uniswap • Venice AI
          </p>
        </div>
      </footer>
    </div>
  );
}
