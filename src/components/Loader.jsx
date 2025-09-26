import React, { useState } from "react";
import api from "../services/api";

const Loader = ({ setApiHealthy }) => {
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get("/health");
      if (response.status === 200) {
        setApiHealthy(true);
      }
    } catch (error) {
      console.error("Health check failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
      <div
        onClick={checkHealth}
        className={`relative w-[150px] h-[150px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 
          bg-[radial-gradient(circle,#111_30%,#000_100%)] 
          shadow-[inset_-8px_-8px_15px_#000,inset_8px_8px_20px_#222]
          active:scale-90
          ${loading ? "active" : ""}`}
      >
        {/* Power Icon */}
        <div
          className={`text-[48px] z-20 transition-all duration-300 ${
            loading
              ? "text-cyan-400 drop-shadow-[0_0_12px_#0ff] "
              : "text-cyan-400 drop-shadow-[0_0_8px_#0ff]"
          }`}
        >
          &#x23FB;
        </div>

        {/* Waves */}
        <div
          className={`absolute w-[160px] h-[160px] rounded-full border-[3px] border-cyan-400 pointer-events-none ${
            loading ? "animate-wave" : "opacity-0"
          }`}
        ></div>
        <div
          className={`absolute w-[160px] h-[160px] rounded-full border-[3px] border-cyan-400 pointer-events-none ${
            loading ? "animate-wave [animation-delay:1s]" : "opacity-0"
          }`}
        ></div>
        <div
          className={`absolute w-[160px] h-[160px] rounded-full border-[3px] border-cyan-400 pointer-events-none ${
            loading ? "animate-wave [animation-delay:2s]" : "opacity-0"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
