const ResourceContent = ({ setKaynak, claimResource }) => (
  <div className="mb-4 mx-auto mt-4">
    {/* <h2 className="text-xl font-bold mt-2 mb-2 text-black">
      Satın Alabileceğiniz
    </h2> */}
    <div className=" text-center">
      <img src="/kaynak2.png" className=" w-1/2 mx-auto h-auto" />
      <p className="text-sm p-2 text-justify mb-4">
        Resources are vital for developing your farm. You can turn barren land
        into fertile land with the resources you collect. Plant the items you’ve
        purchased on these fertile lands to increase your daily earnings. You
        can collect 1 resource every day.
      </p>
      <button
        onClick={() => claimResource()}
        className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
      >
        Claim +1 Resource
      </button>
    </div>
  </div>
);

export default ResourceContent;
