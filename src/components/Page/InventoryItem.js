import { FaLock } from "react-icons/fa6";

const InventoryItem = ({ item, selectedItem, onClick }) => {
  return (
    <div className="text-sm text-center font-semibold">
      <div
        onClick={() => onClick(item)}
        className={`bg-[#cdaa6d] p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40 relative ${
          item.isLock && "opacity-80"
        } hover:bg-[#8adc53] transition-all duration-300 cursor-pointer ${
          selectedItem?.title === item.title && "!bg-[#5ea531]"
        }`}
      >
        {item.quantity > 1 && (
          <div className="absolute size-6 font-semibold flex items-center justify-center text-xs rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 mr-1 mt-1 bg-red-600 text-white">
            {item.quantity}
          </div>
        )}
        {item.isLock && (
          <FaLock color="#4f3c1c" className="size-8 absolute z-[1]" />
        )}
        <div>
          <img
            src={item.image}
            alt={item.title}
            className={`size-11 ${item.isLock && "opacity-50 grayscale"}`}
          />
        </div>
      </div>
      {item.title}
    </div>
  );
};

export default InventoryItem;
