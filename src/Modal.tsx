import React from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    text: string;
    variant: 'error' | 'success';
}

const Modal: React.FC<ModalProps> = ({ show, onClose, text, variant }) => {
    if (!show) return null;

    const modalBgColor = variant === 'error' ? 'bg-red-100' : 'bg-green-100';
    const modalTextColor = variant === 'error' ? 'text-red-600' : 'text-green-600';
    const buttonBgColor = variant === 'error' ? 'bg-red-600' : 'bg-green-600';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className={`w-96 p-6 rounded-lg shadow-lg ${modalBgColor}`}>
                <p className={`text-lg font-semibold ${modalTextColor}`}>{text}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 text-white rounded ${buttonBgColor} hover:opacity-80`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
