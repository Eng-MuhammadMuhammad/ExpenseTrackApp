import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createExpense } from "../firebase/expenseService";
import Button from "../components/Button";
import Card from "../components/Card";
import ExpenseItemForm from "../components/ExpenseItemForm";

const AddExpenseForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState([{ name: "", price: "" }]);
  const [formErrors, setFormErrors] = useState({
    date: "",
    items: [],
  });

  // Handle item change
  const handleItemChange = (index, name, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);

    // Clear error for this field if it exists
    if (formErrors.items[index] && formErrors.items[index][name]) {
      const newErrors = { ...formErrors };
      newErrors.items[index] = { ...newErrors.items[index], [name]: "" };
      setFormErrors(newErrors);
    }
  };

  // Add new item
  const handleAddItem = () => {
    setItems([...items, { name: "", price: "" }]);
    // Add empty error object for new item
    setFormErrors({
      ...formErrors,
      items: [...formErrors.items, {}],
    });
  };

  // Remove item
  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);

      // Remove error for this item
      const newErrors = { ...formErrors };
      newErrors.items.splice(index, 1);
      setFormErrors(newErrors);
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      date: "",
      items: items.map(() => ({ name: "", price: "" })),
    };

    // Validate date
    if (!date) {
      newErrors.date = "Date is required";
      valid = false;
    }

    // Validate items
    items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors.items[index].name = "Item name is required";
        valid = false;
      }

      if (!item.price) {
        newErrors.items[index].price = "Price is required";
        valid = false;
      } else if (isNaN(Number(item.price)) || Number(item.price) <= 0) {
        newErrors.items[index].price = "Price must be a positive number";
        valid = false;
      }
    });

    setFormErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error("You must be logged in to add expenses");
      }

      await createExpense(
        currentUser.uid,
        date,
        items.map((item) => ({
          name: item.name.trim(),
          price: Number(item.price),
        }))
      );

      setSuccess(true);
      // Reset form
      setDate(new Date().toISOString().split("T")[0]);
      setItems([{ name: "", price: "" }]);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Failed to add expense: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize form errors array
  useEffect(() => {
    setFormErrors({
      date: "",
      items: items.map(() => ({ name: "", price: "" })),
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Expense</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Expense added successfully! Redirecting to dashboard...
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 border ${
                formErrors.date ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {formErrors.date && (
              <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Items</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <ExpenseItemForm
                  key={index}
                  index={index}
                  item={item}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                  isRemovable={items.length > 1}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="mt-3"
            >
              + Add Another Item
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">
              Total:{" "}
              {items
                .reduce((sum, item) => sum + (Number(item.price) || 0), 0)
                .toLocaleString()}{" "}
              SP
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Expense"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpenseForm;
