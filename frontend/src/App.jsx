import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './index.css';

// Get API URL from environment variable, with fallback to deployed backend
const getApiUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'https://jubilant-courage-production-b9db.up.railway.app';
  // Remove trailing slash if present
  return url.replace(/\/$/, '');
};

const API_BASE_URL = getApiUrl();

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('date_desc');

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (sortOrder) {
        params.append('sort', sortOrder);
      }
      
      const response = await fetch(`${API_BASE_URL}/expenses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortOrder]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories]);

  const handleExpenseAdded = () => {
    fetchExpenses();
    fetchCategories();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Personal Expense Tracker</h1>
        <p>Track and manage your expenses</p>
      </div>

      <ExpenseForm 
        onExpenseAdded={handleExpenseAdded}
        categories={categories}
        apiUrl={API_BASE_URL}
      />

      <ExpenseList
        expenses={expenses}
        loading={loading}
        error={error}
        categories={categories}
        selectedCategory={selectedCategory}
        sortOrder={sortOrder}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortOrder}
      />
    </div>
  );
}

export default App;

