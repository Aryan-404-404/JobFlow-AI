import toast from 'react-hot-toast';
import { Chrome, Info, X } from 'lucide-react';

// CamelCase naming because it is a helper function, not a Component
export const handleDownload = () => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="shrink-0 pt-0.5">
            <Chrome className="h-10 w-10 text-blue-600" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Extension in Private Beta
            </p>
            <p className="mt-1 text-sm text-gray-500">
              JobFlow is currently pending 
              <span className="font-medium text-gray-700"> Chrome Web Store </span> 
              review.
            </p>
            
            <div className="mt-3 flex items-center gap-1.5 w-fit bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
              <Info size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Developer Preview Mode
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-center',
  });
};