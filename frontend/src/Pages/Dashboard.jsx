import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [userData, setUserData] = useState({
        name: 'User',
        properties: []
    });

    useEffect(() => {
        // Fetch user data when component mounts
        // TODO: Replace with actual API call
        const fetchUserData = async () => {
            try {
                // Add API call here
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {userData.name}</h1>
            </header>
            
            <main className="dashboard-main">
                <section className="dashboard-summary">
                    <h2>Your Properties Overview</h2>
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <h3>Total Properties</h3>
                            <p>{userData.properties.length}</p>
                        </div>
                        {/* Add more stat cards as needed */}
                    </div>
                </section>

                <section className="dashboard-actions">
                    <button className="action-button">Add New Property</button>
                    <button className="action-button">View Reports</button>
                </section>

                <section className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        {/* Add recent activity items here */}
                        <p>No recent activity</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;