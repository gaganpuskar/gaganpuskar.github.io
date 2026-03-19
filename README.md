# 🏍️ Revolt Bike Price Search

A full-stack web application for searching Revolt bike prices by Hub Name with real-time data from Excel.

## Features

- 🔍 Search bikes by Revolt Hub Name (case-insensitive)
- 📊 View detailed pricing including ex-showroom, on-road, insurance, and other charges
- 🎨 Beautiful responsive UI with gradient design
- ⚡ Fast Excel-based data search
- 🌐 Production-ready deployment

## Project Structure

```
revolt/
├── client/           # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/           # Express.js backend
│   ├── utils/
│   │   └── excelHandler.js
│   ├── index.js
│   └── package.json
├── data/             # Excel database
│   └── bikes.xlsx
├── .github/          # GitHub Actions workflows
├── render.yaml       # Render deployment config
├── Procfile          # Heroku/Render process file
└── package.json
```

## Local Development

### Prerequisites
- Node.js v14+
- npm or yarn

### Setup

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1: Start backend (port 5000)
cd server
npm start

# Terminal 2: Start frontend (port 3000)
cd client
npm start
```

Visit http://localhost:3000

## Deployment

### Frontend - GitHub Pages (gaganpuskar.me)

The frontend automatically deploys to GitHub Pages via GitHub Actions when you push to `main` branch.

**Trigger deployment:**
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

GitHub Actions will:
1. Build React app
2. Deploy to GitHub Pages
3. Update CNAME record

### Backend - Render.com

**Steps:**

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create new Web Service
4. Select the repository
5. Configure:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment:** Node
6. Add environment variables (if needed)
7. Deploy

**Backend will be live at:** `https://revolt-backend.onrender.com`

### Update API URL

If you deploy backend elsewhere, update in:
- `client/.env.production` - Change `REACT_APP_API_URL`
- `client/src/App.js` - Update `API_URL` constant

## API Endpoints

### `GET /api/search?hubName=<name>`
Search for bikes by hub name

**Query Parameters:**
- `hubName` (required) - Hub name to search for

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "hubName": "Revolt Hub Anna Nagar",
      "state": "Tamil Nadu",
      "city": "Chennai",
      "model": "RV1+",
      "exShowroomPrice": 109990,
      "onRoadPrice": 119022,
      ...other fields
    }
  ]
}
```

### `GET /api/hubs`
Get all unique hub names for autocomplete

**Response:**
```json
{
  "success": true,
  "data": ["Revolt Hub Anna Nagar", "Revolt Hub Jaipur", ...]
}
```

### `GET /api/health`
Server health check

## Excel Data Format

`data/bikes.xlsx` should have columns:
- Hub Name
- State
- City
- Model
- Ex-Showroom Price
- EMPS Benefit
- Additional Discount
- Net Ex-Showroom
- Insurance (1+5 Years Approx)
- 4G Connectivity
- RTO Fees
- HSRP (Number Plate)
- Handling & Logistics
- Helmet
- Accessories
- On Road Price

## Environment Variables

### Server (`.env`)
```
PORT=5000
NODE_ENV=production
EXCEL_FILE=../data/bikes.xlsx
```

### Client (`.env.production`)
```
REACT_APP_API_URL=https://revolt-backend.onrender.com
```

## Technology Stack

### Frontend
- React 18
- Axios (HTTP client)
- CSS3 (Gradients, animations)
- Responsive design

### Backend
- Node.js
- Express.js
- CORS support
- XLSX library for Excel parsing

## GitHub Actions Workflow

Automatic deployment to GitHub Pages on every push to `main`:
- `.github/workflows/deploy.yml`

## License

MIT

## Support

For issues or questions, contact: gaganpuskar@github.com
