const XLSX = require('xlsx');
const path = require('path');

// Path to Excel file - can be overridden by environment variable
const EXCEL_FILE = process.env.EXCEL_FILE || path.join(__dirname, '../../data/bikes.xlsx');

/**
 * Read Excel file and return parsed data
 */
function readExcelFile() {
  try {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error.message);
    throw new Error('Failed to read Excel file');
  }
}

/**
 * Search bikes by hub name (case-insensitive)
 * @param {string} hubName - Hub name to search for
 * @returns {Array} Array of matching bike records
 */
function searchByHubName(hubName) {
  try {
    const data = readExcelFile();
    const searchTerm = hubName.toLowerCase().trim();

    const results = data.filter(row => {
      const rowHubName = (row['Hub Name'] || '').toLowerCase().trim();
      return rowHubName === searchTerm;
    });

    // Format results for display with all columns
    return results.map(row => ({
      hubName: row['Hub Name'] || 'N/A',
      state: row['State'] || 'N/A',
      city: row['City'] || 'N/A',
      model: row['Model'] || 'N/A',
      exShowroomPrice: row['Ex-Showroom Price'] || 'N/A',
      empsBenefit: row['EMPS Benefit'] || 'N/A',
      additionalDiscount: row['Additional Discount'] || 'N/A',
      netExShowroom: row['Net Ex-Showroom'] || 'N/A',
      insurance: row['Insurance (1+5 Years Approx)'] || 'N/A',
      fourGConnectivity: row['4G Connectivity'] || 'N/A',
      rtoFees: row['RTO Fees'] || 'N/A',
      hsrp: row['HSRP (Number Plate)'] || 'N/A',
      handlingLogistics: row['Handling & Logistics'] || 'N/A',
      helmet: row['Helmet'] || 'N/A',
      accessories: row['Accessories'] || 'N/A',
      onRoadPrice: row['On Road Price'] || 'N/A'
    }));
  } catch (error) {
    console.error('Error in searchByHubName:', error);
    throw error;
  }
}

/**
 * Get all unique hub names from Excel file
 * @returns {Array} Array of unique hub names
 */
function getAllHubs() {
  try {
    const data = readExcelFile();
    const hubs = new Set();

    data.forEach(row => {
      if (row['Hub Name']) {
        hubs.add(row['Hub Name']);
      }
    });

    return Array.from(hubs).sort();
  } catch (error) {
    console.error('Error getting hubs:', error);
    throw error;
  }
}

/**
 * Get hub statistics
 * @returns {Object} Statistics about hubs and models
 */
function getStatistics() {
  try {
    const data = readExcelFile();
    const stats = {
      totalRecords: data.length,
      totalHubs: new Set(data.map(r => r['Hub Name'])).size,
      totalModels: new Set(data.map(r => r['Model'])).size,
      totalStates: new Set(data.map(r => r['State'])).size
    };
    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw error;
  }
}

module.exports = {
  readExcelFile,
  searchByHubName,
  getAllHubs,
  getStatistics
};
