import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium">Help & Tips</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Search Tips</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use quotes ("") for exact phrase searches</li>
              <li>Add site: to search specific websites (e.g., site:edu)</li>
              <li>Use - to exclude words (e.g., research -marketing)</li>
              <li>Add filetype: to search for specific file types (e.g., filetype:pdf)</li>
              <li>Use * as a wildcard for unknown words</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Press / to focus search</div>
              <div>Esc to clear search</div>
              <div>Alt+N for next page</div>
              <div>Alt+P for previous page</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">About This Portal</h4>
            <p className="text-sm">
              This research portal provides a lightweight, fast interface for academic and general research. It's designed to be minimal and efficient, focusing on delivering high-quality search results without unnecessary features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
