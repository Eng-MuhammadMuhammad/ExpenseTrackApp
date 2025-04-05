import React from 'react';

const ExpenseItemForm = ({ 
  index,
  item,
  onChange,
  onRemove,
  isRemovable = true
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, name, value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 p-4 border border-gray-200 rounded-md mb-3 bg-gray-50">
      <div className="flex-grow">
        <label htmlFor={`item-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
          Item Name
        </label>
        <input 
          type="text" 
          id={`item-name-${index}`} 
          name="name" 
          value={item.name || ''}
          onChange={handleChange}
          placeholder="Enter item name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="md:w-1/3">
        <label htmlFor={`item-price-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
          Price (SP)
        </label>
        <input 
          type="number" 
          id={`item-price-${index}`} 
          name="price" 
          value={item.price || ''}
          onChange={handleChange}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {isRemovable && (
        <div className="flex items-end md:ml-2 mb-1">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseItemForm;
