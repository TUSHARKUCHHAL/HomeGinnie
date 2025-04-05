import React from 'react';

const SellProducts = () => {
    return (
        <div>
            <h1>Sell Your Products</h1>
            <p>Welcome to the Sell Products page. Here you can list your products for sale.</p>
            <form>
                <div>
                    <label htmlFor="productName">Product Name:</label>
                    <input type="text" id="productName" name="productName" />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" name="price" />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description"></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SellProducts;