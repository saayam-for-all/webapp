import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { IoMdInformationCircle } from "react-icons/io";
import { moreInformationChat } from "../../../services/requestServices";
import i18n from "../../i18n/i18n";

const MAX_QUESTIONS = 5;

// TODO: replace stub with real API when endpoint is provided
async function translateText(text /*, targetLang */) {
  // return await translationService.translate(text, targetLang);
  return text; // passthrough until endpoint available
}

// TODO: replace hardcoded defaults with dynamic user_id and req_id
const buildPayload = (requestData, loggedInUserId) => ({
  user_id:
    requestData?.requesterId ||
    requestData?.requester_id ||
    requestData?.userId ||
    requestData?.user_id ||
    loggedInUserId,
  req_id: requestData?.requestId || requestData?.req_id || requestData?.id,
});

const counterColorClass = (remaining) => {
  if (remaining >= 3) return "bg-green-500";
  if (remaining === 2) return "bg-yellow-400";
  if (remaining === 1) return "bg-red-500";
  return "bg-gray-400";
};

const MoreInfoChatModal = ({
  show,
  onClose,
  requestData,
  initialResponse,
  isInitialLoading = false,
}) => {
  const [messages, setMessages] = useState([]);
  const [remaining, setRemaining] = useState(MAX_QUESTIONS);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Reset chat state on open; seed initial AI message once it arrives.
  useEffect(() => {
    if (show) {
      setMessages(
        initialResponse
          ? [{ role: "assistant", content: initialResponse }]
          : [],
      );
      setRemaining(MAX_QUESTIONS);
      setInputText("");
    }
  }, [show, initialResponse]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isInitialLoading]);

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
        conversation_history: nextMessages,
      };
      const rawReply = await moreInformationChat(payload);
      const aiReply = rawReply?.body?.answer ?? "";
      const localizedReply = needsTranslation
        ? await translateText(aiReply, i18n.language)
        : aiReply;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: localizedReply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred while fetching the response.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setRemaining((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    const hasAskedQuestion = remaining < MAX_QUESTIONS;

    if (hasAskedQuestion) {
      const requestId =
        requestData?.requestId ||
        requestData?.req_id ||
        requestData?.id ||
        "default";

      const key = `moreInfoCooldown_${requestId}`;

      localStorage.setItem(
        key,
        JSON.stringify({
          expiresAt: Date.now() + 30 * 60 * 1000,
        }),
      );
    }
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
                {msg.role === "assistant" ? (
                  <Markdown>{msg.content}</Markdown>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {(isInitialLoading || isLoading) && (
            <div
              className="flex justify-start"
              role="status"
              aria-live="polite"
            >
              <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-none text-sm italic flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
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
        <div className="border-t border-gray-200 p-3 flex gap-2 items-end">
          <textarea
            value={inputText}
            onChange={(e) => {
              if (e.target.value.length <= 250) setInputText(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={remaining === 0 || isLoading || isInitialLoading}
            rows={3}
            maxLength={250}
            placeholder={
              isInitialLoading
                ? "Loading initial response…"
                : remaining === 0
                  ? "No questions remaining"
                  : "Ask a follow-up question… (max 250 characters)"
            }
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          />
          <button
            onClick={handleSend}
            disabled={
              remaining === 0 ||
              isLoading ||
              isInitialLoading ||
              !inputText.trim()
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>

        {/* AI disclaimer */}
        <div
          className="flex items-start gap-2 mx-3 mb-3 p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
          role="alert"
        >
          <IoMdInformationCircle size={18} className="shrink-0 mt-0.5" />
          <span>
            Responses are AI-generated and may be inaccurate. Please verify
            important information.
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoChatModal;
