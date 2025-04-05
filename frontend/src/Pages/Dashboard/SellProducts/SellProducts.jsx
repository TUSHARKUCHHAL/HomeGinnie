import React, { useState, useRef } from 'react';
import { PlusCircle, X, Edit2, Trash2, Save, Search, Upload, Image } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Modern Desk Lamp',
      description: 'Elegant desk lamp with adjustable brightness and color temperature',
      price: 49.99,
      image: '/api/placeholder/400/300',
      stock: 24,
    },
    {
      id: 2,
      title: 'Wireless Earbuds',
      description: 'High-quality sound with noise cancellation and long battery life',
      price: 89.99,
      image: '/api/placeholder/400/300',
      stock: 15,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    image: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For this demo, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({
        ...formData,
        image: imageUrl,
      });
    }
  };

  const handleAddProduct = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      price: '',
      image: '',
      stock: '',
    });
    setPreviewImage(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setFormData({ ...product });
    setPreviewImage(product.image);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDeleteProduct = (id) => {
    setDeleteProductId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter((product) => product.id !== deleteProductId));
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      setProducts(
        products.map((product) =>
          product.id === formData.id ? formData : product
        )
      );
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        image: formData.image || '/api/placeholder/400/300',
        stock: formData.stock || 0, // Default to 0 if stock is empty
      };
      setProducts([...products, newProduct]);
    }
    
    setIsModalOpen(false);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 mt-24">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 size={16} className="text-slate-800" />
                  </button>
                  <button
                    onClick={() => confirmDeleteProduct(product.id)}
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
                  <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  <span className="text-slate-600 text-sm">
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-300 mt-8">
            {searchTerm ? (
              <p className="text-slate-600 mb-4">No products match your search</p>
            ) : (
              <>
                <p className="text-slate-600 mb-4">No products in your inventory</p>
                <button
                  onClick={handleAddProduct}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-all duration-300"
                >
                  <PlusCircle size={18} />
                  <span>Add Your First Product</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {editMode ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-600 hover:text-slate-900"
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
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-slate-700 text-sm font-medium mb-1">
                    Product Image
                  </label>
                  
                  {/* Fixed height container for image upload/preview */}
                  <div 
                    className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => fileInputRef.current.click()}>
                    
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={previewImage} 
                          alt="Product preview" 
                          className="w-full h-full object-contain p-2"
                        />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                            setFormData({...formData, image: ''});
                          }}
                          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Image className="w-10 h-10 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500 text-center mb-1">
                          Click to browse or drop an image
                        </p>
                        <p className="text-xs text-slate-400 text-center">
                          PNG, JPG or GIF (600x400px recommended)
                        </p>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center gap-2"
                  >
                    <Save size={18} />
                    {editMode ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Delete Product</h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
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
      `}</style>
    </div>
  );
};

export default ProductManagement;