import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { moreInformationChat } from "../../../services/requestServices";
import i18n from "../../i18n/i18n";

const MAX_QUESTIONS = 5;

// TODO: replace stub with real API when endpoint is provided
async function translateText(text /*, targetLang */) {
  // return await translationService.translate(text, targetLang);
  return text; // passthrough until endpoint available
}

const buildPayload = (requestData) => ({
  category_id: requestData.category ?? "",
  subject: requestData.subject ?? "",
  description: requestData.description ?? "",
  location: requestData.location ?? "",
  gender: requestData.gender ?? "",
  age: requestData.age ?? "",
});

const counterColorClass = (remaining) => {
  if (remaining >= 3) return "bg-green-500";
  if (remaining === 2) return "bg-yellow-400";
  if (remaining === 1) return "bg-red-500";
  return "bg-gray-400";
};

const MoreInfoChatModal = ({ show, onClose, requestData, initialResponse }) => {
  const [messages, setMessages] = useState([]);
  const [remaining, setRemaining] = useState(MAX_QUESTIONS);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Seed initial AI message whenever initialResponse changes / modal opens
  useEffect(() => {
    if (show && initialResponse) {
      setMessages([{ role: "ai", content: initialResponse }]);
      setRemaining(MAX_QUESTIONS);
      setInputText("");
    }
  }, [show, initialResponse]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!show) return null;

  const needsTranslation = i18n.language !== "en-US" && i18n.language !== "en";

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || remaining <= 0 || isLoading) return;

    // Translate user input to English before sending
    const toSend = needsTranslation
      ? await translateText(trimmed, "en")
      : trimmed;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const payload = {
        ...buildPayload(requestData),
        chat_history: nextMessages,
        question: toSend,
      };
      const aiReply = await moreInformationChat(payload);
      const localizedReply = needsTranslation
        ? await translateText(aiReply, i18n.language)
        : aiReply;

      setMessages((prev) => [...prev, { role: "ai", content: localizedReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "An error occurred while fetching the response.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setRemaining((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    const key = `moreInfoCooldown_${requestData?.id ?? requestData?.subject ?? "default"}`;
    localStorage.setItem(
      key,
      JSON.stringify({ expiresAt: Date.now() + 30 * 60 * 1000 }),
    );
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col"
        style={{ height: "80vh" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            More Information
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`${counterColorClass(remaining)} text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center`}
              title={`${remaining} question${remaining !== 1 ? "s" : ""} remaining`}
            >
              {remaining}
            </span>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm prose prose-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.role === "ai" ? (
                  <Markdown>{msg.content}</Markdown>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-none text-sm italic">
                Thinking…
              </div>
            </div>
          )}

          {remaining === 0 && !isLoading && (
            <p className="text-center text-sm text-gray-400 mt-2">
              No questions remaining.
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-3 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={remaining === 0 || isLoading}
            placeholder={
              remaining === 0
                ? "No questions remaining"
                : "Ask a follow-up question…"
            }
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={remaining === 0 || isLoading || !inputText.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoChatModal;
