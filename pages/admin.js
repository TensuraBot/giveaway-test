// pages/admin.js
import { useState, useEffect } from "react";

export default function Admin() {
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [password, setPassword] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("default");
  const [copySuccess, setCopySuccess] = useState("");
  const [names, setNames] = useState([]);

  useEffect(() => {
    if (isDeveloper) {
      fetch("/api/sessions2")
        .then((res) => res.json())
        .then((data) => {
          setSessions(data);
        });
    }
  }, [isDeveloper]);

  useEffect(() => {
    if (isDeveloper && selectedSession) {
      fetch(`/api/names?sessionId=${selectedSession}`)
        .then((res) => res.json())
        .then((data) => {
          setNames(data);
        });
    }
  }, [isDeveloper, selectedSession]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "dev123") {
      setIsDeveloper(true);
    } else {
      alert("Incorrect password");
    }
  };

  const copyNames = () => {
    const text = names.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const createSession = async () => {
    const sessionId = prompt("Enter new session ID:");
    if (sessionId) {
      const res = await fetch("/api/sessions2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer dev123",
        },
        body: JSON.stringify({ id: sessionId }),
      });
      if (res.ok) {
        alert("Session created");
        const data = await res.json();
        setSessions((prev) => [...prev, data]);
      } else {
        const err = await res.json();
        alert(err.error);
      }
    }
  };

  const deleteSession = async () => {
    if (!selectedSession) return;
    if (confirm(`Are you sure you want to delete session ${selectedSession}?`)) {
      const res = await fetch(`/api/sessions2/${selectedSession}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer dev123" },
      });
      if (res.ok) {
        alert("Session deleted");
        setSessions(sessions.filter((s) => s.id !== selectedSession));
        setSelectedSession("default");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    }
  };

  if (!isDeveloper) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
        <h1 className="text-3xl mb-6 text-blue-400">Developer Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mb-4 bg-gray-800 border border-gray-700 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded text-white font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl mb-6 text-blue-400 font-bold animate-fadeIn">Developer Dashboard</h1>

      <div className="mb-4 w-full max-w-md">
        <label htmlFor="session" className="block mb-2 text-sm font-medium text-blue-400">
          Select Session:
        </label>
        <select
          id="session"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:ring-blue-500 focus:border-blue-500"
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.id}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={copyNames}
          className="p-3 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded text-white font-semibold"
        >
          Copy Names
        </button>
        {copySuccess && <span className="self-center text-green-400">{copySuccess}</span>}
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={createSession}
          className="p-3 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded text-white font-semibold"
        >
          Create Session
        </button>
        <button
          onClick={deleteSession}
          className="p-3 bg-red-500 hover:bg-red-600 transition-all duration-300 rounded text-white font-semibold"
        >
          Delete Session
        </button>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-2xl mb-2 text-blue-400">Names in Session</h2>
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
