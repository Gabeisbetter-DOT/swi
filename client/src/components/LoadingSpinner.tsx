import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="mt-10 flex justify-center">
      <div className="loader h-10 w-10 border-4 border-gray-200 rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
