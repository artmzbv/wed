import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ book, value, type, onClick }) => {
  let path = '';

  // Define the link path based on the type of booking
  if (book && type === 'time') {
    path = '/book/time'; // Book a time slot
  } else if (!book && type === 'gift') {
    path = '/book/gift'; // Parent path for gift booking
  } else if (!book && type === 'physical gift') {
    path = '/book/gift/physical'; // Physical gift booking
  } else if (!book && type === 'digital gift') {
    path = '/book/gift/digital'; // Digital gift booking
  }

  return (
    <Link to={path} className={`button ${book ? 'button__book-time' : 'button__book-gift'}`} onClick={onClick}>
      {value}
    </Link>
  );
};

export default Button;
