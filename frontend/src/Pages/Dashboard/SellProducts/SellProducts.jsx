import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircle, X, Edit2, Trash2, Save, Search, Upload, Image, AlertCircle, Check, Loader } from 'lucide-react';

// API base URL - adjust this based on your deployment
const API_URL = 'http://localhost:5500/api';
const BASE_URL = 'http://localhost:5500'; // Base URL for image paths

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    image: '',
    stock: '',
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      // Process product data to ensure image URLs are complete
      const processedProducts = response.data.data.map(product => ({
        ...product,
        image: product.image && !product.image.startsWith('http') ? 
          `${BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}` : 
          product.image
      }));
      setProducts(processedProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Store file for submission
      setFormData({
        ...formData,
        imageFile: file, // Store the file object
        image: file.name, // Store just the filename
      });
    }
  };

  // Open add product modal
  const handleAddProduct = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      price: '',
      image: '',
      stock: '',
      imageFile: null,
    });
    setPreviewImage(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  // Open edit product modal
  const handleEditProduct = (product) => {
    // If the product image is a full URL, we don't want to prefix it again
    const imageUrl = product.image;
    
    setFormData({ 
      ...product,
      imageFile: null // No file initially when editing
    });
    setPreviewImage(imageUrl);
    setEditMode(true);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const confirmDeleteProduct = (id) => {
    setDeleteProductId(id);
    setIsDeleteModalOpen(true);
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_URL}/products/${deleteProductId}`);
      setProducts(products.filter((product) => product._id !== deleteProductId));
      setIsDeleteModalOpen(false);
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit form (add/edit product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      // Create form data for file upload
      const productData = new FormData();
      productData.append('title', formData.title);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('stock', formData.stock || 0);
      
      // Add image file if there is one
      if (formData.imageFile) {
        productData.append('image', formData.imageFile);
      } else if (formData.image && typeof formData.image === 'string') {
        // Extract the image path if it's a full URL from our server
        let imagePath = formData.image;
        if (imagePath.startsWith(BASE_URL)) {
          imagePath = imagePath.substring(BASE_URL.length);
        }
        productData.append('image', imagePath);
      }
      
      let response;
      
      if (editMode) {
        response = await axios.put(`${API_URL}/products/${formData._id}`, productData);
        
        // Ensure the image URL is complete for the updated product
        const updatedProduct = {
          ...response.data.data,
          image: response.data.data.image && !response.data.data.image.startsWith('http') ? 
            `${BASE_URL}${response.data.data.image.startsWith('/') ? '' : '/'}${response.data.data.image}` : 
            response.data.data.image
        };
        
        setProducts(
          products.map((product) =>
            product._id === formData._id ? updatedProduct : product
          )
        );
        toast.success('Product updated successfully');
      } else {
        response = await axios.post(`${API_URL}/products`, productData);
        
        // Ensure the image URL is complete for the new product
        const newProduct = {
          ...response.data.data,
          image: response.data.data.image && !response.data.data.image.startsWith('http') ? 
            `${BASE_URL}${response.data.data.image.startsWith('/') ? '' : '/'}${response.data.data.image}` : 
            response.data.data.image
        };
        
        setProducts([...products, newProduct]);
        toast.success('Product added successfully');
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting product:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save product';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 mt-8">
          <h1 className="text-3xl font-bold text-slate-900">Product Inventory</h1>
          <p className="text-slate-600 mt-2">Manage your shop's product listings</p>
        </header>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Your Products</h2>
            <p className="text-slate-600 text-sm">{products.length} products in inventory</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative w-full md:w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white shadow-sm"
              />
            </div>
            
            <button
              onClick={handleAddProduct}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <PlusCircle size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={40} className="text-slate-400 animate-spin mb-4" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-start gap-3 mb-8">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Failed to load products</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 text-sm font-medium bg-red-100 px-3 py-1 rounded-md hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = '/api/placeholder/400/300';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Image size={48} className="text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 size={16} className="text-slate-800" />
                    </button>
                    <button
                      onClick={() => confirmDeleteProduct(product._id)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition-colors"
                    >
                      <Trash2 size={16} className="text-slate-800" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">{product.title}</h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-slate-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                    </span>
                  </div>
                  {product.rating && product.rating.count > 0 && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(product.rating.value) ? 'text-yellow-400' : 'text-slate-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 ml-1">({product.rating.count})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-300 mt-8">
            {searchTerm ? (
              <div className="px-4">
                <Search size={32} className="text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No products match your search</p>
                <p className="text-slate-500 text-sm">Try a different search term or clear the search</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-md transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusCircle size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-600 mb-4">No products in your inventory</p>
                <button
                  onClick={handleAddProduct}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300"
                >
                  <PlusCircle size={18} />
                  <span>Add Your First Product</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-lg w-full max-w-lg p-6 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {editMode ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-600 hover:text-slate-900"
                  disabled={submitting}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    required
                    disabled={submitting}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-medium mb-1">
                      Stock <span className="text-slate-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-slate-700 text-sm font-medium mb-1">
                    Product Image
                  </label>
                  
                  <div 
                    className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => !submitting && fileInputRef.current.click()}
                  >
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={previewImage} 
                          alt="Product preview" 
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/300';
                          }}
                        />
                        {!submitting && (
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(null);
                              setFormData({...formData, image: '', imageFile: null});
                            }}
                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Image className="w-10 h-10 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500 text-center mb-1">
                          Click to browse or drop an image
                        </p>
                        <p className="text-xs text-slate-400 text-center">
                          PNG, JPG or GIF (max 5MB)
                        </p>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center gap-2 disabled:bg-slate-400"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>{editMode ? 'Save Changes' : 'Add Product'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Delete Product</h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:bg-red-400"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;