import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!name || !age || !topic) return;

    setMessages(prev => [
      ...prev,
      { sender: "user", text: topic }
    ]);

    setTopic("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5678/webhook-test/edu-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, topic })
      });

      const data = await res.json();
      const cleanText = data.text || JSON.stringify(data, null, 2);

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: cleanText }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error. Try again." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold text-center">
          Educational AI Chatbot
        </h1>
      </header>

      {/* Student Info */}
      <div className="flex justify-center gap-2 p-4 bg-white">
        <input
          className="w-1/2 border rounded px-2 py-1"
          placeholder="Student Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-1/2 border rounded px-2 py-1"
          type="number"
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col-reverse">
          {loading && (
            <div className="text-left text-sm text-gray-400 mb-2">
              Thinking...
            </div>
          )}
          {messages.slice().reverse().map((m, i) => (
            <div
              key={i}
              className={`mb-2 ${
                m.sender === "user"
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  m.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder="Enter topic (e.g. Plants)"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            onClick={sendMessage}
          )
        </div>
      </div>
    </div>
  );
}