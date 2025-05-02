import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-4 bg-gray-100 text-sm text-gray-600 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between">
        <div className="mb-2 sm:mb-0">
          <p>&copy; {new Date().getFullYear()} Research Portal. For educational purposes only.</p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Feedback</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
