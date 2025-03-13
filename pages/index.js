// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("default");
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/sessions")
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h1 className="text-4xl mb-4 text-sky-400 animate-fadeIn">Giveaway Names</h1>

      <div className="mb-4">
        <label htmlFor="session" className="mr-2">
          Select Session:
        </label>
        <select
          id="session"
          value={currentSession}
          onChange={(e) => setCurrentSession(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.id}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={addName} className="mb-4 flex">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter your name"
          className="p-2 rounded-l bg-gray-800 text-white outline-none"
        />
        <button
          type="submit"
          className="bg-sky-400 hover:bg-sky-500 transition-all duration-300 p-2 rounded-r"
        >
          Submit
        </button>
      </form>

      <div className="w-full max-w-md">
        <h2 className="text-2xl mb-2 text-sky-400">Names List</h2>
        <ul className="bg-gray-800 p-4 rounded space-y-2 max-h-64 overflow-y-auto">
          {names.map((name, index) => (
            <li key={index} className="p-2 border-b border-gray-700 animate-slideIn">
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p>Note: Only developer can copy the full list.</p>
      </div>
    </div>
  );
}
