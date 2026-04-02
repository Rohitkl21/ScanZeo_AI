import React from "react";
import { ScanResult, User } from "../types";

interface Props {
  user: User;
  history: ScanResult[];
  onStartScan: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<Props> = ({
  user,
  history,
  onStartScan,
  onLogout,
}) => {
  return (
    <div className="p-6 min-h-screen bg-black text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome 👋 {user.email}
        </h1>

        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Scan Button */}
      <button
        onClick={onStartScan}
        className="bg-[#CCFF00] text-black px-6 py-3 rounded-xl font-bold mb-6"
      >
        Start Scan
      </button>

      {/* History */}
      <h2 className="text-xl font-semibold mb-4">Your Scans</h2>

      {history.length === 0 ? (
        <p>No scans yet</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 p-4 rounded-lg"
            >
              <p className="text-sm text-zinc-400">
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <p className="mt-1">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};