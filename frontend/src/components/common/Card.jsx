import React from 'react';

export const Card = ({ children, className = '', glow = false, danger = false, success = false, onClick }) => {
  let baseStyle = 'cyber-card';
  if (glow) baseStyle = 'cyber-card-glow';
  if (danger) baseStyle = 'cyber-card-danger';
  if (success) baseStyle = 'cyber-card-success';

  return (
    <div 
      className={`rounded-xl p-5 transition-all duration-200 ${baseStyle} ${onClick ? 'cursor-pointer hover:border-slate-500/50 hover:shadow-lg' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
