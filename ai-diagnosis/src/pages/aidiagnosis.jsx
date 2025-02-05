import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const AiDiagnosis = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = user.uid; // Replace with the actual user ID
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/aidiagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: userMessage },
          { role: "assistant", content: data.message },
        ]);
      } else {
        console.error(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setUserMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="w-3/4 mx-auto mt-20 p-4 shadow-lg">
      <CardContent>
        <div
          className="messages space-y-2 mb-4 overflow-y-auto h-[600px]"
          // style={{ height: "500px" }}
        >
          {messages.map((msg, index) => ( 
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.role === "user"
                    ? "bg-[#0eff8a] text-black font-varelaround rounded-full px-4 py-2"
                    : "bg-gray-300 text-black font-varelaround rounded-xl p-3"
                } max-w-lg`}
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            className="font-varelaround flex-grow"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            className="font-varelaround"
            onClick={handleSendMessage}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiDiagnosis;
