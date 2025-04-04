import React, { useState, useEffect } from 'react';

const ServiceProviderDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        completedJobs: 0,
        pendingJobs: 0,
        revenue: 0
    });

    useEffect(() => {
        // Fetch dashboard data from API
        // This is where you would make API calls to get service provider's data
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Service Provider Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Bookings</h3>
                    <p>{stats.totalBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Jobs</h3>
                    <p>{stats.completedJobs}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Jobs</h3>
                    <p>{stats.pendingJobs}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>${stats.revenue}</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceProviderDashboard;