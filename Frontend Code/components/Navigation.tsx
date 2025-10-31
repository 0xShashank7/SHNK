'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navigation() {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <header className={` ${isScrolled ? 'w-1/2 backdrop-blur-3xl max-w-[1210px]' : 'max-w-[1210px] w-full m-auto backdrop-blur-xs'}    shadow-[inset_1px_1px_20px_rgba(255,255,255,1)] my-4 rounded-xl border-2 border-slate-200 fixed top-2 left-1/2 -translate-x-1/2 z-50 transition-all ease-in-out  duration-1000`}>
            <div className="mx-auto pr-4 pl-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-slate-200 font-mono">SHNK Token Portfolio</h1>
                        <img className='size-10 ml-2 hover:animate-caret-blink transition-all duration-500 ' src="/Flash.png" alt="Flash" />
                    </div>
                    <ConnectButton />
                </div>
            </div>
        </header>
    )
}

export default Navigation