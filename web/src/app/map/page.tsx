"use client";
import MapComponent from "./Map";
import Sidebar from "./Sidebar";

export default function Page() {
  return (
    <div className="relative w-full h-full">
      <MapComponent />
      <div className="absolute top-0 left-0 w-20 h-full"> {/*pointer-events-none">*/}
        <Sidebar />
      </div>
    </div>
  );
}
