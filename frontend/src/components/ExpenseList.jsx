import React, { useMemo } from 'react';

function ExpenseList({ 
  expenses, 
  loading, 
  error, 
  categories, 
  selectedCategory, 
  sortOrder,
  onCategoryChange,
  onSortChange 
}) {
  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.amount);
    }, 0);
  }, [expenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="expenses-section">
        <h2>Expenses</h2>
        <div className="loading">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expenses-section">
        <h2>Expenses</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="expenses-section">
      <h2>Expenses</h2>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-order">Sort by:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="total-section">
          Total: {formatCurrency(total)}
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="empty-state">
          {selectedCategory 
            ? `No expenses found for category "${selectedCategory}"`
            : 'No expenses yet. Add your first expense above!'}
        </div>
      ) : (
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{formatDate(expense.date)}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td style={{ textAlign: 'right', fontWeight: '500' }}>
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseList;

