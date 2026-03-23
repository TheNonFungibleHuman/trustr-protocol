'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import MetaMaskSDK from '@metamask/sdk';

/**
 * MetaMask SDK Hook
 * Handles wallet connection, policy wallets, and ERC-7715 delegations
 * Defaults to Base Sepolia testnet (chain ID 84532)
 */

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isSmartAccount: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ERC7715Delegation {
  delegator: string;
  delegatee: string;
  capabilities: string[];
  expiry: number;
  signature: string;
}

// Base Sepolia configuration
const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_HEX = '0x14a34'; // 84532 in hex

// Lazy SDK initialization - prevents SSR issues
let sdkInstance: MetaMaskSDK | null = null;

const getSDK = (): MetaMaskSDK => {
  if (typeof window === 'undefined') {
    throw new Error('MetaMask SDK can only be used in browser environment');
  }
  
  if (!sdkInstance) {
    sdkInstance = new MetaMaskSDK({
      dappMetadata: {
        name: 'Trustr Protocol',
        url: 'https://trustr.gg',
      },
      enableAnalytics: true,
      preferDesktop: true,
      extensionOnly: false,
      checkInstallationImmediately: false,
    });
  }
  
  return sdkInstance;
};

export function useMetaMask() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    provider: null,
    signer: null,
    isSmartAccount: false,
    isLoading: true,
    error: null,
  });

  const [delegation, setDelegation] = useState<ERC7715Delegation | null>(null);
  const sdkRef = useRef<MetaMaskSDK | null>(null);

  // Initialize SDK on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sdkRef.current = getSDK();
    }
  }, []);

  // Add Base Sepolia network to MetaMask if not present
  const addBaseSepolia = useCallback(async () => {
    const SDK = sdkRef.current;
    if (!SDK) throw new Error('SDK not initialized');
    
    try {
      const provider = SDK.getProvider();
      if (!provider) throw new Error('No provider');

      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: BASE_SEPOLIA_HEX,
          chainName: 'Base Sepolia Testnet',
          nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://sepolia.base.org'],
          blockExplorerUrls: ['https://sepolia.basescan.org'],
        }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Failed to add Base Sepolia network');
      }
      throw error;
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    const SDK = sdkRef.current;
    if (!SDK) throw new Error('SDK not initialized');
    
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

      await SDK.connect();
      const provider = SDK.getProvider();
      
      if (!provider) {
        throw new Error('Failed to get provider');
      }

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const network = await ethersProvider.getNetwork();
      let chainId = Number(network.chainId);

      // If not on Base Sepolia, switch to it
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        try {
          await switchNetwork(BASE_SEPOLIA_CHAIN_ID);
          chainId = BASE_SEPOLIA_CHAIN_ID;
        } catch (switchError: any) {
          // If switching fails, try adding the network first
          if (switchError.code === 4902) {
            await addBaseSepolia();
            await switchNetwork(BASE_SEPOLIA_CHAIN_ID);
            chainId = BASE_SEPOLIA_CHAIN_ID;
          } else {
            throw new Error('Please switch to Base Sepolia network manually');
          }
        }
      }

      // Check if smart account (ERC-4337)
      const code = await ethersProvider.getCode(address);
      const isSmartAccount = code !== '0x';

      setWalletState({
        isConnected: true,
        address,
        chainId,
        provider: ethersProvider,
        signer,
        isSmartAccount,
        isLoading: false,
        error: null,
      });

      return { address, chainId };
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect',
      }));
      throw error;
    }
  }, [addBaseSepolia]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    const SDK = sdkRef.current;
    if (!SDK) return;
    
    try {
      await SDK.terminate();
      setWalletState({
        isConnected: false,
        address: null,
        chainId: null,
        provider: null,
        signer: null,
        isSmartAccount: false,
        isLoading: false,
        error: null,
      });
      setDelegation(null);
    } catch (error: any) {
      console.error('Disconnect error:', error);
    }
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    const SDK = sdkRef.current;
    if (!SDK) throw new Error('SDK not initialized');
    
    try {
      const provider = SDK.getProvider();
      if (!provider) throw new Error('No provider');

      const hexChainId = `0x${chainId.toString(16)}`;
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });

      const network = await new ethers.BrowserProvider(provider).getNetwork();
      return Number(network.chainId);
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Network not added to MetaMask');
      }
      throw error;
    }
  }, []);

  // Create ERC-7715 delegation (for policy-governed spending)
  const createDelegation = useCallback(async (
    delegatee: string,
    capabilities: string[],
    expiry: number
  ): Promise<ERC7715Delegation | null> => {
    if (!walletState.signer) return null;

    try {
      const address = await walletState.signer.getAddress();
      
      // Create delegation message
      const message = {
        delegator: address,
        delegatee,
        capabilities,
        expiry,
        nonce: Date.now(),
      };

      // Sign delegation
      const signature = await walletState.signer.signMessage(
        JSON.stringify(message)
      );

      const delegation: ERC7715Delegation = {
        delegator: address,
        delegatee,
        capabilities,
        expiry,
        signature,
      };

      setDelegation(delegation);
      return delegation;
    } catch (error: any) {
      console.error('Delegation error:', error);
      return null;
    }
  }, [walletState.signer]);

  // Set spending policy (for smart accounts)
  const setSpendingPolicy = useCallback(async (
    limit: string,
    period: 'day' | 'week' | 'month',
    enabled: boolean
  ): Promise<boolean> => {
    if (!walletState.isSmartAccount || !walletState.signer) {
      return false;
    }

    try {
      // In production, this would interact with smart account contract
      console.log('Setting spending policy:', { limit, period, enabled });
      return true;
    } catch (error: any) {
      console.error('Spending policy error:', error);
      return false;
    }
  }, [walletState.isSmartAccount, walletState.signer]);

  // Auto-connect on mount
  useEffect(() => {
    const init = async () => {
      try {
        const SDK = sdkRef.current;
        if (!SDK) return;
        
        const accounts = await SDK.connect();
        if (accounts && accounts.length > 0) {
          await connect();
        } else {
          setWalletState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setWalletState(prev => ({ ...prev, isLoading: false }));
      }
    };
    init();
  }, [connect]);

  return {
    ...walletState,
    disconnect,
    connect,
    switchNetwork,
    createDelegation,
    setSpendingPolicy,
    delegation,
    sdk: sdkRef.current,
  };
}

export default useMetaMask;
