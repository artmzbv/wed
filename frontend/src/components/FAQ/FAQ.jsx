import React, { useState, useEffect } from 'react';
import './FAQ.css'; // Import the CSS file for styling

const FAQ = () => {
  // State to track which question is currently open
  const [openQuestion, setOpenQuestion] = useState(null);

  // List of FAQ items
  // const faqItems = [
  //   {
  //     question: "What is your refund policy?",
  //     answer: "Our refund policy allows for a full refund within 30 days of purchase."
  //   },
  //   {
  //     question: "Do you offer customer support?",
  //     answer: "Yes, we offer 24/7 customer support. You can reach us through email, phone, or chat."
  //   },
  //   {
  //     question: "How long does shipping take?",
  //     answer: "Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders."
  //   }
  // ];

    // State to store the fetched FAQ data
    const [faqs, setFaqs] = useState([]);

    // Fetch FAQ data from the backend
    useEffect(() => {
      const fetchFAQs = async () => {
        try {
          const response = await fetch('http://localhost:3000/portraits'); // Update the URL to match your backend endpoint
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json(); // Parse the JSON response
          setFaqs(data); // Update state with fetched FAQs
        } catch (error) {
          console.error("Failed to fetch FAQs:", error);
        }
      };

      fetchFAQs(); // Call the fetch function on component mount
    }, []); // Empty dependency array means this useEffect runs only once
  console.log(faqs)

  // Toggle function to open/close a question
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <h1 className="faq__title">FREQUENTLY ASKED QUESTIONS</h1>
      <div className="faq__container">
        {faqs.map((item, index) => (
          <div key={index} className="faq__item">
            <div className="faq__question" onClick={() => toggleQuestion(index)}>
              <h2>{item.Question}</h2>
              <span className={`faq__icon ${openQuestion === index ? 'faq__icon_open' : ''}`}>
                {openQuestion === index ? '-' : '+'}
              </span>
            </div>
            <div className={`faq__answer ${openQuestion === index ? 'faq__answer_visible' : ''}`}>
              <p>{item.Answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
