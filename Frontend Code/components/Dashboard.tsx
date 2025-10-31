'use client';

import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, MESSAGE_BOARD_ABI } from '@/lib/wagmi';
import { formatEther } from 'viem';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Minter from './roles/MInter';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Admin from './roles/Admin';
import Pauser from './roles/Pauser';
import Burn from './roles/Burn';
import User from './roles/User';

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();

    const queryClient = useQueryClient();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleMintSuccess = () => {
        window.location.reload();
        setRefreshKey(prev => prev + 1);
        // Invalidate all queries to refetch data
        queryClient.invalidateQueries();
    };

    const { data: adminRole } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'DEFAULT_ADMIN_ROLE',
    });

    const { data: pauserRole } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'PAUSER_ROLE',
    });

    const { data: minterRole } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'MINTER_ROLE',
    });

    // Check if connected address has each role
    const { data: isAdmin } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'hasRole',
        args: [adminRole!, address!],
        query: { enabled: !!address && !!adminRole },
    });

    const { data: isPauser } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'hasRole',
        args: [pauserRole!, address!],
        query: { enabled: !!address && !!pauserRole },
    });

    const { data: isMinter } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'hasRole',
        args: [minterRole!, address!],
        query: { enabled: !!address && !!minterRole },
    });



    // Read contract data
    const { data: tokenName } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'name',
    });

    const { data: tokenSymbol } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'symbol',
    });

    const { data: balance } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'balanceOf',
        args: [address!], // Non-null assertion since we have the enabled check
        query: { enabled: isConnected && !!address, },
    });

    const { data: totalSupply } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'totalSupply',
    });

    const { data: paused } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'paused',
    });

    if (!isConnected) {
        return (
            <div className=" p-4 py-8 flex  items-center justify-between shadow-[inset_1px_1px_15px_rgba(255,255,255,1)] rounded-lg">
                <p className="text-slate-100 text-base font-mono pl-2">Please connect your wallet to view the portfolio.</p>
                <img className='size-40' src="/Warning.png" alt="Warning" />
            </div>
        );
    }

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="  p-4 ">
            <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-2 border-white rounded-lg p-4 shadow-[inset_1px_1px_5px_rgba(255,255,255,1)]">
                        <h3 className="font-semibold text-slate-200 font-mono">Total Supply</h3>
                        <p className="text-2xl text-slate-200 font-mono">
                            <span className='text-xl' >{totalSupply ? formatEther(totalSupply) : '0'} </span>
                            {tokenSymbol}</p>
                    </div>
                    <div className="border-2 border-white rounded-lg p-4 shadow-[inset_1px_1px_5px_rgba(255,255,255,1)]">
                        <h3 className="font-semibold text-slate-200 font-mono">Your Roles</h3>
                        <div className="mt-2 space-y-1">
                            {isAdmin && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">ADMIN</span>}
                            {isMinter && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">MINTER</span>}
                            {isPauser && <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">PAUSER</span>}
                            {!isAdmin && !isMinter && !isPauser && (
                                <span className="text-slate-200 text-sm font-mono">User</span>
                            )}
                        </div>
                    </div>
                    <div className="border-2 border-white rounded-lg p-4 shadow-[inset_1px_1px_5px_rgba(255,255,255,1)]">
                        <h3 className="font-semibold text-slate-200 font-mono">Token Status</h3>
                        <div className="mt-2 space-y-1">
                            {paused && <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">PAUSED</span>}
                            {!paused && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">ACTIVE</span>}
                        </div>
                    </div>

                </div>
            </div>


            <Card>
                <CardContent>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle className='text-slate-200 font-mono mb-4'>Your Balance</CardTitle>
                            <div className="text-2xl">
                                {balance ? `${formatEther(balance)} ${tokenSymbol}` : '0'}
                            </div>
                        </div>
                        <img className='w-20 h-20' src="/CoinsHistory.png" alt="Coins" />
                    </div>
                </CardContent>
            </Card>


            {
                address && isAdmin &&
                <Admin
                    handleRefresh={handleRefresh}
                    contractAddr={CONTRACT_ADDRESS}
                    address={address}
                    MESSAGE_BOARD_ABI={MESSAGE_BOARD_ABI}
                    isAdmin={isAdmin} />
            }

            <div className='grid grid-cols-2 gap-4 items-start' >

                {
                    isMinter && address &&
                    <Minter
                        handleRefresh={handleRefresh}
                        contractAddr={CONTRACT_ADDRESS}
                        address={address}
                        MESSAGE_BOARD_ABI={MESSAGE_BOARD_ABI}
                    />
                }
                {
                    isMinter && address &&
                    <Burn
                        handleRefresh={handleRefresh}
                        isMinter={isMinter}
                        contractAddr={CONTRACT_ADDRESS}
                        address={address}
                        MESSAGE_BOARD_ABI={MESSAGE_BOARD_ABI}
                    />
                }
                {
                    address && isPauser &&
                    <Pauser
                        handleRefresh={handleRefresh}
                        contractAddr={CONTRACT_ADDRESS}
                        address={address}
                        MESSAGE_BOARD_ABI={MESSAGE_BOARD_ABI}
                        isPauser={isPauser} />
                }
                {
                    !isAdmin && !isMinter && !isPauser &&
                    <User />
                }
            </div>
        </div>
    );
}