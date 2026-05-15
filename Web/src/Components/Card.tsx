import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent) => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  padding = 'medium',
  onClick
}) => {
  const paddingMap = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-8',
    large: 'p-10 md:p-12'
  };

  const baseStyles = "bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm";
  const hoverStyles = hoverable ? "hover:shadow-md transition-shadow cursor-default" : "";
  const paddingStyles = paddingMap[padding];

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
