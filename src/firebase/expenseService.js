import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Collection references
const expensesRef = collection(db, "expenses");
const expenseItemsRef = collection(db, "expenseItems");

// ========== EXPENSE FUNCTIONS ========== //

// Create a new expense with items
export const createExpense = async (userId, date, items) => {
  try {
    const batch = writeBatch(db);

    // Calculate total amount with validation
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price);
      if (isNaN(price)) throw new Error("Invalid item price");
      return sum + price;
    }, 0);

    // Create expense document
    const expenseRef = doc(expensesRef);
    const expenseData = {
      userId,
      date: Timestamp.fromDate(new Date(date)),
      totalAmount,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    batch.set(expenseRef, expenseData);

    // Add all expense items
    items.forEach((item) => {
      const itemRef = doc(expenseItemsRef);
      batch.set(itemRef, {
        expenseId: expenseRef.id,
        name: item.name.trim(),
        price: Number(item.price),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });

    await batch.commit();

    return {
      id: expenseRef.id,
      ...expenseData,
    };
  } catch (error) {
    console.error("Error creating expense: ", error);
    throw error;
  }
};

// Get all expenses for a user
export const getUserExpenses = async (userId) => {
  try {
    const q = query(
      expensesRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    // Fetch items for each expense
    const expensesWithItems = [];
    for (const doc of querySnapshot.docs) {
      const expenseData = {
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      };

      // Fetch the items for this expense using getExpenseItems
      const items = await getExpenseItems(expenseData.id);

      // Add the items to the expense data
      expensesWithItems.push({
        ...expenseData,
        items: items,
      });
    }

    return expensesWithItems;
  } catch (error) {
    console.error("Error getting expenses: ", error);
    throw error;
  }
};

// Get a single expense with its items
export const getExpenseWithItems = async (expenseId) => {
  try {
    // Get the expense document
    const expenseDoc = await getDoc(doc(db, "expenses", expenseId));

    if (!expenseDoc.exists()) {
      throw new Error("Expense not found");
    }

    const expense = {
      id: expenseDoc.id,
      ...doc.data(),
      date: expenseDoc.data().date.toDate(),
    };

    // Get the expense items
    const items = await getExpenseItems(expenseId);

    return {
      ...expense,
      items,
    };
  } catch (error) {
    console.error("Error getting expense with items: ", error);
    throw error;
  }
};

// Update an expense
export const updateExpense = async (expenseId, date, items) => {
  try {
    const batch = writeBatch(db);
    const expenseRef = doc(db, "expenses", expenseId);

    // Calculate new total amount
    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price);
      if (isNaN(price)) throw new Error("Invalid item price");
      return sum + price;
    }, 0);

    // Update expense document
    batch.update(expenseRef, {
      date: Timestamp.fromDate(new Date(date)),
      totalAmount,
      updatedAt: Timestamp.now(),
    });

    // Delete all existing items
    const existingItems = await getExpenseItems(expenseId);
    existingItems.forEach((item) => {
      batch.delete(doc(db, "expenseItems", item.id));
    });

    // Add new items
    items.forEach((item) => {
      const itemRef = doc(expenseItemsRef);
      batch.set(itemRef, {
        expenseId,
        name: item.name.trim(),
        price: Number(item.price),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });

    await batch.commit();

    return {
      id: expenseId,
      date,
      totalAmount,
      items,
    };
  } catch (error) {
    console.error("Error updating expense: ", error);
    throw error;
  }
};

// Delete an expense and its items
export const deleteExpense = async (expenseId) => {
  try {
    const batch = writeBatch(db);

    // Delete all items for this expense
    const items = await getExpenseItems(expenseId);
    items.forEach((item) => {
      batch.delete(doc(db, "expenseItems", item.id));
    });

    // Delete the expense
    batch.delete(doc(db, "expenses", expenseId));

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error deleting expense: ", error);
    throw error;
  }
};

// Get monthly summary for a user
export const getMonthlyExpenseSummary = async (userId, year) => {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const q = query(
      expensesRef,
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);

    // Initialize monthly totals
    const monthlySummary = Array(12).fill(0);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.date.toDate();
      const month = date.getMonth();
      monthlySummary[month] += data.totalAmount;
    });

    return monthlySummary;
  } catch (error) {
    console.error("Error getting monthly summary: ", error);
    throw error;
  }
};

// Get annual summary for a user
export const getAnnualExpenseSummary = async (userId, startYear, endYear) => {
  try {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31, 23, 59, 59);

    const q = query(
      expensesRef,
      where("userId", "==", userId),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate)),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);

    // Initialize yearly totals
    const yearCount = endYear - startYear + 1;
    const annualSummary = Array(yearCount).fill(0);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.date.toDate();
      const year = date.getFullYear();
      const index = year - startYear;
      annualSummary[index] += data.totalAmount;
    });

    return annualSummary.map((total, index) => ({
      year: startYear + index,
      total,
    }));
  } catch (error) {
    console.error("Error getting annual summary: ", error);
    throw error;
  }
};

// ========== EXPENSE ITEM FUNCTIONS ========== //

// Get expense items for a specific expense
export const getExpenseItems = async (expenseId) => {
  try {
    const q = query(expenseItemsRef, where("expenseId", "==", expenseId));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting expense items: ", error);
    throw error;
  }
};

// Add a new expense item
export const addExpenseItem = async (expenseId, name, price) => {
  try {
    const itemData = {
      expenseId,
      name: name.trim(),
      price: Number(price),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const itemRef = await addDoc(expenseItemsRef, itemData);

    return {
      id: itemRef.id,
      ...itemData,
    };
  } catch (error) {
    console.error("Error adding expense item: ", error);
    throw error;
  }
};

// Update an expense item
export const updateExpenseItem = async (itemId, updates) => {
  try {
    const itemRef = doc(db, "expenseItems", itemId);

    const validUpdates = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.price !== undefined) {
      validUpdates.price = Number(updates.price);
    }

    if (updates.name !== undefined) {
      validUpdates.name = updates.name.trim();
    }

    await updateDoc(itemRef, validUpdates);

    const updatedDoc = await getDoc(itemRef);

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };
  } catch (error) {
    console.error("Error updating expense item: ", error);
    throw error;
  }
};

// Delete an expense item
export const deleteExpenseItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, "expenseItems", itemId));
    return true;
  } catch (error) {
    console.error("Error deleting expense item: ", error);
    throw error;
  }
};
