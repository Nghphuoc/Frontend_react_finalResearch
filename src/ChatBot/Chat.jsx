import { useState, useEffect, useRef, useCallback } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatHistory");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            sender: "bot",
            type: "text",
            text: "Xin chào! Tôi có thể giúp gì cho bạn?",
          },
        ];
  });
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "http://localhost:5005/webhooks/rest/webhook";
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const productDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: "user", type: "text", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "user", message: input }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error("API request failed");

      if (data.length > 0) {
        const message = data[0];
        let content;

        try {
          content = JSON.parse(message.text);
        } catch {
          content = message.text;
        }

        const botMessage = Array.isArray(content)
          ? {
              sender: "bot",
              type: "products",
              products: content.slice(0, 3),
            }
          : {
              sender: "bot",
              type: "text",
              text: content,
            };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: "⚠️ Lỗi kết nối với chatbot, vui lòng thử lại!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FaRobot size={24} />
        </button>
      ) : (
        <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white flex justify-between items-center p-3 rounded-t-lg">
            <h2 className="font-bold">Chat hỗ trợ</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-600 rounded-full p-1"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="p-4 text-gray-800 h-96 overflow-y-auto flex flex-col">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.type === "text" && msg.text}
                  {msg.type === "products" && (
                    <div className="space-y-2">
                      {msg.products.map((product) => (
                        <div
                          key={product.productId}
                          className="border rounded-lg p-2 bg-white"
                        >
                          <h3 className="font-semibold">
                            📦 {product.productName}
                          </h3>
                          <p className="text-sm line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-green-600 font-bold">
                              {new Intl.NumberFormat().format(product.price)} $
                            </span>
                            <img
                              src={product.imageUrl}
                              alt={product.productName}
                              className="w-12 h-12 rounded-md cursor-pointer object-cover"
                              onClick={() => productDetail(product.productId)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "..." : "Gửi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
// import { useState, useEffect } from "react";
// import { FaRobot, FaTimes } from "react-icons/fa";

// function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState(() => {
//     const savedMessages = sessionStorage.getItem("chatHistory");
//     return savedMessages
//       ? JSON.parse(savedMessages)
//       : [{ text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" }];
//   });
//   const [input, setInput] = useState("");

//   const API_URL = "http://localhost:5005/webhooks/rest/webhook";

//   useEffect(() => {
//     sessionStorage.setItem("chatHistory", JSON.stringify(messages));
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { text: input, sender: "user" }];
//     setMessages(newMessages);
//     setInput("");

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sender: "user", message: input }),
//       });

//       const data = await response.json();
//       if (data.length > 0) {
//         let botResponse;
//         try {
//           botResponse = JSON.parse(data[0].text);
//         } catch (error) {
//           botResponse = data[0].text;
//         }

//         if (Array.isArray(botResponse)) {
//           const product = botResponse[0];
//           setMessages([
//             ...newMessages,
//             {
//               text: `📌 ${product.productName} - 💰 ${product.price}$`,
//               sender: "bot",
//             },
//           ]);
//         } else {
//           setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
//         }
//       }
//     } catch (error) {
//       console.error("Lỗi khi gọi API:", error);
//       setMessages([
//         ...newMessages,
//         { text: "Bot đang gặp lỗi!", sender: "bot" },
//       ]);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 flex flex-col items-end z-50 p-2 sm:p-5">
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
//         >
//           <FaRobot className="text-2xl" />
//         </button>
//       )}

//       {isOpen && (
//         <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col">
//           <div className="bg-green-500 text-white flex justify-between items-center p-3 rounded-t-lg">
//             <span className="font-bold">Chat với bot</span>
//             <button onClick={() => setIsOpen(false)} className="p-1">
//               <FaTimes className="text-xl" />
//             </button>
//           </div>

//           <div className="p-4 text-gray-800 h-80 sm:h-96 overflow-y-auto flex flex-col">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`mb-2 p-2 rounded-lg max-w-[80%] ${
//                   msg.sender === "user"
//                     ? "bg-blue-500 text-white self-end"
//                     : "bg-gray-200 text-gray-800 self-start"
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-gray-300 p-2 flex">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Nhập nội dung..."
//               className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
//             />
//             <button
//               onClick={handleSendMessage}
//               className="bg-green-600 text-white px-3 py-2 rounded-lg ml-2 hover:bg-green-500 transition"
//             >
//               Gửi
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatBot;
