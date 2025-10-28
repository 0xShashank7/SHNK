import Dashboard from "@/components/Dashboard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="containerDIV">
      <div className=" container m-auto  flex flex-col w-full items-start justify-center font-sans">
        <div className="w-full">
          <header className="backdrop-blur-xs shadow-[inset_1px_1px_10px_rgba(255,255,255,1)]  my-4 rounded-xl border-2 border-slate-200">
            <div className="  mx-auto pr-4 pl-6 py-4 ">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-slate-200 font-mono  ">SHNK Token Portfolio</h1>
                </div>
                <ConnectButton />
              </div>
            </div>
          </header>
          <div className="w-full max-h-[80vh]  overflow-y-auto backdrop-blur-sm shadow-2xl rounded-xl border-2 border-slate-200 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-gray-100 scrollbar-track-rounded-full scrollbar-thumb-rounded-full" >
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
