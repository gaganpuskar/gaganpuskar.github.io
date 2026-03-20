const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read Excel file
const workbook = XLSX.readFile('../data/bikes.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// Ensure all required columns exist with defaults
const enriched = data.map(row => ({
  'Hub Name': row['Hub Name'] || 'N/A',
  'State': row['State'] || 'N/A',
  'City': row['City'] || 'N/A',
  'Model': row['Model'] || 'N/A',
  'Ex-Showroom Price': row['Ex-Showroom Price'] || 0,
  'EMPS Benefit': row['EMPS Benefit'] || 0,
  'Additional Discount': row['Additional Discount'] || 0,
  'Net Ex-Showroom': row['Net Ex-Showroom'] || 0,
  'Insurance (1+5 Years Approx)': row['Insurance (1+5 Years Approx)'] || 0,
  '4G Connectivity': row['4G Connectivity'] || 'Yes',
  'RTO Fees': row['RTO Fees'] || 0,
  'HSRP (Number Plate)': row['HSRP (Number Plate)'] || 0,
  'Handling & Logistics': row['Handling & Logistics'] || 0,
  'Helmet': row['Helmet'] || 0,
  'Accessories': row['Accessories'] || 0,
  'On Road Price': row['On Road Price'] || 0
}));

// Write to JSON
fs.writeFileSync('../data/bikes.json', JSON.stringify(enriched, null, 2), { encoding: 'utf8' });
console.log(`Successfully converted ${enriched.length} records to JSON`);
