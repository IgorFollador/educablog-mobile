interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button onClick={onConfirm} className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
