const StoreTypes = ({ stores = [], setStore }) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      {stores.map((store) => (
        <label
          htmlFor={`file-type-${store.key}`}
          className="flex items-center border p-4 rounded-md"
          key={store.key}
        >
          <input
            id={`file-type-${store.key}`}
            type="radio"
            value={store.key}
            name="fileType"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            checked={store.checked}
            onChange={() => setStore(store.key)}
          />
          <p className="ms-2 text-sm font-medium text-gray-900">{store.name}</p>
        </label>
      ))}
    </div>
  );
};

export default StoreTypes;
