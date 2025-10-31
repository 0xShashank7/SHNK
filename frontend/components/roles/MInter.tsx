import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from "sonner"
import { parseEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

interface MinterProps {
    contractAddr: `0x${string}`;  // Ensures valid Ethereum address
    address: `0x${string}`;
    MESSAGE_BOARD_ABI: any;
    handleRefresh: () => void;
}

function Minter({ contractAddr, address, MESSAGE_BOARD_ABI, handleRefresh }: MinterProps) {

    const [amount, setAmount] = useState<string>('');
    const { writeContract, isPending } = useWriteContract();

    const { data: paused } = useReadContract({
        address: contractAddr,
        abi: MESSAGE_BOARD_ABI,
        functionName: 'paused',
    });

    const MintFn = async () => {

        if (paused) {
            toast.warning("Token is paused")
            return;
        }

        if (!amount) {
            toast.warning("Please enter the amount to mint")
            return;
        }

        const amountToMint = parseFloat(amount);
        if (isNaN(amountToMint) || amountToMint <= 0) {
            toast.warning("Please enter a valid positive amount");
            return;
        }

        try {
            const toastId = toast.loading("Minting tokens...");

            const amountInWei = parseEther(amount);

            await writeContract({
                address: contractAddr,
                abi: MESSAGE_BOARD_ABI,
                functionName: 'mint',
                args: [address, amountInWei],
            }, {
                onSuccess: () => {
                    toast.success(`Successfully minted ${amount} tokens!`, { id: toastId });
                    setAmount('');
                    setTimeout(() => {
                        handleRefresh();
                    }, 1000);
                },
                onError: () => {
                    toast.error("Minting failed")
                }
            })
        } catch (error) {
            toast.error("Minting failed")
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mint Tokens</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex'>
                    <input value={amount} min={1} onChange={(e) => setAmount(e.target.value)} className=' px-6 py-2 focus:outline-none border-slate-200 border-2 text-slate-200 rounded-lg   transition-all duration-500 ' required type="number" placeholder="Enter amount" />
                    <button onClick={() => MintFn()} className="ml-4 px-6 py-2 border-slate-200 border-2 text-slate-200 rounded-lg shadow-[1px_1px_10px_#fff_inset] hover:shadow-[1px_1px_30px_#fff_inset] cursor-pointer transition-all duration-500 ">
                        Mint Tokens
                    </button>
                </div>

            </CardContent>
        </Card>
    )
}

export default Minter