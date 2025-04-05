import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getMonthlyExpenseSummary,
  getAnnualExpenseSummary,
  getUserExpenses,
} from "../firebase/expenseService";
import Card from "../components/Card";
import ExpenseSummaryChart from "../components/ExpenseSummaryChart";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [annualSummary, setAnnualSummary] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Get monthly summary for selected year
        const monthlyData = await getMonthlyExpenseSummary(
          currentUser.uid,
          selectedYear
        );
        setMonthlySummary(monthlyData);

        // Get annual summary for last 5 years
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 4;
        const annualData = await getAnnualExpenseSummary(
          currentUser.uid,
          startYear,
          currentYear
        );
        setAnnualSummary(annualData);

        // Get recent expenses
        const expenses = await getUserExpenses(currentUser.uid);
        setRecentExpenses(expenses.slice(0, 5)); // Get 5 most recent expenses

        // Calculate today's total
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          expenseDate.setHours(0, 0, 0, 0);
          return expenseDate.getTime() === today.getTime();
        });

        const todayTotal = todayExpenses.reduce(
          (sum, expense) => sum + expense.totalAmount,
          0
        );
        setTotalToday(todayTotal);
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, selectedYear]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString() + " SP";
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  };

  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    return monthlySummary[currentMonth] || 0;
  };

  const getYearTotal = () => {
    return monthlySummary.reduce((sum, amount) => sum + amount, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Expense Dashboard
        </h1>
        <div className="text-center py-8">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Expense Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Today's Expenses">
          {totalToday > 0 ? (
            <div className="text-2xl font-bold text-indigo-600">
              {formatCurrency(totalToday)}
            </div>
          ) : (
            <p className="text-gray-600">No expenses recorded today</p>
          )}
        </Card>

        <Card title={`${getMonthName(new Date().getMonth())} Total`}>
          {getCurrentMonthTotal() > 0 ? (
            <div className="text-2xl font-bold text-indigo-600">
              {formatCurrency(getCurrentMonthTotal())}
            </div>
          ) : (
            <p className="text-gray-600">No expenses this month</p>
          )}
        </Card>

        <Card title={`${selectedYear} Total`}>
          {getYearTotal() > 0 ? (
            <div className="text-2xl font-bold text-indigo-600">
              {formatCurrency(getYearTotal())}
            </div>
          ) : (
            <p className="text-gray-600">No expenses this year</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Monthly Expenses">
          <div className="mb-4">
            <label htmlFor="year-select" className="mr-2">
              Year:
            </label>
            <select
              id="year-select"
              className="px-2 py-1 border border-gray-300 rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            {monthlySummary.some((amount) => amount > 0) ? (
              <ExpenseSummaryChart
                data={monthlySummary}
                type="bar"
                title={`Monthly Expenses - ${selectedYear}`}
                timeframe="monthly"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for {selectedYear}
              </div>
            )}
          </div>
        </Card>

        <Card title="Annual Expenses">
          <div className="h-64">
            {annualSummary.some((item) => item.total > 0) ? (
              <ExpenseSummaryChart
                data={annualSummary}
                type="line"
                title="Annual Expenses Trend"
                timeframe="annual"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No annual data available
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Recent Expenses">
        {recentExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {expense.items
                        ? expense.items.map((item) => item.name).join(",")
                        : "No items"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(expense.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No recent expenses</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
