import React, { useState, useMemo } from "react";
import { FaHouse } from "react-icons/fa6";
import Navbar from "./MainPages/Navbar";
export default function RentCalculator() {
  const [price, setPrice] = useState("");
  const [furnish, setFurnish] = useState("non");
  const [rooms, setRooms] = useState({
    pooja: false,
    servant: false,
    study: false,
    store: false,
  });
  const [parking, setParking] = useState(false);
  const [prime, setPrime] = useState(false);
  const [rent, setRent] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Generate stable floating house icons with alternating shine effects
  const floatingHouses = useMemo(() => {
    const houses = [];
    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 15 + 8; // Smaller size range (8-23px)
      const floatDuration = Math.random() * 20 + 20; // Slower movement (20-40s)
      const floatDelay = Math.random() * 15;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.2; // More visible (0.2-0.7)
      const shineDelay = Math.random() * 10; // Random shine timing (0-5s)
      
      houses.push(
        <div 
          key={`house-${i}`}
          className="absolute animate-float"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity,
            animationDuration: `${floatDuration}s`,
            animationDelay: `${floatDelay}s`,
            color: '#93c5fd'
          }}
        >
          <FaHouse 
            className="w-full h-full animate-shine-pulse" 
            style={{
              animationDelay: `${shineDelay}s`
            }}
          />
        </div>
      );
    }
    return houses;
  }, []);

  const calcRent = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const base = price / 300;
      let total = base;
      total += base * (furnish === "fully" ? 0.06 : furnish === "semi" ? 0.04 : 0.02);
      total += Object.values(rooms).filter(Boolean).length * base * 0.03;
      if (parking) total += base * 0.04;
      if (prime) total += base * 0.05;
      setRent(Math.round(total));
      setIsCalculating(false);
    }, 1000); // 1 second loading delay
  };

  return (
    <div>
          <Navbar/>
            <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
   
      {floatingHouses}
      
      {/* Main Calculator Card */}
      <div className="relative max-w-lg mx-auto p-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
          Rent Calculator
        </h1>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* House Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1 text-blue-700">
              House Price (₹)
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              className="w-full border border-blue-200 rounded-md px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-300 
                         hover:border-blue-400 transition bg-white bg-opacity-70"
            />
          </div>

          {/* Furnishing */}
          <div>
            <label htmlFor="furnish" className="block text-sm font-medium mb-1 text-blue-700">
              Furnishing
            </label>
            <select
              id="furnish"
              value={furnish}
              onChange={(e) => setFurnish(e.target.value)}
              className="w-full border border-blue-200 rounded-md px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-300 
                         hover:border-blue-400 transition bg-white bg-opacity-70"
            >
              <option value="non">Non‑Furnished</option>
              <option value="semi">Semi‑Furnished</option>
              <option value="fully">Fully Furnished</option>
            </select>
          </div>

          {/* Extra Rooms */}
          <fieldset className="sm:col-span-2 border border-blue-200 rounded-lg p-3">
            <legend className="text-sm font-medium mb-2 px-2 text-blue-700">Extra Rooms</legend>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(rooms).map((room) => (
                <label
                  key={room}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 rounded p-1 transition"
                >
                  <input
                    type="checkbox"
                    checked={rooms[room]}
                    onChange={() =>
                      setRooms({ ...rooms, [room]: !rooms[room] })
                    }
                    className="h-4 w-4 text-blue-600 border-blue-300 rounded 
                               focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-1">
                    <FaHouse className="h-5 w-5 text-blue-500" />
                    <span className="capitalize text-blue-700">{room} room</span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Parking */}
          <label className="flex items-center space-x-2 hover:bg-blue-50 rounded p-1 transition">
            <input
              type="checkbox"
              checked={parking}
              onChange={() => setParking(!parking)}
              className="h-4 w-4 text-blue-600 border-blue-300 rounded 
                         focus:ring-blue-500"
            />
            <span className="text-blue-700">Parking Available</span>
          </label>

          {/* Prime Location */}
          <label className="flex items-center space-x-2 hover:bg-blue-50 rounded p-1 transition">
            <input
              type="checkbox"
              checked={prime}
              onChange={() => setPrime(!prime)}
              className="h-4 w-4 text-blue-600 border-blue-300 rounded 
                         focus:ring-blue-500"
            />
            <span className="text-blue-700">Prime Location</span>
          </label>
        </div>

        <button
          onClick={calcRent}
          disabled={isCalculating}
          className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md 
                     hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 
                     focus:ring-blue-300 transition font-medium shadow-lg transform hover:scale-105
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isCalculating ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </div>
          ) : (
            "Calculate Rent"
          )}
        </button>

        {rent !== null && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
            <p className="text-center text-2xl font-semibold text-blue-700">
              Estimated Rent: <span className="text-blue-800">₹{rent}/month</span>
            </p>
          </div>
        )}
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(-100vh) rotate(360deg) scale(1);
          }
        }
        @keyframes shine-pulse {
          0%, 40%, 80%, 100% {
            filter: drop-shadow(0 0 2px rgba(147, 197, 253, 0.3));
            transform: scale(1);
            opacity: 0.7;
          }
          20%, 60% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
            transform: scale(1.1);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-shine-pulse {
          animation: shine-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
    </div>

  );
}