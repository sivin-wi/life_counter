/// <reference types="../types/electron" />

import React, { useState, useEffect } from 'react';
import { Clock, Settings, Play, Pause, Calendar } from 'lucide-react';
import Counter from '../components/Counter';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function App() {
  const [targetDate, setTargetDate] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('12:00');
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [autoLaunch, setAutoLaunch] = useState(false);

  useEffect(() => {
    // Load auto-launch status
    if (window.electron) {
      window.electron.getAutoLaunch().then(setAutoLaunch);
    }
  }, []);

  useEffect(() => {
    if (!isRunning || !targetDate) return;

    const interval = setInterval(() => {
      const target = new Date(`${targetDate}T${targetTime}`).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsRunning(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, targetDate, targetTime]);

  const handleStart = () => {
    if (targetDate) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(null);
  };

  const handleAutoLaunchToggle = async () => {
    if (window.electron) {
      const newValue = !autoLaunch;
      await window.electron.setAutoLaunch(newValue);
      setAutoLaunch(newValue);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <Clock className="w-12 h-12 text-blue-400 mr-3 animate-pulse" />
            <h1 className="text-4xl font-bold text-white">Countdown Timer</h1>
          </div>

          {/* Date/Time Inputs */}
          {!isRunning && (
            <div className="space-y-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="flex items-center text-white/90 text-sm font-medium mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Target Date & Time
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:outline-none backdrop-blur-sm"
                  />
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400/50 focus:outline-none backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Countdown Display */}
          {timeLeft && (
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-4 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <Counter 
                        value={timeLeft.days} 
                        places={[10, 1]} 
                        fontSize={56} 
                        textColor="#ffffff" 
                        fontWeight={900}
                        padding={8}
                        gap={4}
                        gradientFrom="transparent"
                        gradientTo="transparent"
                      />
                    </div>
                    <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Days</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <Counter 
                        value={timeLeft.hours} 
                        places={[10, 1]} 
                        fontSize={56} 
                        textColor="#ffffff" 
                        fontWeight={900}
                        padding={8}
                        gap={4}
                        gradientFrom="transparent"
                        gradientTo="transparent"
                      />
                    </div>
                    <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Hours</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <Counter 
                        value={timeLeft.minutes} 
                        places={[10, 1]} 
                        fontSize={56} 
                        textColor="#ffffff" 
                        fontWeight={900}
                        padding={8}
                        gap={4}
                        gradientFrom="transparent"
                        gradientTo="transparent"
                      />
                    </div>
                    <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Minutes</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <Counter 
                        value={timeLeft.seconds} 
                        places={[10, 1]} 
                        fontSize={56} 
                        textColor="#ffffff" 
                        fontWeight={900}
                        padding={8}
                        gap={4}
                        gradientFrom="transparent"
                        gradientTo="transparent"
                      />
                    </div>
                    <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Seconds</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-4 mb-6">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={!targetDate}
                className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 disabled:hover:bg-white/10"
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Start Countdown
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Pause className="w-6 h-6 mr-2" />
                Stop
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-white/80 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-white/90 font-medium">Launch on Startup</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoLaunch}
                  onChange={handleAutoLaunchToggle}
                  className="sr-only"
                />
                <div
                  className={`block w-14 h-7 rounded-full transition-all duration-300 ${
                    autoLaunch ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-lg ${
                      autoLaunch ? 'translate-x-7' : ''
                    }`}
                  />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;