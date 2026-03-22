import { ethers } from 'ethers';
import { config } from './config';

/**
 * Uniswap Integration
 * Handles multi-token payments and auto-swaps for escrow
 */

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  slippageTolerance: number; // Basis points (e.g., 50 = 0.5%)
  recipient: string;
}

export interface SwapQuote {
  amountOut: bigint;
  priceImpact: number;
  route: string[];
  gasEstimate: bigint;
}

export class UniswapClient {
  private provider: ethers.Provider | null = null;
  private routerAddress: string;

  constructor() {
    this.routerAddress = config.partners.uniswap.routerAddress;
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
  }

  /**
   * Get optimal swap route and quote
   */
  async getSwapQuote(params: SwapParams): Promise<SwapQuote | null> {
    if (!this.provider) return null;

    // In production, this would call Uniswap API or quoter contract
    // For now, return placeholder implementation
    console.log('Getting swap quote:', params);
    
    return {
      amountOut: params.amountIn, // Placeholder
      priceImpact: 0.01, // Placeholder
      route: [params.tokenIn, params.tokenOut],
      gasEstimate: BigInt(150000),
    };
  }

  /**
   * Execute token swap
   */
  async executeSwap(
    params: SwapParams,
    signer: ethers.Signer
  ): Promise<{ txHash: string; amountOut: bigint }> {
    const router = new ethers.Contract(
      this.routerAddress,
      [
        'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
      ],
      signer
    );

    const quote = await this.getSwapQuote(params);
    if (!quote) throw new Error('Failed to get swap quote');

    const amountOutMinimum = (params.amountIn * BigInt(10000 - params.slippageTolerance)) / BigInt(10000);

    const tx = await router.exactInputSingle({
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      fee: 3000, // 0.3% fee tier
      recipient: params.recipient,
      amountIn: params.amountIn,
      amountOutMinimum: amountOutMinimum,
      sqrtPriceLimitX96: 0,
    });

    const receipt = await tx.wait();
    return {
      txHash: receipt.hash,
      amountOut: quote.amountOut,
    };
  }

  /**
   * Auto-swap to USDC before escrow
   * Converts any token to USDC for stable escrow value
   */
  async autoSwapToUSDC(
    tokenIn: string,
    amountIn: bigint,
    signer: ethers.Signer
  ): Promise<{ txHash: string; usdcAmount: bigint }> {
    const result = await this.executeSwap(
      {
        tokenIn,
        tokenOut: config.tokens.base.USDC.address,
        amountIn,
        slippageTolerance: 50, // 0.5%
        recipient: await signer.getAddress(),
      },
      signer
    );

    return {
      txHash: result.txHash,
      usdcAmount: result.amountOut,
    };
  }

  /**
   * Get token price in USD
   */
  async getTokenPrice(tokenAddress: string): Promise<number | null> {
    if (!this.provider) return null;

    // In production, call Uniswap quoter or price oracle
    // Placeholder implementation
    const ETH_PRICE = 3500; // Placeholder
    
    if (tokenAddress === config.tokens.base.ETH.address) {
      return ETH_PRICE;
    }
    
    return ETH_PRICE; // Placeholder
  }
}

export const uniswapClient = new UniswapClient();
