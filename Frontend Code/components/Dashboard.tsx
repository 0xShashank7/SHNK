'use client';

import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, MESSAGE_BOARD_ABI } from '@/lib/wagmi';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();

    debugger;

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
        query: { enabled: isConnected && !!address },
    });

    const { data: totalSupply } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'totalSupply',
    });


    if (!isConnected) {
        return (
            <div className="container mx-auto p-4 py-8">
                <p className="text-slate-300 text-base font-mono">Please connect your wallet to view the dashboard.</p>
            </div>
        );
    }

    console.log('Name ', tokenName);
    console.log('Symbol ', tokenSymbol);
    console.log('Balance ', balance);
    console.log('isAdmin Role is ', isAdmin);
    console.log('isPauser Role is ', isPauser);
    console.log('isMinter Role is ', isMinter);

    return (
        <div className="container mx-auto p-4 space-y-8 ">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-slate-200 font-mono">Total Supply</h3>
                        <p className="text-2xl text-slate-200 font-mono">{totalSupply ? formatEther(totalSupply) : '0'} {tokenSymbol}</p>
                    </div>
                    <div className="border rounded-lg p-4">
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

                </div>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Your Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl">
                        {balance ? `${formatEther(balance)} ${tokenSymbol}` : '0'}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-lg">
                        {isAdmin ? '✅ Admin' : '❌ Not Admin'}
                        {isAdmin && (
                            <button
                                onClick={() => writeContract({
                                    address: CONTRACT_ADDRESS,
                                    abi: MESSAGE_BOARD_ABI,
                                    functionName: 'grantRole',
                                    args: [adminRole!, address!],
                                })}
                                className="ml-4 px-4 py-2 border-[#1f508e] border-2 text-[#1f508e] rounded hover:shadow-[1px_1px_30px_#1f508e_inset] cursor-pointer transition-all duration-500 "
                            >
                                Make Me Admin
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}