import React, { useState, useEffect, useRef } from 'react';
import './WhatsAppChatWidget.css';
import whatsapp from '../../images/whatsapp-icon.svg';
import profile from '../../images/whatsapp-profile.png';

const WhatsAppChatWidget = () => {
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat window visibility

  // Ref to track the chat window container
  const chatWindowRef = useRef(null);

  // Function to handle input changes
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Function to handle sending message via WhatsApp link
  const handleSendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message); // Encode message to make it URL-safe
      const phoneNumber = '+441273011626'; // Replace with your phone number (with country code, no '+' sign)
      const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(url, '_blank'); // Opens WhatsApp in a new tab
      setMessage(''); // Clear the message input
    }
  };

  // Toggle chat window visibility
  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Close chat window if clicked outside
  useEffect(() => {
    // Function to detect click outside of the chat window
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="whatsapp-chat-widget">
      {/* WhatsApp logo that opens the chat window */}
      {!isChatOpen ? (
        <div className="whatsapp-logo" onClick={toggleChatWindow}>
          <img src={whatsapp} alt="WhatsApp" className="whatsapp-icon" />
        </div>
      ) : (
        <div className="whatsapp-chat" ref={chatWindowRef}>
          <div className="whatsapp-header">
            <img
              src={profile}
              alt="Robin"
              className="avatar"
            />
            <div className="header-info">
              <div className="name">Robin</div>
              <div className="response-time">Response time: 2 minutes</div>
            </div>
            <div className="close-chat" onClick={toggleChatWindow}>X</div>
          </div>

          <div className="message">
            <span className="sender">Robin: </span>
            <span className="text">Hello, how can I help you? </span>
          </div>

          <div className="message-input">
            <textarea
              placeholder="Enter Your Message..."
              value={message}
              onChange={handleMessageChange}
            ></textarea>
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChatWidget;
