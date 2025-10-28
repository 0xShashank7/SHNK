'use client';

import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, MESSAGE_BOARD_ABI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from '@/lib/wagmi';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const { writeContract } = useWriteContract();

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

    const { data: isAdmin } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'hasRole',
        args: [DEFAULT_ADMIN_ROLE, address!],
        query: { enabled: isConnected && !!address },
    });

    const [roleMembers, setRoleMembers] = useState<{ [key: string]: string[] }>({
        ADMIN: [],
        MINTER: [],
        PAUSER: []
    });

    // Get all accounts with roles (this is a simplified version - in a real app, you'd need to track all role assignments)
    const { data: adminRoleData } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'hasRole',
        args: [DEFAULT_ADMIN_ROLE, address!],
        query: { enabled: isConnected && !!address },
    });

    const { data: minterRoleData } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'hasRole',
        args: [MINTER_ROLE, address!],
        query: { enabled: isConnected && !!address },
    });

    const { data: pauserRoleData } = useReadContract({
        abi: MESSAGE_BOARD_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'hasRole',
        args: [PAUSER_ROLE, address!],
        query: { enabled: isConnected && !!address },
    });

    useEffect(() => {
        const updateRoleMembers = async () => {
            const members: { [key: string]: string[] } = {
                ADMIN: [],
                MINTER: [],
                PAUSER: []
            };

            if (adminRoleData && address) members.ADMIN.push(address);
            if (minterRoleData && address) members.MINTER.push(address);
            if (pauserRoleData && address) members.PAUSER.push(address);

            setRoleMembers(members);
        };

        updateRoleMembers();
    }, [adminRoleData, minterRoleData, pauserRoleData, address]);

    if (!isConnected) {
        return (
            <div className="container mx-auto p-4">
                <p>Please connect your wallet to view the dashboard.</p>
            </div>
        );
    }

    console.log('Name ', tokenName);
    console.log('Symbol ', tokenSymbol);
    console.log('Balance ', balance);
    console.log('Is Admin ', isAdmin);

    return (
        <div className="container mx-auto p-4 space-y-8 ">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 ">
                        <h3 className="font-semibold text-slate-200 font-mono">Token Balance</h3>
                        <p className="text-2xl text-slate-200 font-mono">{balance ? formatEther(balance) : '0'} {tokenSymbol}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-slate-200 font-mono">Your Roles</h3>
                        <div className="mt-2 space-y-1">
                            {adminRoleData && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">ADMIN</span>}
                            {minterRoleData && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">MINTER</span>}
                            {pauserRoleData && <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">PAUSER</span>}
                            {!adminRoleData && !minterRoleData && !pauserRoleData && (
                                <span className="text-slate-200 text-sm font-mono">User</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 font-mono">Role Members</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medium  mb-2 text-gray-700 font-mono">Administrators</h3>
                        <div className="bg-gray-50 p-3 rounded">
                            {roleMembers.ADMIN.length > 0 ? (
                                <ul className="space-y-1">
                                    {roleMembers.ADMIN.map((addr, i) => (
                                        <li key={i} className="font-mono text-sm bg-white p-2 rounded border">
                                            {addr}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm font-mono">No administrators found</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-2 font-mono">Minters</h3>
                        <div className="bg-gray-50 p-3 rounded">
                            {roleMembers.MINTER.length > 0 ? (
                                <ul className="space-y-1">
                                    {roleMembers.MINTER.map((addr, i) => (
                                        <li key={i} className="font-mono text-sm bg-white p-2 rounded border">
                                            {addr}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm font-mono">No minters found</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-2 font-mono">Pausers</h3>
                        <div className="bg-gray-50 p-3 rounded">
                            {roleMembers.PAUSER.length > 0 ? (
                                <ul className="space-y-1">
                                    {roleMembers.PAUSER.map((addr, i) => (
                                        <li key={i} className="font-mono text-sm bg-white p-2 rounded border">
                                            {addr}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm font-mono">No pausers found</p>
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
                        {balance ? `${formatEther(balance)} ${tokenSymbol}` : 'Loading...'}
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
                        {!isAdmin && (
                            <button
                                onClick={() => writeContract({
                                    address: CONTRACT_ADDRESS,
                                    abi: MESSAGE_BOARD_ABI,
                                    functionName: 'grantRole',
                                    args: [DEFAULT_ADMIN_ROLE, address!],
                                })}
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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