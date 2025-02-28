import { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { useEffect } from "react";
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  // const [messages, setMessages] = useState([
  //   { text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" },
  // ]);

    const [messages, setMessages] = useState(() => {
      // Lấy dữ liệu từ sessionStorage nếu có
      const savedMessages = sessionStorage.getItem("chatHistory");
      return savedMessages
        ? JSON.parse(savedMessages)
        : [{ text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" }];
    });

    
  const [input, setInput] = useState("");


  const API_URL = "http://localhost:5005/webhooks/rest/webhook"; // Đổi URL nếu cần


  useEffect(() => {
    // Lưu tin nhắn vào sessionStorage mỗi khi messages thay đổi
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Thêm tin nhắn người dùng vào giao diện
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      // Gửi tin nhắn đến Rasa
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: "user", message: input }),
      });

      const data = await response.json();

      // Lấy phản hồi từ bot và cập nhật vào giao diện
      if (data.length > 0) {
        try {
          // Kiểm tra xem có phải JSON không
          // const parsedResponse = JSON.parse(data[0].text);
          // console.log(parsedResponse);
          
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(data[0].text);
          } catch (error) {
            parsedResponse = data[0].text; // Nếu không phải JSON, giữ nguyên văn bản
          }
          // Nếu là mảng sản phẩm
          if (Array.isArray(parsedResponse)) {
            const product = parsedResponse[0]; // Lấy sản phẩm đầu tiên
            const message = (
              <>
                <p>
                  <strong>📌 {product.productName}</strong>
                </p>
                <p>📝 {product.description}</p>
                <p>
                  💰 Giá: <strong>{product.price}$</strong>
                </p>
                <p>📦 Tồn kho: {product.stock_quantity}</p>
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  style={{ width: "100px", borderRadius: "8px" }}
                />
              </>
            );

            // setMessages([
            //   ...newMessages,
            //   { text: message, sender: "bot", isHTML: true },
            // ]);
            setMessages([...newMessages, { text: message, sender: "bot" }]);

          } else {
            setMessages([
              ...newMessages,
              { text: data[0].text, sender: "bot" },
            ]);
          }
        } catch (error) {
          console.error("Lỗi khi parse JSON:", error);
          setMessages([...newMessages, { text: data[0].text, sender: "bot" }]);
        }
      }

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setMessages([
        ...newMessages,
        { text: "Bot đang gặp lỗi!", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50 p-5 mb-4">
      {/* Nút mở chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}

      {/* Hộp chat */}
      {isOpen && (
        <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white flex justify-between items-center p-3 rounded-t-lg">
            <span className="font-bold">Chat với bot</span>
            <button onClick={() => setIsOpen(false)} className="p-1">
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="p-4 text-gray-800 h-96 overflow-y-auto flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {msg.isHTML ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>

          {/* Ô nhập nội dung */}
          <div className="border-t border-gray-300 p-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập nội dung..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-600 text-white px-3 py-2 rounded-lg ml-2 hover:bg-green-500 transition"
            >
              Gửi
            </button>
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
