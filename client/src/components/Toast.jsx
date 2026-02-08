import React from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

const Toast = ({ message, type = "success" }) => {
    const isError = type === "error";
    
    const styles = isError 
        ? "bg-red-600 border-red-500" 
        : "bg-green-600 border-green-500";

    const Icon = isError ? AlertCircle : CheckCircle;

    return (
        <div className={`${styles} border text-white rounded-lg shadow-lg p-3 min-w-80 flex items-center space-x-3 animate-slide-in fixed right-4 bottom-8 z-50`}>            
            <div className="shrink-0">
                <Icon size={20} />
            </div>
            
            <p className="flex-1 text-sm font-medium">
                {message}
            </p>
        </div>
    )
}

export default Toast