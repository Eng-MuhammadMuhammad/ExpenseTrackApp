import React from 'react';

const AddExpense = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Expense</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Items</h2>
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-grow">
                  <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input 
                    type="text" 
                    id="item-name" 
                    name="item-name" 
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:w-1/3">
                  <label htmlFor="item-price" className="block text-sm font-medium text-gray-700 mb-1">Price (SP)</label>
                  <input 
                    type="number" 
                    id="item-price" 
                    name="item-price" 
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <button 
              type="button"
              className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Add Another Item
            </button>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
