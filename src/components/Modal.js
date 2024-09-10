import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "modal-background") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-background"
      className="absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50 "
    >
      <div className=" relative  mx-auto flex flex-col items-center max-w-md ">
        <div className="w-full relative">
          <img src="/board-header.png" alt="Header" className="w-full h-auto" />
          <h1 className="absolute top-5 text-xl font-bold w-full text-center ">
            {title}
          </h1>
          <button
            className=" absolute size-10 flex items-center justify-center top-0 right-0 bg-red-600 text-white rounded-full -translate-x-1/2 mr-2 -translate-y-1/2 mt-3"
            onClick={onClose}
          >
            <FiX className=" size-6" />
          </button>
        </div>

        <div className="w-full min-h-[300px] bg-[url('/board-content.png')] bg-repeat-y bg-contain">
          <div className="flex px-8">{children}</div>
        </div>

        <div className="w-full relative">
          <img src="/board-footer.png" alt="Footer" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
