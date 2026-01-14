<<<<<<< HEAD
import React from "react";
=======
import React from 'react';
>>>>>>> origin/main

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

<<<<<<< HEAD
const Card: React.FC<CardProps> = ({ children, className = "" }) => {
=======
const Card: React.FC<CardProps> = ({ children, className = '' }) => {
>>>>>>> origin/main
  return (
    <div className={`bg-white rounded-lg shadow border p-4 ${className}`}>
      {children}
    </div>
  );
};

<<<<<<< HEAD
export default Card;
=======
export default Card;
>>>>>>> origin/main
