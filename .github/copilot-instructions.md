# Revolt Bike Price Search - Development Instructions

This is a full-stack application for searching Revolt bike prices by Hub Name.

## Project Structure
- `server/` - Node.js/Express backend with Excel data handling
- `client/` - React frontend with modern UI
- `data/` - Excel database file with bike pricing data

## Setup & Running

### Prerequisites
- Node.js v14+ and npm
- Excel file with bike pricing data (see sample format below)

### Installation
1. Install server dependencies: `cd server && npm install`
2. Install client dependencies: `cd client && npm install`

### Running Locally
1. Start backend: `cd server && npm start` (runs on http://localhost:5000)
2. Start frontend: `cd client && npm start` (runs on http://localhost:3000)

### Excel File Structure
Place your Excel file in `server/data/bikes.xlsx` with columns:
- State
- City
- Hub Name
- Model
- Ex-Showroom Price
- On-Road Price

## Key Features
- Case-insensitive Hub Name search
- Fast Excel data filtering
- Mobile responsive UI
- Real-time search results
- Error handling for missing data

## Deployment
- **Vercel** (Frontend): Push `client/` directory to Vercel
- **Render** (Backend): Deploy `server/` node app to Render
- Set EXCEL_FILE environment variable for backend
