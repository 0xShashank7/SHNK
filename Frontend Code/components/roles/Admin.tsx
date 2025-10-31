import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWriteContract, useReadContract } from 'wagmi';
import { useState } from 'react';
import { toast } from "sonner"
import { Abi } from 'viem';

interface AdminProps {
    isAdmin: boolean;
    address: `0x${string}`;
    contractAddr: `0x${string}`;
    MESSAGE_BOARD_ABI: Abi;
    handleRefresh: () => void;
}

function Admin({ isAdmin, address, contractAddr, MESSAGE_BOARD_ABI, handleRefresh }: AdminProps) {
    const [adminAddressToAdd, setAdminAddressToAdd] = useState('');
    const [PauserAddressToAdd, setPauserAddressToAdd] = useState('');
    const [MinterAddressToAdd, setMinterAddressToAdd] = useState('');

    const [adminAddressToRevoke, setAdminAddressToRevoke] = useState('');
    const [PauserAddressToRevoke, setPauserAddressToRevoke] = useState('');
    const [MinterAddressToRevoke, setMinterAddressToRevoke] = useState('');

    const { writeContract } = useWriteContract();

    // Get the admin role hash
    const adminRoleResult = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'DEFAULT_ADMIN_ROLE',
    });
    const adminRole = adminRoleResult.data;

    // Get the pauser role hash
    const pauserRoleResult = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'PAUSER_ROLE',
    });
    const pauserRole = pauserRoleResult.data;

    // Get the minter role hash
    const minterRoleResult = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'MINTER_ROLE',
    });
    const minterRole = minterRoleResult.data;

    const grantAdminRole = async () => {
        if (!adminAddressToAdd) {
            toast.warning('Please enter an address');
            return;
        }

        if (!adminRole) {
            toast.error('Failed to get admin role');
            return;
        }

        if (address === adminAddressToAdd) {
            toast.error('You cannot grant admin role to yourself as you are already an admin');
            return;
        }

        writeContract({
            address: contractAddr,
            abi: MESSAGE_BOARD_ABI,
            functionName: 'grantRole',
            args: [adminRole, adminAddressToAdd],
        }, {
            onSuccess: () => {

                setTimeout(() => {
                    handleRefresh();
                }, 1000);
                toast.success('Admin role granted successfully');
                setAdminAddressToAdd('');
                window.location.reload();
            },
            onError: (error) => {
                console.error('Error granting admin role:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to grant admin role';
                toast.error(errorMessage);
            }
        });
    }

    const grantPauserRole = () => {
        if (!PauserAddressToAdd) {
            toast.warning('Please enter an address');
            return;
        }

        if (!pauserRole) {
            toast.error('Failed to get pauser role');
            return;
        }

        writeContract({
            address: contractAddr,
            abi: MESSAGE_BOARD_ABI,
            functionName: 'grantRole',
            args: [pauserRole, PauserAddressToAdd],
        }, {
            onSuccess: () => {

                setTimeout(() => {
                    handleRefresh();
                }, 1000);
                toast.success('Pauser role granted successfully');
                setPauserAddressToAdd('');
            },
            onError: (error) => {
                console.error('Error granting pauser role:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to grant pauser role';
                toast.error(errorMessage);
            }
        });

    }

    const grantMinterRole = () => {
        if (!MinterAddressToAdd) {
            toast.warning('Please enter an address');
            return;
        }

        if (!minterRole) {
            toast.error('Failed to get minter role');
            return;
        }

        writeContract({
            address: contractAddr,
            abi: MESSAGE_BOARD_ABI,
            functionName: 'grantRole',
            args: [minterRole, MinterAddressToAdd],
        }, {
            onSuccess: () => {

                setTimeout(() => {
                    handleRefresh();
                }, 1000);
                toast.success('Minter role granted successfully');
                setMinterAddressToAdd('');
            },
            onError: (error) => {
                console.error('Error granting minter role:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to grant minter role';
                toast.error(errorMessage);
            }
        });
    }

    const { data: hasAdminRole, refetch: refetchHasAdminRole } = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'hasRole',
        args: [adminRole, adminAddressToRevoke],
        query: { enabled: !!adminRole && !!adminAddressToRevoke },
    });

    const { data: hasPauserRole, refetch: refetchHasPauserRole } = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'hasRole',
        args: [pauserRole, PauserAddressToRevoke],
        query: { enabled: !!pauserRole && !!PauserAddressToRevoke },
    });

    const { data: hasMinterRole, refetch: refetchHasMinterRole } = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'hasRole',
        args: [minterRole, MinterAddressToRevoke],
        query: { enabled: !!minterRole && !!MinterAddressToRevoke },
    });

    const revokeAdminRole = () => {
        if (!adminAddressToRevoke) {
            toast.warning('Please enter an address');
            return;
        }

        if (!adminRole) {
            toast.error('Failed to get admin role');
            return;
        }

        if (!hasAdminRole) {
            toast.error('User does not have admin role');
            return;
        }

        writeContract({
            address: contractAddr,
            abi: MESSAGE_BOARD_ABI,
            functionName: 'revokeRole',
            args: [adminRole, adminAddressToRevoke],
        }, {
            onSuccess: () => {

                setTimeout(() => {
                    handleRefresh();
                }, 1000);
                toast.success('Admin role revoked successfully');
                setAdminAddressToRevoke('');
            },
            onError: (error) => {
                console.error('Error revoking admin role:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to revoke admin role';
                toast.error(errorMessage);
            }
        });

    }

    const revokePauserRole = () => {
        if (!PauserAddressToRevoke) {
            toast.warning('Please enter an address');
            return;
        }

        if (!pauserRole) {
            toast.error('Failed to get pauser role');
            return;
        }

        if (!hasPauserRole) {
            toast.error('User does not have pauser role');
            return;
        }

        writeContract({
            address: contractAddr,
            abi: MESSAGE_BOARD_ABI,
            functionName: 'revokeRole',
            args: [pauserRole, PauserAddressToRevoke],
        }, {
            onSuccess: () => {

                setTimeout(() => {
                    handleRefresh();
                }, 1000);
                toast.success('Pauser role revoked successfully');
                setPauserAddressToRevoke('');
            },
            onError: (error) => {
                console.error('Error revoking pauser role:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to revoke pauser role';
                toast.error(errorMessage);
            }
        });
    }

    const revokeMinterRole = () => {
        if (!MinterAddressToRevoke) {
            toast.warning('Please enter an address');
            return;
        }

        if (!minterRole) {
            toast.error('Failed to get minter role');
            return;
        }

        if (!hasMinterRole) {
            toast.error('User does not have minter role');
            return;
        }

        writeContract({
            address: contractAddr,
            abi: MESSAGE_BOARD_ABI,
            functionName: 'revokeRole',
            args: [minterRole, MinterAddressToRevoke],
        }, {
            onSuccess: () => {

                setTimeout(() => {
                    handleRefresh();
                }, 1000);
                toast.success('Minter role revoked successfully');
                setMinterAddressToRevoke('');
            },
            onError: (error) => {
                console.error('Error revoking minter role:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to revoke minter role';
                toast.error(errorMessage);
            }
        });

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Permission Setup</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-lg">
                    <div className='grid grid-cols-2 gap-4' >
                        <div className='flex flex-col gap-2 border-r border-slate-400 pr-4'>
                            <div className='flex items-center gap-2'>
                                <input
                                    value={adminAddressToAdd}
                                    onChange={(e) => setAdminAddressToAdd(e.target.value)}
                                    className='px-4 py-2 w-3/5 focus:outline-none border-slate-200 border-2 bg-transparent text-slate-200 rounded-lg transition-all duration-500 '
                                    required
                                    type='text'
                                    placeholder="Enter 0x Address..."
                                />
                                <button
                                    onClick={grantAdminRole}
                                    disabled={!adminRole}
                                    className=" w-2/5 ml-4 px-3 py-3 text-sm border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {adminRole ? 'Grant Admin Role' : 'Loading...'}
                                </button>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input
                                    value={PauserAddressToAdd}
                                    onChange={(e) => setPauserAddressToAdd(e.target.value)}
                                    className='px-4 py-2 w-3/5 focus:outline-none border-slate-200 border-2 bg-transparent text-slate-200 rounded-lg transition-all duration-500 '
                                    required
                                    type='text'
                                    placeholder="Enter 0x Address..."
                                />
                                <button
                                    onClick={grantPauserRole}
                                    disabled={!pauserRole}
                                    className="ml-4 px-6 w-2/5 py-3 text-sm border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {pauserRole ? 'Grant Pauser Role' : 'Loading...'}
                                </button>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input
                                    value={MinterAddressToAdd}
                                    onChange={(e) => setMinterAddressToAdd(e.target.value)}
                                    className='px-4 py-2 w-3/5 focus:outline-none border-slate-200 border-2 bg-transparent text-slate-200 rounded-lg transition-all duration-500 '
                                    required
                                    type='text'
                                    placeholder="Enter 0x Address..."
                                />
                                <button
                                    onClick={grantMinterRole}
                                    disabled={!minterRole}
                                    className="ml-4 px-6 w-2/5 py-3 text-sm border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {minterRole ? 'Grant Minter Role' : 'Loading...'}
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2' >
                            <div className='flex items-center gap-2' >
                                <input value={adminAddressToRevoke} onChange={(e) => setAdminAddressToRevoke(e.target.value)} type="text" placeholder='Enter 0x Address...'
                                    className='px-4 py-2 w-3/5 focus:outline-none border-slate-200 border-2 bg-transparent text-slate-200 rounded-lg transition-all duration-500 '
                                    required />
                                <button
                                    onClick={revokeAdminRole}
                                    disabled={!adminRole}
                                    className="ml-4 px-6 w-2/5 py-3 text-sm border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {adminRole ? 'Revoke Admin Role' : 'Loading...'}
                                </button>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input value={PauserAddressToRevoke} onChange={(e) => setPauserAddressToRevoke(e.target.value)} type="text" placeholder='Enter 0x Address...'
                                    className='px-4 py-2 w-3/5 focus:outline-none border-slate-200 border-2 bg-transparent text-slate-200 rounded-lg transition-all duration-500 '
                                    required />
                                <button
                                    onClick={revokePauserRole}
                                    disabled={!pauserRole}
                                    className="ml-4 px-6 w-2/5 py-3 text-sm border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {pauserRole ? 'Revoke Pauser Role' : 'Loading...'}
                                </button>

                            </div>
                            <div className='flex items-center gap-2'>
                                <input value={MinterAddressToRevoke} onChange={(e) => setMinterAddressToRevoke(e.target.value)} type="text" placeholder='Enter 0x Address...'
                                    className='px-4 py-2 w-3/5 focus:outline-none border-slate-200 border-2 bg-transparent text-slate-200 rounded-lg transition-all duration-500 '
                                    required />
                                <button
                                    onClick={revokeMinterRole}
                                    disabled={!minterRole}
                                    className="ml-4 px-6 w-2/5 py-3 text-sm border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {minterRole ? 'Revoke Minter Role' : 'Loading...'}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Admin