import { Card, CardContent } from '@/components/ui/card'

function User() {
    return (
        <>
            <Card>
                <CardContent>
                    <div className='flex items-center justify-between'>
                        <div className='text-slate-200 font-mono text-xl'>
                            <p >Hello there! hope you are having a great day!</p>
                            <p className='mt-2'>Get a role to perform actions.</p>
                        </div>
                        <img className='size-32 rounded-full mr-4' src="/NikolaTesla.png" alt="Tesla" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <div className='flex items-center justify-between'>
                        <>
                            <p className='text-slate-300 font-mono text-lg mt-2' >
                                Reach out to the <a target='_blank' className='underline' href="https://x.com/0xshashank"> admin</a> to request Admin access. <br /> Don't forget to share your wallet address! 🚀
                            </p>
                        </>
                        <img className='size-32 rounded-full mr-4' src="/Churchill.png" alt="Churchill" />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default User