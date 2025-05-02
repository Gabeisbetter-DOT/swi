import React, { useState } from 'react';
import { SearchSettings } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SearchSettings;
  onSaveSettings: (settings: SearchSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = useState<SearchSettings>(settings);

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

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
          <h3 className="text-lg font-medium">Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Search Settings</h4>
            <div className="flex items-center justify-between py-2">
              <span>Safe Search</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.safeSearch} 
                  onChange={e => setLocalSettings({...localSettings, safeSearch: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-g-blue"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Open results in new tab</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.openInNewTab} 
                  onChange={e => setLocalSettings({...localSettings, openInNewTab: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-g-blue"></div>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Display Settings</h4>
            <div className="py-2">
              <label className="block mb-2">Results per page</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={localSettings.resultsPerPage}
                onChange={e => setLocalSettings({...localSettings, resultsPerPage: Number(e.target.value)})}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="py-2">
              <label className="block mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className={`p-2 border rounded-md text-center ${localSettings.theme === 'light' ? 'border-g-blue' : 'border-gray-300'}`}
                  onClick={() => setLocalSettings({...localSettings, theme: 'light'})}
                >
                  Light
                </button>
                <button 
                  className={`p-2 border rounded-md text-center ${localSettings.theme === 'dark' ? 'border-g-blue' : 'border-gray-300'}`}
                  onClick={() => setLocalSettings({...localSettings, theme: 'dark'})}
                >
                  Dark
                </button>
                <button 
                  className={`p-2 border rounded-md text-center ${localSettings.theme === 'system' ? 'border-g-blue' : 'border-gray-300'}`}
                  onClick={() => setLocalSettings({...localSettings, theme: 'system'})}
                >
                  System
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-g-blue text-white rounded-md hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
