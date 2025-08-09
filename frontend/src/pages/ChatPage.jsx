import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import ChatLoader from "../components/ChatLoader";
import { getSocketClient } from "../lib/socket";
import { getChatHistory } from "../lib/api";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const [isJoining, setIsJoining] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  const roomId = useMemo(() => {
    if (!authUser?._id || !targetUserId) return null;
    return [authUser._id, targetUserId].sort().join("-");
  }, [authUser?._id, targetUserId]);

  useEffect(() => {
    if (!authUser || !roomId) return;

    let isMounted = true;
    const socket = getSocketClient();

    const handleReceive = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const joinAndLoad = async () => {
      try {
        socket.emit("join-conversation", roomId);
        socket.on("receive-message", handleReceive);
        const history = await getChatHistory(roomId);
        if (isMounted && Array.isArray(history?.messages)) {
          setMessages(history.messages);
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      } finally {
        if (isMounted) setIsJoining(false);
      }
    };

    joinAndLoad();

    return () => {
      isMounted = false;
      socket.off("receive-message", handleReceive);
    };
  }, [authUser, roomId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !roomId || !authUser) return;

    const socket = getSocketClient();
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      roomId,
      from: authUser._id,
      text,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, message]);
    socket.emit("send-message", { roomId, message });
    setInput("");
  };

  if (isJoining || !authUser) return <ChatLoader />;

  return (
    <div className="h-[93vh] flex flex-col p-3">
      <div className="font-semibold mb-2">Chat</div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-2 p-2 bg-base-200 rounded"
      >
        {messages.map((m) => {
          const isMine = m.from === authUser._id;
          return (
            <div
              key={m.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg ${
                  isMine ? "bg-primary text-primary-content" : "bg-base-100"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {m.text}
                </div>
                <div className="text-[10px] opacity-60 mt-1">
                  {new Date(m.ts).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
