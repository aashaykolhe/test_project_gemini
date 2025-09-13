
import React from 'react';

interface StatusBarProps {
  inventory: string[];
  imageUrl: string;
  isImageLoading: boolean;
}

const ImageDisplay: React.FC<{ imageUrl: string; isImageLoading: boolean }> = ({ imageUrl, isImageLoading }) => {
  if (isImageLoading) {
    return (
      <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
      </div>
    );
  }

  return (
    <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
      <img src={imageUrl} alt="Current scene" className="w-full h-full object-cover" />
    </div>
  );
};


export const StatusBar: React.FC<StatusBarProps> = ({ inventory, imageUrl, isImageLoading }) => {
  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 p-6 bg-gray-900/50 border-l-2 border-gray-800 flex flex-col space-y-8">
      <h2 className="text-3xl font-bold text-gray-100 tracking-wider font-serif border-b-2 border-gray-700 pb-2">Status</h2>
      
      <ImageDisplay imageUrl={imageUrl} isImageLoading={isImageLoading} />

      <div>
        <h3 className="text-xl font-semibold text-gray-300 mb-4">Inventory</h3>
        <div className="bg-gray-800/70 p-4 rounded-lg min-h-[100px]">
          {inventory.length > 0 ? (
            <ul className="space-y-2">
              {inventory.map((item, index) => (
                <li key={index} className="text-cyan-300 capitalize">
                  - {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Your pockets are empty.</p>
          )}
        </div>
      </div>
    </aside>
  );
};
