import React from 'react';
import { Mail } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center animate-pulse">
        <div className="bg-sky-500 p-4 rounded-full mb-4 shadow-lg shadow-sky-200">
          <Mail className="size-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-sky-500 tracking-tight">YapYap</h1>
        <div className="mt-4 flex gap-1">
          <div className="size-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="size-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="size-2 bg-sky-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
