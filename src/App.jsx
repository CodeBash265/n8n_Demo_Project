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
    <div className="h-screen bg-black text-white flex flex-col">
      
      {/* Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-center mb-4">Educational AI</h1>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="w-16 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "user" ? "bg-gray-800" : "bg-black"}>
            <div className="max-w-3xl mx-auto p-6 flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                m.sender === "user" ? "bg-blue-600" : "bg-green-600"
              }`}>
                {m.sender === "user" ? "U" : "AI"}
              </div>
              <div className="flex-1 whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-black">
            <div className="max-w-3xl mx-auto p-6 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">AI</div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3"
            placeholder="Ask about any topic..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}