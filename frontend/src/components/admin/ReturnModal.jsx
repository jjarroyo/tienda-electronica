import React from 'react';
import { FaTimes } from 'react-icons/fa';

function ReturnModal({ isOpen, onClose, orderId, onConfirmAction }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Gestionar Orden #{orderId}</h2>
                    <button onClick={onClose}><FaTimes /></button>
                </div>
                <p className="mb-6">Selecciona la acción que deseas realizar:</p>
                <div className="flex flex-col space-y-3">
                    <button 
                        onClick={() => onConfirmAction('returnAndDelete')}
                        className="bg-red-600 text-white p-2 rounded hover:bg-red-700">
                        Devolver Inventario y Eliminar Orden
                    </button>
                    <button 
                        onClick={() => onConfirmAction('returnAndMark')}
                        className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700">
                        Devolver Inventario y Marcar como Devuelta
                    </button>
                    <button 
                        onClick={() => onConfirmAction('markOnly')}
                        className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700">
                        Solo Marcar como Devuelta (Defectuoso/No reponer)
                    </button>
                    <button 
                        onClick={onClose}
                        className="mt-4 text-gray-600 p-2 rounded border hover:bg-gray-100">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReturnModal;