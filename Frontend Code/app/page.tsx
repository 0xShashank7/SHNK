import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";

export default function Home() {

  return (
    <div className="containerDIV">
      <Navigation />
      <div className=" max-w-7xl  m-auto  flex flex-col w-full items-start justify-center font-sans px-8">
        <div className="w-full DashbaordDiv mt-28 my-4 backdrop-blur-sm shadow-2xl rounded-xl border-2 border-slate-200 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-gray-100 scrollbar-track-rounded-full scrollbar-thumb-rounded-full" >
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
