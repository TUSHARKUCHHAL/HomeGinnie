import React from 'react';

const AdminDashboard = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the Admin Dashboard. Manage your application here.</p>
            <div>
                <button style={{ marginRight: '10px' }}>View Users</button>
                <button>Manage Settings</button>
            </div>
        </div>
    );
};

export default AdminDashboard;