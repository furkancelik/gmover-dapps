import Inventory from "../Inventory";
import InventoryItem from "./InventoryItem";

const HomeContent = ({
  inventory,
  setSelectedContent,
  selectedItem,
  setSelectedItem,
  kaynak,
  para,
  setInventory,
}) => {
  return (
    <div className="mb-4 mx-auto">
      <h2 className="text-xl font-bold mt-2 mb-1 text-black">
        About Your Farm
      </h2>
      <ul className="mb-4">
        <li className="flex flex-row">
          <div className="">Total Resources:</div>
          <span className="ml-1 font-bold text-center">{kaynak}</span>
        </li>
        <li className="flex flex-row">
          <div className="">Total GMOVE:</div>
          <span className="ml-1 font-bold text-center">{para}</span>
        </li>
        <li className="flex flex-row">
          <div className="">Average Farm Earnings:</div>
          <span className="ml-1 font-bold text-center">N/A</span>
        </li>
      </ul>

      <Inventory
        title={"Available Items"}
        inventory={inventory}
        setInventory={setInventory}
        setLoading={() => {
          ///setLoading
        }}
        selectedItem={selectedItem}
        onClick={(item) => {
          setSelectedItem((prevItem) => {
            return item === prevItem ? false : item;
          });
        }}
      />

      {/* <div
        className={`${
          inventory.length > 0 ? "grid  gap-3 grid-cols-4 mx-2" : ""
        }  `}
      >
        {inventory.length > 0 ? (
          12 - inventory.length > 0 &&
          Array(12 - inventory.length)
            .fill(null)
            .map((item, index) => (
              <div key={index} className="text-sm text-center font-semibold">
                <div
                  key={index}
                  className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40  relative `}
                >
                  <div className="size-11 "></div>
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-4">
              No available items. Please visit the market to purchase items.
            </p>
            <button
              onClick={() => {
                setSelectedContent("market");
              }}
              className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
            >
              Go to Market
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default HomeContent;
