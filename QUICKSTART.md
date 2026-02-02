# Quick Start Guide

## Prerequisites
- Python 3.8+ installed
- Node.js 14+ and npm installed
- PostgreSQL database (already configured with Neon)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
# OR
uvicorn main:app --reload --port 8000
```

The backend API will be running at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### 2. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will automatically open at `http://localhost:3000`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Fill out the expense form:
   - Amount: Enter a positive number (e.g., 100.50)
   - Category: Enter a category (e.g., "Food", "Transport")
   - Description: Enter a description (e.g., "Lunch")
   - Date: Select a date
3. Click "Add Expense"
4. The expense should appear in the list below
5. Try filtering by category
6. Try sorting by date
7. Check the total amount displayed

## Troubleshooting

### Backend Issues

- **Database connection error**: Check that the DATABASE_URL in `database.py` is correct
- **Port already in use**: Change the port in `run.py` or use `--port 8001` with uvicorn
- **Module not found**: Make sure you're in the backend directory and virtual environment is activated

### Frontend Issues

- **Cannot connect to API**: 
  - Ensure backend is running on port 8000
  - Check `REACT_APP_API_URL` in `.env` file (or create one)
- **Port 3000 in use**: React will automatically try the next available port
- **npm install fails**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

## API Testing

You can test the API directly using the Swagger UI at `http://localhost:8000/docs` or using curl:

```bash
# Create an expense
curl -X POST "http://localhost:8000/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15"
  }'

# Get all expenses
curl "http://localhost:8000/expenses"

# Get expenses filtered by category
curl "http://localhost:8000/expenses?category=Food&sort=date_desc"
```

