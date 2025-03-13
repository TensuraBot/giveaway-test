// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("default");
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/sessions2")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/names?sessionId=${currentSession}`)
      .then((res) => res.json())
      .then((data) => {
        setNames(data);
      });
  }, [currentSession]);

  const addName = async (e) => {
    e.preventDefault();
    if (!newName) return;
    const res = await fetch("/api/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: currentSession, name: newName }),
    });
    if (res.ok) {
      setNames((prev) => [...prev, newName]);
      setNewName("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl mb-6 text-blue-400 font-bold animate-fadeIn">Giveaway Names</h1>

      <div className="mb-4 w-full max-w-md">
        <label htmlFor="session" className="block mb-2 text-sm font-medium text-blue-400">
          Select Session:
        </label>
        <select
          id="session"
          value={currentSession}
          onChange={(e) => setCurrentSession(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:ring-blue-500 focus:border-blue-500"
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.id}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={addName} className="mb-6 w-full max-w-md flex">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 rounded-l bg-gray-800 border border-r-0 border-gray-700 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-r text-white font-semibold"
        >
          Submit
        </button>
      </form>

      <div className="w-full max-w-md">
        <h2 className="text-2xl mb-2 text-blue-400">Names List</h2>
        <ul className="bg-gray-800 p-4 rounded space-y-2 max-h-64 overflow-y-auto">
          {names.map((name, index) => (
            <li key={index} className="p-2 border-b border-gray-700 animate-slideIn">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
