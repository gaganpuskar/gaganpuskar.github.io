import React, { useState, useEffect } from 'react';
import '../styles/TaskTracker.css';

// Sample data from tracker
const SAMPLE_DATA = [
    { agent: "Aman", status: "Created", customer: "9518301903", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB LATUR", booking: "RV26C186994", date: "2026-03-02", profession: "", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "9565680684", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB UNNAO", booking: "RV26C187000", date: "2026-03-02", profession: "", model: "" },
    { agent: "Geeta", status: "Cancel", customer: "8570011499", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB MAHENDRAGARH", booking: "RV26C187022", date: "2026-03-02", profession: "", model: "" },
    { agent: "Gagan", status: "Delivered", customer: "9021795111", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB NANDED", booking: "RV26C187029", date: "2026-03-02", profession: "", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "8329796827", source: "Organic", subsource: "Referral Lead", hub: "REVOLT HUB SHIRWAL", booking: "RV26C187039", date: "2026-03-02", profession: "", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9220525722", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB BEHRAMPUR", booking: "RV26C187044", date: "2026-03-02", profession: "", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "8439526337", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB DEHRADUN", booking: "RV26C187057", date: "2026-03-03", profession: "", model: "" },
    { agent: "Geeta", status: "Cancel", customer: "9119313101", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB BEGUSARAI", booking: "RV26C187062", date: "2026-03-03", profession: "", model: "" },
    { agent: "Bharti", status: "Created", customer: "7620577724", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB SOLAPUR", booking: "RV26C187073", date: "2026-03-03", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "9258671138", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB SHAHJAHANPUR", booking: "RV26C187090", date: "2026-03-03", profession: "", model: "" },
];

const TaskTracker = () => {
    const [allData] = useState([...SAMPLE_DATA]);
    const [filteredData, setFilteredData] = useState([...SAMPLE_DATA]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSort, setCurrentSort] = useState({ column: 'agent', ascending: true });
    const itemsPerPage = 10;

    // Update metrics on data change
    const getMetrics = () => {
        const total = filteredData.length;
        const delivered = filteredData.filter(d => d.status === 'Delivered').length;
        const created = filteredData.filter(d => d.status === 'Created').length;
        const cancelled = filteredData.filter(d => d.status === 'Cancel' || d.status === 'Cancellation Request').length;

        return { total, delivered, created, cancelled };
    };

    // Filter data when search or status changes
    useEffect(() => {
        const filtered = allData.filter(item => {
            const matchSearch = !searchTerm || 
                item.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.profession.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchStatus = !statusFilter || item.status === statusFilter;

            return matchSearch && matchStatus;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, allData]);

    // Sort data
    const handleSort = (column) => {
        let ascending = true;
        if (currentSort.column === column) {
            ascending = !currentSort.ascending;
        }

        const sorted = [...filteredData].sort((a, b) => {
            let aVal = a[column] || '';
            let bVal = b[column] || '';

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });

        setFilteredData(sorted);
        setCurrentSort({ column, ascending });
    };

    // Export to CSV
    const exportData = () => {
        let csv = 'Agent Name,Status,Customer #,Source,Sub Source,HUB,Booking ID,Date,Profession,Model\n';
        
        filteredData.forEach(row => {
            csv += `"${row.agent}","${row.status}","${row.customer}","${row.source}","${row.subsource}","${row.hub}","${row.booking}","${row.date}","${row.profession}","${row.model}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tracker_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
    };

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const metrics = getMetrics();

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>🏍️ Revolt Bikes Tracker</h1>
                    <p>Professional Lead Management & Booking Tracking System</p>
                </div>
                <div className="header-date">
                    <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="metrics-container">
                <div className="metric-card">
                    <div className="metric-icon">📊</div>
                    <div className="metric-info">
                        <h3>Total Leads</h3>
                        <p className="metric-value">{metrics.total}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon">✅</div>
                    <div className="metric-info">
                        <h3>Delivered</h3>
                        <p className="metric-value completed">{metrics.delivered}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon">⏳</div>
                    <div className="metric-info">
                        <h3>Created</h3>
                        <p className="metric-value in-progress">{metrics.created}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon">❌</div>
                    <div className="metric-info">
                        <h3>Cancelled</h3>
                        <p className="metric-value pending">{metrics.cancelled}</p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="🔍 Search by agent name, customer, HUB, or profession..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-controls">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Created">Created</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Cancellation Request">Cancellation Request</option>
                    </select>

                    <button className="btn-reset" onClick={resetFilters}>Reset Filters</button>
                    <button className="btn-export" onClick={exportData}>📥 Export Data</button>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('agent')}>Agent Name ⬍</th>
                            <th onClick={() => handleSort('status')}>Status ⬍</th>
                            <th onClick={() => handleSort('customer')}>Customer # ⬍</th>
                            <th onClick={() => handleSort('source')}>Source ⬍</th>
                            <th onClick={() => handleSort('subsource')}>Sub Source ⬍</th>
                            <th onClick={() => handleSort('hub')}>HUB ⬍</th>
                            <th onClick={() => handleSort('booking')}>Booking ID ⬍</th>
                            <th onClick={() => handleSort('date')}>Date ⬍</th>
                            <th onClick={() => handleSort('profession')}>Profession ⬍</th>
                            <th onClick={() => handleSort('model')}>Model ⬍</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.agent}</td>
                                <td>
                                    <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td>{row.customer}</td>
                                <td>{row.source}</td>
                                <td>{row.subsource}</td>
                                <td>{row.hub}</td>
                                <td className="booking-id">{row.booking}</td>
                                <td>{row.date}</td>
                                <td>{row.profession}</td>
                                <td>{row.model}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="btn-pagination" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        className="btn-pagination" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskTracker;
