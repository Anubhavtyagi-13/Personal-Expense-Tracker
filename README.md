# Personal Expense Tracker

A full-stack personal finance application for tracking and managing expenses. Built with FastAPI (Python) backend and React.js frontend, using PostgreSQL for data persistence.

## Features

- ✅ Create expense entries with amount, category, description, and date
- ✅ View list of all expenses
- ✅ Filter expenses by category
- ✅ Sort expenses by date (newest/oldest first)
- ✅ Display total amount of currently visible expenses
- ✅ Idempotent API design to handle retries and network issues
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database (hosted on Neon)
- **Pydantic** - Data validation and serialization

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client (via fetch API)
- **CSS3** - Styling

## Project Structure

```
Personal-Expense-Tracker/
├── backend/
│   ├── main.py           # FastAPI application and routes
│   ├── models.py         # Pydantic models for validation
│   ├── database.py       # Database connection and SQLAlchemy models
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.js    # Form to add new expenses
│   │   │   └── ExpenseList.js    # List view with filtering/sorting
│   │   ├── App.js                # Main application component
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   └── package.json      # Node.js dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
   - The database connection string is already configured in `database.py`
   - You can override it by setting the `DATABASE_URL` environment variable

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation (Swagger UI) at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:8000):
```bash
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### POST /expenses
Create a new expense entry.

**Request Body:**
```json
{
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": 100.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00"
}
```

### GET /expenses
Get list of expenses with optional filtering and sorting.

**Query Parameters:**
- `category` (optional): Filter by category name
- `sort` (optional): Sort order - `date_desc` (newest first) or `date_asc` (oldest first)

**Example:**
```
GET /expenses?category=Food&sort=date_desc
```

### GET /expenses/categories
Get list of all unique categories.

**Response:**
```json
{
  "categories": ["Food", "Transport", "Entertainment"]
}
```

## Key Design Decisions

### 1. Database Choice: PostgreSQL
- **Why**: Production-ready relational database with ACID guarantees
- **Trade-off**: Requires external database setup vs. SQLite (but provides better scalability and data integrity)
- **Neon**: Chosen for managed PostgreSQL hosting with connection pooling

### 2. Idempotency Handling
- **Implementation**: Duplicate detection based on amount, category, description, and date within a 5-second window
- **Why**: Prevents duplicate expenses from retries, page refreshes, or multiple clicks
- **Trade-off**: Simple time-based approach vs. more complex idempotency keys (sufficient for this use case)

### 3. Money Handling
- **Implementation**: Using `Decimal` type in Python and `Numeric(10, 2)` in database
- **Why**: Avoids floating-point precision issues with currency
- **Frontend**: Uses `parseFloat` for calculations (acceptable for display, but backend handles precision)

### 4. API Design
- **RESTful**: Standard REST endpoints for clarity
- **CORS**: Enabled for frontend-backend communication
- **Error Handling**: Comprehensive error responses with meaningful messages

### 5. Frontend State Management
- **Implementation**: React hooks (useState, useEffect) - no external state management
- **Why**: Simple and sufficient for this application size
- **Trade-off**: Could use Redux/Context API for larger apps, but adds complexity

### 6. Form Validation
- **Client-side**: Immediate feedback for better UX
- **Server-side**: Pydantic models ensure data integrity
- **Why**: Defense in depth - client validation for UX, server validation for security

### 7. Loading and Error States
- **Implementation**: Loading indicators and error messages throughout
- **Why**: Essential for handling unreliable networks and slow responses
- **User Experience**: Clear feedback prevents confusion and duplicate submissions

## Edge Cases Handled

1. **Multiple Submissions**: Button disabled during submission, idempotency check on backend
2. **Network Failures**: Error messages displayed, user can retry
3. **Page Refreshes**: Data persists in database, automatically reloaded
4. **Invalid Data**: Validation on both client and server
5. **Empty States**: Clear messages when no expenses exist
6. **Filter/Sort Changes**: Automatic refetch of data

## What Was Intentionally Not Done (Due to Time Constraints)

1. **Authentication/Authorization**: Single-user application, no auth needed
2. **Expense Editing/Deletion**: Focus on core CRUD (Create/Read) as per requirements
3. **Advanced Analytics**: Total per category mentioned as "nice to have" but not implemented
4. **Automated Tests**: Would add unit and integration tests in production
5. **Pagination**: Not needed for small datasets
6. **Export Functionality**: Could add CSV/PDF export in future
7. **Date Range Filtering**: Basic date sorting implemented, range filtering not added

## Future Enhancements

- Add expense editing and deletion
- Implement category-wise totals
- Add date range filtering
- Export to CSV/PDF
- Add charts and visualizations
- Implement user authentication for multi-user support
- Add expense tags for better organization
- Mobile-responsive improvements

## License

This project is created for educational/demonstration purposes.

