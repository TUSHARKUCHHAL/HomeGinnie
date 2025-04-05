// ProductService.js - Service to fetch product data from the backend

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ProductService = {
  // Get all products with optional filters
  async getProducts(filters = {}) {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock);
      if (filters.category) queryParams.append('category', filters.category);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },
  
  // Get a single product by ID
  async getProductById(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Update product rating
  async updateRating(id, rating) {
    try {
      const response = await fetch(`${API_URL}/products/${id}/rating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating rating: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to update product rating:', error);
      throw error;
    }
  },
  
  // Format product data to match the BuySmart frontend structure
  formatProductForFrontend(product) {
    // Mock platforms data based on the product price
    const basePrice = product.price;
    const platforms = [
      { name: 'Amazon', color: '#FF9900' },
      { name: 'Flipkart', color: '#2874F0' },
      { name: 'Snapdeal', color: '#E40046' },
      { name: 'Blinkit', color: '#FAE100' },
      { name: 'Zepto', color: '#8377FE' },
      { name: 'Instamart', color: '#FC7D03' }
    ].map(platform => ({
      name: platform.name,
      price: Math.floor(basePrice * (0.9 + Math.random() * 0.2)), // +/- 10% from base price
      inStock: product.stock > 0,
      discount: Math.floor(Math.random() * 20),
      deliveryDays: Math.floor(Math.random() * 5) + 1,
      color: platform.color
    }));
    
    return {
      id: product._id,
      name: product.title,
      category: product.category || 'electronics', // Default to electronics if no category
      image: product.image.startsWith('/uploads') ? `${API_URL}${product.image}` : product.image,
      description: product.description,
      basePrice: product.price,
      ratings: product.rating.value.toFixed(1),
      reviewCount: product.rating.count,
      platforms: platforms
    };
  }
};

export default ProductService;