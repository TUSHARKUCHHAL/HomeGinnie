import React, { useState, useEffect } from 'react';

const ShopsDashboard = () => {
    const [shops, setShops] = useState([]);
    const [filters, setFilters] = useState({
        city: '',
        shopType: ''
    });

    useEffect(() => {
        fetchShops();
    }, [filters]);

    const fetchShops = async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`http://localhost:5500/api/shops/shops?${queryParams}`);
            const data = await response.json();
            setShops(data);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Shops Dashboard</h1>
            
            {/* Filters */}
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    name="city"
                    placeholder="Filter by city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="shopType"
                    placeholder="Filter by shop type"
                    value={filters.shopType}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                />
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                    <div 
                        key={shop._id} 
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        {shop.shopDetails.logo && (
                            <img 
                                src={`http://localhost:5500${shop.shopDetails.logo}`} 
                                alt={`${shop.firstName}'s shop`}
                                className="w-full h-48 object-cover mb-4 rounded"
                            />
                        )}
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {shop.firstName} {shop.lastName}'s Shop
                        </h3>
                        <p className="text-gray-600 mb-2">
                            Type: {shop.shopDetails.shopType}
                        </p>
                        <p className="text-gray-600">
                            Location: {shop.address.city}, {shop.address.state}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopsDashboard;