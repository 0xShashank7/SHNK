import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { toast } from 'sonner';
import { useReadContract, useWriteContract } from 'wagmi';

interface PauserProps {
    isPauser: boolean;
    address: `0x${string}`;
    contractAddr: `0x${string}`;
    MESSAGE_BOARD_ABI: any;
    handleRefresh: () => void;
}
export default function Pauser({ isPauser, address, contractAddr, MESSAGE_BOARD_ABI, handleRefresh }: PauserProps) {

    const { writeContract } = useWriteContract();
    // In Pauser.tsx
    const { data: paused } = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'paused',
    });

    const PauseFn = async () => {
        const toastId = toast.loading(paused ? "Unpausing..." : "Pausing...");
        try {
            const result = await writeContract({
                address: contractAddr,
                abi: MESSAGE_BOARD_ABI,
                functionName: paused ? 'unpause' : 'pause',
                args: [],
            }, {
                onSuccess: () => {

                    setTimeout(() => {
                        handleRefresh();
                    }, 1000);
                    toast.success(`Successfully ${paused ? 'unpaused' : 'paused'}`, { id: toastId });
                },
                onError: () => {
                    toast.error(`Failed to ${paused ? 'unpause' : 'pause'}`, { id: toastId });
                }
            });

            return result;
        } catch (error) {
            console.error("Pause error:", error);
            let errorMessage = "Failed to update pause state";
            if (error instanceof Error) {
                errorMessage = error.message || errorMessage;
            }
            toast.error(errorMessage, { id: toastId });
            throw error;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pause Status - <span className={`font-mono ${paused ? 'text-red-500' : 'text-slate-50'}`}>{paused ? 'Paused' : 'Unpaused'}</span></CardTitle>
            </CardHeader>
            <CardContent>

                <div className="flex">
                    <button onClick={() => PauseFn()} className=" px-6 py-2 border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 ">
                        {paused ? 'Unpause' : 'Pause'}
                    </button>
                </div>

            </CardContent>
        </Card>
    )
}
