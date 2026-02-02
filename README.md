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
