import React from 'react';

function ResultsTable({ results }) {
  const formatPrice = (price) => {
    if (price === 'N/A') return 'N/A';
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Bikes Found: {results.length}</h2>
      </div>

      <div className="table-responsive">
        <table className="results-table">
          <thead>
            <tr>
              <th>Hub Name</th>
              <th>State</th>
              <th>City</th>
              <th>Model</th>
              <th>Ex-Showroom</th>
              <th>EMPS Benefit</th>
              <th>Additional Discount</th>
              <th>Net Ex-Showroom</th>
              <th>Insurance</th>
              <th>4G Connectivity</th>
              <th>RTO Fees</th>
              <th>HSRP</th>
              <th>Handling & Logistics</th>
              <th>Helmet</th>
              <th>Accessories</th>
              <th>On-Road Price</th>
              <th>Model</th>
            </tr>
          </thead>
          <tbody>
            {results.map((bike, index) => (
              <tr key={index} className="table-row">
                <td className="cell-hub">{bike.hubName}</td>
                <td>{bike.state}</td>
                <td>{bike.city}</td>
                <td className="cell-model">{bike.model}</td>
                <td className="cell-price">{formatPrice(bike.exShowroomPrice)}</td>
                <td className="cell-price">{formatPrice(bike.empsBenefit)}</td>
                <td className="cell-price">{formatPrice(bike.additionalDiscount)}</td>
                <td className="cell-price">{formatPrice(bike.netExShowroom)}</td>
                <td className="cell-price">{formatPrice(bike.insurance)}</td>
                <td>{bike.fourGConnectivity}</td>
                <td className="cell-price">{formatPrice(bike.rtoFees)}</td>
                <td className="cell-price">{formatPrice(bike.hsrp)}</td>
                <td className="cell-price">{formatPrice(bike.handlingLogistics)}</td>
                <td className="cell-price">{formatPrice(bike.helmet)}</td>
                <td className="cell-price">{formatPrice(bike.accessories)}</td>
                <td className="cell-price-highlight">{formatPrice(bike.onRoadPrice)}</td>
                <td className="cell-model">{bike.model}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
