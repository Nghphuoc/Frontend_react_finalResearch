import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
const ChatBot = () => {
  const botConnection = useRef(null);

  // Tạo và cấu hình kết nối với Bot
  useEffect(() => {
    const [data,setData] = useState('');
    setData="tìm cho tôi laptop dell";
    const response = axios.post(
      data,
      "http://localhost:5005/webhooks/rest/webhook"
    );
  }, []);

  return (
    <div>
      <div id="webchat" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default ChatBot;
