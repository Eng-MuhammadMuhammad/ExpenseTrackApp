import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserExpenses, deleteExpense } from "../firebase/expenseService";
import ExpenseList from "../components/ExpenseList";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const ExpenseHistoryPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    expenseId: null,
  });
  const [timeFilter, setTimeFilter] = useState("all");

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userExpenses = await getUserExpenses(currentUser.uid);

        // Apply time filter if needed
        let filteredExpenses = userExpenses;
        if (timeFilter !== "all") {
          const now = new Date();
          let startDate;

          switch (timeFilter) {
            case "month":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case "year":
              startDate = new Date(now.getFullYear(), 0, 1);
              break;
            default:
              startDate = null;
          }

          if (startDate) {
            filteredExpenses = userExpenses.filter(
              (expense) => new Date(expense.date) >= startDate
            );
          }
        }

        setExpenses(filteredExpenses);
      } catch (err) {
        setError("Failed to load expenses: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [currentUser, timeFilter]);

  // Handle edit expense
  const handleEditExpense = (expenseId) => {
    navigate(`/edit/${expenseId}`);
  };

  // Handle delete expense
  const handleDeleteClick = (expenseId) => {
    setDeleteModal({ isOpen: true, expenseId });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpense(deleteModal.expenseId);
      setExpenses(
        expenses.filter((expense) => expense.id !== deleteModal.expenseId)
      );
      setDeleteModal({ isOpen: false, expenseId: null });
    } catch (err) {
      setError("Failed to delete expense: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">All Expenses</h2>
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Button onClick={() => navigate("/add")}>Add New</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading expenses...
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteClick}
          />
        )}
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, expenseId: null })}
        title="Confirm Delete"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, expenseId: null })}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this expense? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default ExpenseHistoryPage;
