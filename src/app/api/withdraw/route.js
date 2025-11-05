import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { getTreasuryWallet } from '@/lib/walletUtils';

// Somnia Testnet RPC URL
const SOMNIA_TESTNET_RPC = process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC || process.env.NEXT_PUBLIC_0G_GALILEO_RPC || 'https://dream-rpc.somnia.network/';

// Create provider
const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC);

// Get treasury wallet (derived from mnemonic if available)
let treasuryWallet;
try {
  treasuryWallet = getTreasuryWallet(provider);
} catch (error) {
  console.error('Failed to initialize treasury wallet:', error.message);
}

export async function POST(request) {
  try {
    const { userAddress, amount } = await request.json();

    console.log('📥 Received withdrawal request:', { userAddress, amount, type: typeof userAddress });

    // Validate input
    if (!userAddress || !amount || amount <= 0) {
      return new Response(JSON.stringify({
        error: 'Invalid parameters'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!treasuryWallet) {
      return NextResponse.json(
        { error: 'Treasury not configured. Set TREASURY_MNEMONIC or TREASURY_PRIVATE_KEY environment variable.' },
        { status: 500 }
      );
    }

    console.log(`🏦 Processing withdrawal: ${amount} STT to ${userAddress}`);
    console.log(`📍 Treasury: ${treasuryWallet.address}`);

    // Check treasury balance
    let treasuryBalance = 0;
    try {
      treasuryBalance = await provider.getBalance(treasuryWallet.address);
      console.log(`💰 Treasury balance: ${ethers.formatEther(treasuryBalance)} STT`);
    } catch (balanceError) {
      console.log('⚠️ Could not check treasury balance, proceeding with transfer attempt...');
      console.log('Balance error:', balanceError.message);
    }

    // Check if treasury has sufficient funds
    const amountWei = ethers.parseEther(amount.toString());
    if (treasuryBalance < amountWei) {
      return NextResponse.json(
        { error: `Insufficient treasury funds. Available: ${ethers.formatEther(treasuryBalance)} STT, Requested: ${amount} STT` },
        { status: 400 }
      );
    }

    // Format user address
    let formattedUserAddress;
    if (typeof userAddress === 'object' && userAddress.data) {
      // Convert Uint8Array-like object to hex string
      const bytes = Object.values(userAddress.data);
      formattedUserAddress = '0x' + bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    } else if (typeof userAddress === 'string') {
      formattedUserAddress = userAddress.startsWith('0x') ? userAddress : `0x${userAddress}`;
    } else {
      throw new Error(`Invalid userAddress format: ${typeof userAddress}`);
    }

    console.log('🔧 Formatted user address:', formattedUserAddress);
    console.log('🔧 Treasury account:', treasuryWallet.address);
    console.log('🔧 Amount in Wei:', amountWei.toString());

    // Send transaction from treasury to user
    const tx = await treasuryWallet.sendTransaction({
      to: formattedUserAddress,
      value: amountWei,
      gasLimit: process.env.GAS_LIMIT_WITHDRAW ? parseInt(process.env.GAS_LIMIT_WITHDRAW) : 100000
    });

    console.log(`📤 Transaction sent: ${tx.hash}`);

    // Return transaction hash immediately without waiting for confirmation
    // User can check transaction status on explorer
    console.log(`✅ Withdraw STT to ${userAddress}, TX: ${tx.hash}`);

    return new Response(JSON.stringify({
      success: true,
      transactionHash: tx.hash,
      amount: amount,
      userAddress: userAddress,
      treasuryAddress: treasuryWallet.address,
      status: 'pending',
      message: 'Transaction sent successfully. Check explorer for confirmation.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Withdraw API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Ensure error message is a string
    const errorMessage = error?.message || 'Unknown error occurred';
    const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Unknown error occurred';

    return new Response(JSON.stringify({
      error: `Withdrawal failed: ${safeErrorMessage}`
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// GET endpoint to check treasury balance
export async function GET() {
  try {
    if (!treasuryWallet) {
      return NextResponse.json(
        { error: 'Treasury not configured. Set TREASURY_MNEMONIC or TREASURY_PRIVATE_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Return treasury balance using ethers provider
    const balance = await provider.getBalance(treasuryWallet.address);
    const balanceInToken = ethers.formatEther(balance);

    return NextResponse.json({
      treasuryAddress: treasuryWallet.address,
      balance: balanceInToken,
      balanceWei: balance.toString(),
      status: 'active'
    });


  } catch (error) {
    console.error('Treasury balance check error:', error);
    return NextResponse.json(
      { error: 'Failed to check treasury balance: ' + error.message },
      { status: 500 }
    );
  }
}