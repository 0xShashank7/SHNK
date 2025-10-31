import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { useState } from 'react';
import { toast } from "sonner"
import { parseEther } from 'viem';
import { useWriteContract } from 'wagmi';

interface BurnProps {
    contractAddr: `0x${string}`;  // Ensures valid Ethereum address
    address: `0x${string}`;
    MESSAGE_BOARD_ABI: any;
    isMinter: boolean;
    handleRefresh: () => void;
}

export default function Burn({ contractAddr, address, MESSAGE_BOARD_ABI, isMinter, handleRefresh }: BurnProps) {

    const [amount, setAmount] = useState<string>('');
    const { writeContract } = useWriteContract();


    const BurnFn = async () => {
        if (!amount) {
            toast.warning("Please enter the amount to burn")
            return;
        }

        const amountToBurn = parseFloat(amount);
        if (isNaN(amountToBurn) || amountToBurn <= 0) {
            toast.warning("Please enter a valid positive amount");
            return;
        }

        if (!isMinter) {
            toast.error("Only minter can burn tokens");
            return;
        }

        const amountInWei = parseEther(amount);


        try {
            const toastId = toast.loading("Burning tokens...");

            await writeContract({
                address: contractAddr,
                abi: MESSAGE_BOARD_ABI,
                functionName: 'burn',
                args: [address, amountInWei],
            }, {
                onSuccess: () => {

                    setTimeout(() => {
                        handleRefresh();
                    }, 1000);
                    toast.success("Tokens burned successfully!", { id: toastId });
                    setAmount('');
                },
                onError: () => {
                    toast.error("Failed to burn tokens")
                }
            })
        } catch (error) {
            toast.error("Failed to burn tokens")
        }
    }

    return (

        <Card>
            <CardHeader>
                <CardTitle>Burn Tokens</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex'>
                    <input value={amount} min={1} onChange={(e) => setAmount(e.target.value)} className=' px-6 py-2 focus:outline-none border-slate-200 border-2 text-slate-200 rounded-lg   transition-all duration-500 ' required type="number" placeholder="Enter amount to burn" />
                    <button onClick={async () => BurnFn()} className="ml-4 px-6 py-2 border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 ">
                        Burn Tokens
                    </button>
                </div>

            </CardContent>
        </Card>
    )
}
