// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const Profile = () => {
//     const [profile, setProfile] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isEditable, setIsEditable] = useState(false);
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phoneNumber: '',
//         alternateNumber: '',
//         address: {
//             street: '',
//             city: '',
//             state: '',
//             postalCode: '',
//             country: 'India',
//         },
//         shopDetails: {
//             gstNumber: '',
//             shopType: '',
//             deliveryProvided: false,
//             businessHours: {
//                 monday: { open: '09:00', close: '18:00' },
//                 tuesday: { open: '09:00', close: '18:00' },
//                 wednesday: { open: '09:00', close: '18:00' },
//                 thursday: { open: '09:00', close: '18:00' },
//                 friday: { open: '09:00', close: '18:00' },
//                 saturday: { open: '09:00', close: '18:00' },
//                 sunday: { open: '09:00', close: '18:00' },
//             }
//         }
//     });

//     const { id } = useParams();
//     const navigate = useNavigate();

//     // Fetch profile data
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 setLoading(true);

//                 // If id is provided, fetch that specific profile, otherwise fetch the logged-in user's profile
//                 const endpoint = id ? `http://localhost:5500/api/shops/shop/${id}` : 'http://localhost:5500/api/shops/me';

//                 const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//                 const config = {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 };

//                 if (token && !id) {
//                     config.headers['Authorization'] = `Bearer ${token}`;
//                 }

//                 const res = await axios.get(endpoint, config);

//                 setProfile(res.data);
//                 setFormData({
//                     firstName: res.data.firstName || '',
//                     lastName: res.data.lastName || '',
//                     phoneNumber: res.data.phoneNumber || '',
//                     alternateNumber: res.data.alternateNumber || '',
//                     address: {
//                         street: res.data.address?.street || '',
//                         city: res.data.address?.city || '',
//                         state: res.data.address?.state || '',
//                         postalCode: res.data.address?.postalCode || '',
//                         country: res.data.address?.country || 'India',
//                     },
//                     shopDetails: {
//                         gstNumber: res.data.shopDetails?.gstNumber || '',
//                         shopType: res.data.shopDetails?.shopType || '',
//                         deliveryProvided: res.data.shopDetails?.deliveryProvided || false,
//                         establishedDate: res.data.shopDetails?.establishedDate ?
//                             new Date(res.data.shopDetails.establishedDate).toISOString().split('T')[0] : '',
//                         businessHours: res.data.shopDetails?.businessHours || {
//                             monday: { open: '09:00', close: '18:00' },
//                             tuesday: { open: '09:00', close: '18:00' },
//                             wednesday: { open: '09:00', close: '18:00' },
//                             thursday: { open: '09:00', close: '18:00' },
//                             friday: { open: '09:00', close: '18:00' },
//                             saturday: { open: '09:00', close: '18:00' },
//                             sunday: { open: '09:00', close: '18:00' },
//                         }
//                     }
//                 });

//                 // Determine if profile is editable (only if it's the logged-in user's profile)
//                 setIsEditable(!id);

//                 setLoading(false);
//             } catch (err) {
//                 console.error(err);
//                 setError(err.response?.data?.message || 'Failed to load profile');
//                 setLoading(false);

//                 // If not authenticated and trying to access own profile, redirect to login
//                 if (err.response?.status === 401 && !id) {
//                     navigate('/login');
//                 }
//             }
//         };

//         fetchProfile();
//     }, [id, navigate]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name.includes('.')) {
//             const [parent, child] = name.split('.');

//             setFormData({
//                 ...formData,
//                 [parent]: {
//                     ...formData[parent],
//                     [child]: value
//                 }
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value
//             });
//         }
//     };

//     const handleAddressChange = (e) => {
//         const { name, value } = e.target;

//         setFormData({
//             ...formData,
//             address: {
//                 ...formData.address,
//                 [name]: value
//             }
//         });
//     };

//     const handleShopDetailsChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         setFormData({
//             ...formData,
//             shopDetails: {
//                 ...formData.shopDetails,
//                 [name]: type === 'checkbox' ? checked : value
//             }
//         });
//     };

//     const handleBusinessHoursChange = (day, type, value) => {
//         setFormData({
//             ...formData,
//             shopDetails: {
//                 ...formData.shopDetails,
//                 businessHours: {
//                     ...formData.shopDetails.businessHours,
//                     [day]: {
//                         ...formData.shopDetails.businessHours[day],
//                         [type]: value
//                     }
//                 }
//             }
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const token = localStorage.getItem('token') || sessionStorage.getItem('token');

//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const config = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             };

//             const res = await axios.put('http://localhost:5500/api/shops/me', formData, config);

//             setProfile(res.data);
//             alert('Profile updated successfully!');
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.message || 'Failed to update profile');
//         }
//     };

//     const handleAvatarChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         try {
//             const token = localStorage.getItem('token') || sessionStorage.getItem('token');

//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const formData = new FormData();
//             formData.append('avatar', file);

//             const config = {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 }
//             };

//             const res = await axios.put('http://localhost:5500/api/shops/avatar', formData, config);

//             setProfile(res.data);
//             alert('Avatar updated successfully!');
//         } catch (err) {
//             console.error(err);
//             setError('Failed to update avatar');
//         }
//     };

//     const handleLogoChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         try {
//             const token = localStorage.getItem('token') || sessionStorage.getItem('token');

//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const formData = new FormData();
//             formData.append('logo', file);

//             const config = {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 }
//             };

//             const res = await axios.put('http://localhost:5500/api/shops//shop-logo', formData, config);

//             setProfile(res.data);
//             alert('Shop logo updated successfully!');
//         } catch (err) {
//             console.error(err);
//             setError('Failed to update shop logo');
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//         </div>;
//     }

//     if (error) {
//         return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-6 max-w-3xl">
//             {error}
//         </div>;
//     }

//     if (!profile) {
//         return <div className="text-center text-gray-700 my-6">Profile not found</div>;
//     }

//     return (
//         <div className='<div className="relative p-6 mx-0 mb-6 rounded-t-lg">'>
//             <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md mb-8 mt-20">
//                 <div className="flex flex-col md:flex-row items-center md:items-start border-b pb-6 mx-0 mb-6">
//                     <div className="relative w-32 h-32 mb-4 md:mb-0 md:mr-6">
//                         <img
//                             src={profile.shopDetails?.logo || profile.avatar || 'https://via.placeholder.com/150'}
//                             alt={`${profile.firstName} ${profile.lastName}`}
//                             className="w-full h-full object-cover rounded-full border-2 border-gray-200"
//                         />
//                         {isEditable && (
//                             <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
//                                 <label htmlFor="avatar-input" className="cursor-pointer">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                                     </svg>
//                                 </label>
//                                 <input
//                                     id="avatar-input"
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleAvatarChange}
//                                     className="hidden"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                     <div className="flex-1 text-center md:text-left">
//                         <h1 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h1>
//                         <p className="text-gray-600">{profile.email}</p>
//                         <p className="text-gray-700">{profile.phoneNumber}</p>
//                         {profile.alternateNumber && <p className="text-gray-500 text-sm">Alt: {profile.alternateNumber}</p>}
//                         {profile.profileComplete ? (
//                             <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-2">Profile Complete</span>
//                         ) : (
//                             <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-2">Profile Incomplete</span>
//                         )}
//                     </div>

//                     {isEditable && profile.shopDetails && (
//                         <div className="mt-4 md:mt-0">
//                             <div className="relative w-32 h-32 mb-2">
//                                 <img
//                                     src={profile.shopDetails.logo || 'https://via.placeholder.com/150?text=Shop+Logo'}
//                                     alt="Shop Logo"
//                                     className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
//                                 />
//                                 <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
//                                     <label htmlFor="logo-input" className="cursor-pointer">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         </svg>
//                                     </label>
//                                     <input
//                                         id="logo-input"
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleLogoChange}
//                                         className="hidden"
//                                     />
//                                 </div>
//                             </div>
//                             <p className="text-xs text-center text-gray-500">Shop Logo</p>
//                         </div>
//                     )}
//                 </div>

//                 {isEditable ? (
//                     <div className="bg-gray-50 p-6 rounded-lg">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
//                         <form onSubmit={handleSubmit}>
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-medium text-gray-700 mb-3">Personal Information</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                                         <input
//                                             type="text"
//                                             id="firstName"
//                                             name="firstName"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                                         <input
//                                             type="text"
//                                             id="lastName"
//                                             name="lastName"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                     <div>
//                                         <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                                         <input
//                                             type="tel"
//                                             id="phoneNumber"
//                                             name="phoneNumber"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="alternateNumber" className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
//                                         <input
//                                             type="tel"
//                                             id="alternateNumber"
//                                             name="alternateNumber"
//                                             value={formData.alternateNumber}
//                                             onChange={handleChange}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mb-6">
//                                 <h3 className="text-lg font-medium text-gray-700 mb-3">Address</h3>
//                                 <div>
//                                     <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
//                                     <input
//                                         type="text"
//                                         id="street"
//                                         name="street"
//                                         value={formData.address.street}
//                                         onChange={handleAddressChange}
//                                         required
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                     <div>
//                                         <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                                         <input
//                                             type="text"
//                                             id="city"
//                                             name="city"
//                                             value={formData.address.city}
//                                             onChange={handleAddressChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                                         <input
//                                             type="text"
//                                             id="state"
//                                             name="state"
//                                             value={formData.address.state}
//                                             onChange={handleAddressChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                     <div>
//                                         <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
//                                         <input
//                                             type="text"
//                                             id="postalCode"
//                                             name="postalCode"
//                                             value={formData.address.postalCode}
//                                             onChange={handleAddressChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                                         <input
//                                             type="text"
//                                             id="country"
//                                             name="country"
//                                             value={formData.address.country}
//                                             onChange={handleAddressChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mb-6">
//                                 <h3 className="text-lg font-medium text-gray-700 mb-3">Shop Details</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
//                                         <input
//                                             type="text"
//                                             id="gstNumber"
//                                             name="gstNumber"
//                                             value={formData.shopDetails.gstNumber}
//                                             onChange={handleShopDetailsChange}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="shopType" className="block text-sm font-medium text-gray-700 mb-1">Shop Type</label>
//                                         <select
//                                             id="shopType"
//                                             name="shopType"
//                                             value={formData.shopDetails.shopType}
//                                             onChange={handleShopDetailsChange}
//                                             required
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         >
//                                             <option value="">Select Type</option>
//                                             <option value="retail">Retail</option>
//                                             <option value="wholesale">Wholesale</option>
//                                             <option value="service">Service</option>
//                                             <option value="restaurant">Restaurant</option>
//                                             <option value="other">Other</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                                     <div>
//                                         <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
//                                         <input
//                                             type="date"
//                                             id="establishedDate"
//                                             name="establishedDate"
//                                             value={formData.shopDetails.establishedDate}
//                                             onChange={handleShopDetailsChange}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                     <div className="flex items-center h-full pt-6">
//                                         <label className="flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 id="deliveryProvided"
//                                                 name="deliveryProvided"
//                                                 checked={formData.shopDetails.deliveryProvided}
//                                                 onChange={handleShopDetailsChange}
//                                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                             />
//                                             <span className="ml-2 text-sm text-gray-700">Delivery Provided</span>
//                                         </label>
//                                     </div>
//                                 </div>

//                                 <div className="mt-6">
//                                     <h4 className="text-md font-medium text-gray-700 mb-3">Business Hours</h4>
//                                     <div className="bg-white p-4 rounded-lg border border-gray-200">
//                                         {Object.keys(formData.shopDetails.businessHours).map((day) => (
//                                             <div className="flex items-center mb-2 last:mb-0" key={day}>
//                                                 <span className="w-24 font-medium text-gray-700 capitalize">{day}</span>
//                                                 <div className="flex items-center">
//                                                     <input
//                                                         type="time"
//                                                         value={formData.shopDetails.businessHours[day].open}
//                                                         onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
//                                                         className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                                     />
//                                                     <span className="mx-2 text-gray-500">to</span>
//                                                     <input
//                                                         type="time"
//                                                         value={formData.shopDetails.businessHours[day].close}
//                                                         onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
//                                                         className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex justify-end">
//                                 <button
//                                     type="submit"
//                                     className="px-6 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-00 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                 >
//                                     Save Changes
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <section className="bg-white p-6 rounded-lg shadow-sm">
//                             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
//                             <div className="space-y-3">
//                                 <div>
//                                     <span className="text-sm text-gray-500">Full Name:</span>
//                                     <p className="font-medium">{profile.firstName} {profile.lastName}</p>
//                                 </div>
//                                 <div>
//                                     <span className="text-sm text-gray-500">Email:</span>
//                                     <p className="font-medium">{profile.email}</p>
//                                 </div>
//                                 <div>
//                                     <span className="text-sm text-gray-500">Phone:</span>
//                                     <p className="font-medium">{profile.phoneNumber}</p>
//                                 </div>
//                                 {profile.alternateNumber && (
//                                     <div>
//                                         <span className="text-sm text-gray-500">Alternate Phone:</span>
//                                         <p className="font-medium">{profile.alternateNumber}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </section>

//                         <section className="bg-white p-6 rounded-lg shadow-sm">
//                             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Address</h2>
//                             {profile.address && (
//                                 <div className="space-y-3">
//                                     <div>
//                                         <span className="text-sm text-gray-500">Street:</span>
//                                         <p className="font-medium">{profile.address.street}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-sm text-gray-500">City:</span>
//                                         <p className="font-medium">{profile.address.city}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-sm text-gray-500">State:</span>
//                                         <p className="font-medium">{profile.address.state}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-sm text-gray-500">Postal Code:</span>
//                                         <p className="font-medium">{profile.address.postalCode}</p>
//                                     </div>
//                                     <div>
//                                         <span className="text-sm text-gray-500">Country:</span>
//                                         <p className="font-medium">{profile.address.country}</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </section>

//                         <section className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
//                             <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Shop Details</h2>
//                             {profile.shopDetails && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
//                                     <div>
//                                         {profile.shopDetails.gstNumber && (
//                                             <div className="mb-3">
//                                                 <span className="text-sm text-gray-500">GST Number:</span>
//                                                 <p className="font-medium">{profile.shopDetails.gstNumber}</p>
//                                             </div>
//                                         )}
//                                         {profile.shopDetails.shopType && (
//                                             <div className="mb-3">
//                                                 <span className="text-sm text-gray-500">Shop Type:</span>
//                                                 <p className="font-medium capitalize">
//                                                     {profile.shopDetails.shopType}
//                                                 </p>
//                                             </div>
//                                         )}
//                                         <div className="mb-3">
//                                             <span className="text-sm text-gray-500">Delivery:</span>
//                                             <p className="font-medium">
//                                                 {profile.shopDetails.deliveryProvided ? 'Available' : 'Not Available'}
//                                             </p>
//                                         </div>
//                                         {profile.shopDetails.establishedDate && (
//                                             <div className="mb-3">
//                                                 <span className="text-sm text-gray-500">Established:</span>
//                                                 <p className="font-medium">
//                                                     {new Date(profile.shopDetails.establishedDate).toLocaleDateString()}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {profile.shopDetails.businessHours && (
//                                         <div>
//                                             <h3 className="text-lg font-medium text-gray-700 mb-2">Business Hours</h3>
//                                             <div className="bg-gray-50 p-3 rounded">
//                                                 {Object.entries(profile.shopDetails.businessHours).map(([day, hours]) => (
//                                                     <div className="flex justify-between py-1 border-b last:border-0 border-gray-200" key={day}>
//                                                         <span className="capitalize text-gray-600">{day}:</span>
//                                                         <span className="font-medium">
//                                                             {hours.open} - {hours.close}
//                                                         </span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </section>

//                         {profile.rating && profile.rating.count > 0 && (
//                             <section className="bg-white p-6 rounded-lg shadow-sm">
//                                 <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ratings & Reviews</h2>
//                                 <div className="flex items-center mb-4">
//                                     <div className="flex items-center">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <svg
//                                                 key={star}
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className={`h-5 w-5 ${star <= Math.round(profile.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`}
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
//                                             </svg>
//                                         ))}
//                                     </div>
//                                     <span className="ml-2 text-lg font-medium text-gray-700">{profile.rating.average.toFixed(1)}</span>
//                                     <span className="mx-2 text-gray-500">|</span>
//                                     <span className="text-gray-500">{profile.rating.count} reviews</span>
//                                 </div>
//                                 {profile.recentReviews && profile.recentReviews.length > 0 && (
//                                     <div className="space-y-4">
//                                         <h3 className="text-md font-medium text-gray-700">Recent Reviews</h3>
//                                         {profile.recentReviews.map((review, index) => (
//                                             <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
//                                                 <div className="flex items-center mb-1">
//                                                     <div className="flex items-center">
//                                                         {[1, 2, 3, 4, 5].map((star) => (
//                                                             <svg
//                                                                 key={star}
//                                                                 xmlns="http://www.w3.org/2000/svg"
//                                                                 className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                                                                 viewBox="0 0 20 20"
//                                                                 fill="currentColor"
//                                                             >
//                                                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
//                                                             </svg>
//                                                         ))}
//                                                     </div>
//                                                     <span className="ml-2 text-sm font-medium">{review.userName}</span>
//                                                     <span className="ml-auto text-xs text-gray-500">
//                                                         {new Date(review.date).toLocaleDateString()}
//                                                     </span>
//                                                 </div>
//                                                 <p className="text-gray-600 text-sm">{review.comment}</p>
//                                             </div>
//                                         ))}
//                                         {profile.rating.count > (profile.recentReviews?.length || 0) && (
//                                             <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                                                 View all {profile.rating.count} reviews
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}
//                             </section>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
// export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        alternateNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
        },
        shopDetails: {
            gstNumber: '',
            shopType: '',
            deliveryProvided: false,
            businessHours: {
                monday: { open: '09:00', close: '18:00' },
                tuesday: { open: '09:00', close: '18:00' },
                wednesday: { open: '09:00', close: '18:00' },
                thursday: { open: '09:00', close: '18:00' },
                friday: { open: '09:00', close: '18:00' },
                saturday: { open: '09:00', close: '18:00' },
                sunday: { open: '09:00', close: '18:00' },
            }
        }
    });
    const [formErrors, setFormErrors] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                // If id is provided, fetch that specific profile, otherwise fetch the logged-in user's profile
                const endpoint = id ? `http://localhost:5500/api/shops/shop/${id}` : 'http://localhost:5500/api/shops/me';

                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                if (token && !id) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await axios.get(endpoint, config);

                setProfile(res.data);
                setFormData({
                    firstName: res.data.firstName || '',
                    lastName: res.data.lastName || '',
                    phoneNumber: res.data.phoneNumber || '',
                    alternateNumber: res.data.alternateNumber || '',
                    address: {
                        street: res.data.address?.street || '',
                        city: res.data.address?.city || '',
                        state: res.data.address?.state || '',
                        postalCode: res.data.address?.postalCode || '',
                        country: res.data.address?.country || 'India',
                    },
                    shopDetails: {
                        gstNumber: res.data.shopDetails?.gstNumber || '',
                        shopType: res.data.shopDetails?.shopType || '',
                        deliveryProvided: res.data.shopDetails?.deliveryProvided || false,
                        establishedDate: res.data.shopDetails?.establishedDate ?
                            new Date(res.data.shopDetails.establishedDate).toISOString().split('T')[0] : '',
                        businessHours: res.data.shopDetails?.businessHours || {
                            monday: { open: '09:00', close: '18:00' },
                            tuesday: { open: '09:00', close: '18:00' },
                            wednesday: { open: '09:00', close: '18:00' },
                            thursday: { open: '09:00', close: '18:00' },
                            friday: { open: '09:00', close: '18:00' },
                            saturday: { open: '09:00', close: '18:00' },
                            sunday: { open: '09:00', close: '18:00' },
                        }
                    }
                });

                // Determine if profile is editable (only if it's the logged-in user's profile)
                setIsEditable(!id);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load profile');
                setLoading(false);

                // If not authenticated and trying to access own profile, redirect to login
                if (err.response?.status === 401 && !id) {
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [id, navigate]);

    const toggleEditMode = () => {
        // If we're exiting edit mode, reset form data to current profile
        if (isEditable) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phoneNumber: profile.phoneNumber || '',
                alternateNumber: profile.alternateNumber || '',
                address: {
                    street: profile.address?.street || '',
                    city: profile.address?.city || '',
                    state: profile.address?.state || '',
                    postalCode: profile.address?.postalCode || '',
                    country: profile.address?.country || 'India',
                },
                shopDetails: {
                    gstNumber: profile.shopDetails?.gstNumber || '',
                    shopType: profile.shopDetails?.shopType || '',
                    deliveryProvided: profile.shopDetails?.deliveryProvided || false,
                    establishedDate: profile.shopDetails?.establishedDate ?
                        new Date(profile.shopDetails.establishedDate).toISOString().split('T')[0] : '',
                    businessHours: profile.shopDetails?.businessHours || {
                        monday: { open: '09:00', close: '18:00' },
                        tuesday: { open: '09:00', close: '18:00' },
                        wednesday: { open: '09:00', close: '18:00' },
                        thursday: { open: '09:00', close: '18:00' },
                        friday: { open: '09:00', close: '18:00' },
                        saturday: { open: '09:00', close: '18:00' },
                        sunday: { open: '09:00', close: '18:00' },
                    }
                }
            });
            setFormErrors({});
        }
        
        setIsEditable(!isEditable);
    };

    const validateForm = () => {
        const errors = {};
        
        // Basic validations
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        
        // Phone validation - simple check for Indian numbers
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
            errors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }
        
        if (formData.alternateNumber && !phoneRegex.test(formData.alternateNumber.replace(/\D/g, ''))) {
            errors.alternateNumber = 'Please enter a valid alternate number or leave blank';
        }
        
        // Address validation
        if (!formData.address.street.trim()) errors['address.street'] = 'Street is required';
        if (!formData.address.city.trim()) errors['address.city'] = 'City is required';
        if (!formData.address.state.trim()) errors['address.state'] = 'State is required';
        if (!formData.address.postalCode.trim()) errors['address.postalCode'] = 'Postal code is required';
        
        // GST validation (simple format check)
        if (formData.shopDetails.gstNumber && 
            !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(formData.shopDetails.gstNumber)) {
            errors['shopDetails.gstNumber'] = 'Please enter a valid GST number';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        
        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [name]: value
            }
        });
        
        // Clear error when field is edited
        if (formErrors[`address.${name}`]) {
            setFormErrors({
                ...formErrors,
                [`address.${name}`]: ''
            });
        }
    };

    const handleShopDetailsChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            shopDetails: {
                ...formData.shopDetails,
                [name]: type === 'checkbox' ? checked : value
            }
        });
        
        // Clear error when field is edited
        if (formErrors[`shopDetails.${name}`]) {
            setFormErrors({
                ...formErrors,
                [`shopDetails.${name}`]: ''
            });
        }
    };

    const handleBusinessHoursChange = (day, type, value) => {
        setFormData({
            ...formData,
            shopDetails: {
                ...formData.shopDetails,
                businessHours: {
                    ...formData.shopDetails.businessHours,
                    [day]: {
                        ...formData.shopDetails.businessHours[day],
                        [type]: value
                    }
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            // Scroll to first error
            const firstErrorKey = Object.keys(formErrors)[0];
            const element = document.querySelector(`[name="${firstErrorKey}"], [name="${firstErrorKey.split('.')[1]}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return;
        }

        setLoading(true);
        
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const res = await axios.put('http://localhost:5500/api/shops/me', formData, config);

            setProfile(res.data);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
            successMessage.innerHTML = '<strong>Success!</strong> Profile updated successfully.';
            document.body.appendChild(successMessage);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 3000);
            
            // Exit edit mode
            setIsEditable(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
            
            // Show error message
            const errorElement = document.getElementById('form-error');
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image file (JPG, JPEG, or PNG)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size should be less than 5MB');
            return;
        }

        setUploadProgress(0);
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('avatar', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            const res = await axios.put('http://localhost:5500/api/shops/avatar', formData, config);

            setProfile(res.data);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
            successMessage.innerHTML = '<strong>Success!</strong> Avatar updated successfully.';
            document.body.appendChild(successMessage);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to update avatar: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
            setUploadProgress(null);
        }
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image file (JPG, JPEG, or PNG)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size should be less than 5MB');
            return;
        }

        setUploadProgress(0);
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('logo', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            // Fixed the endpoint by removing the extra slash
            const res = await axios.put('http://localhost:5500/api/shops/shop-logo', formData, config);

            setProfile(res.data);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
            successMessage.innerHTML = '<strong>Success!</strong> Shop logo updated successfully.';
            document.body.appendChild(successMessage);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to update shop logo: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
            setUploadProgress(null);
        }
    };

    if (loading && !profile) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error && !profile) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-6 max-w-3xl">
            {error}
        </div>;
    }

    if (!profile) {
        return <div className="text-center text-gray-700 my-6">Profile not found</div>;
    }

    return (
        <div className="p-6 mx-0 mb-6 rounded-t-lg">
            {/* Error alert */}
            {error && (
                <div id="form-error" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-4 max-w-4xl flex justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-700">×</button>
                </div>
            )}
            
            {/* Upload progress indicator */}
            {uploadProgress !== null && (
                <div className="mx-auto my-4 max-w-4xl">
                    <div className="bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{width: `${uploadProgress}%`}}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                </div>
            )}
            
            <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md mb-8 mt-20">
                <div className="flex flex-col md:flex-row items-center md:items-start border-b pb-6 mx-0 mb-6">
                    <div className="relative w-32 h-32 mb-4 md:mb-0 md:mr-6">
                        <img
                            src={profile.shopDetails?.logo || profile.avatar || 'https://via.placeholder.com/150'}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                        />
                        {isEditable && (
                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                                <label htmlFor="avatar-input" className="cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </label>
                                <input
                                    id="avatar-input"
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h1>
                        <p className="text-gray-600">{profile.email}</p>
                        <p className="text-gray-700">{profile.phoneNumber}</p>
                        {profile.alternateNumber && <p className="text-gray-500 text-sm">Alt: {profile.alternateNumber}</p>}
                        {profile.profileComplete ? (
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-2">Profile Complete</span>
                        ) : (
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-2">Profile Incomplete</span>
                        )}
                        {!isEditable && !id && (
                            <button 
                                onClick={toggleEditMode}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {profile.shopDetails && (
                        <div className="mt-4 md:mt-0">
                            <div className="relative w-32 h-32 mb-2">
                                <img
                                    src={profile.shopDetails.logo || 'https://via.placeholder.com/150?text=Shop+Logo'}
                                    alt="Shop Logo"
                                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                />
                                {isEditable && (
                                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                                        <label htmlFor="logo-input" className="cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label>
                                        <input
                                            id="logo-input"
                                            type="file"
                                            accept="image/jpeg, image/png, image/jpg"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-center text-gray-500">Shop Logo</p>
                        </div>
                    )}
                </div>

                {isEditable ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-3 py-2 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-3 py-2 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-3 py-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="alternateNumber" className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                                        <input
                                            type="tel"
                                            id="alternateNumber"
                                            name="alternateNumber"
                                            value={formData.alternateNumber}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border ${formErrors.alternateNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors.alternateNumber && <p className="text-red-500 text-xs mt-1">{formErrors.alternateNumber}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Address</h3>
                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        value={formData.address.street}
                                        onChange={handleAddressChange}
                                        required
                                        className={`w-full px-3 py-2 border ${formErrors['address.street'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    />
                                    {formErrors['address.street'] && <p className="text-red-500 text-xs mt-1">{formErrors['address.street']}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.address.city}
                                            onChange={handleAddressChange}
                                            required
                                            className={`w-full px-3 py-2 border ${formErrors['address.city'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors['address.city'] && <p className="text-red-500 text-xs mt-1">{formErrors['address.city']}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.address.state}
                                            onChange={handleAddressChange}
                                            required
                                            className={`w-full px-3 py-2 border ${formErrors['address.state'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors['address.state'] && <p className="text-red-500 text-xs mt-1">{formErrors['address.state']}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.address.postalCode}
                                            onChange={handleAddressChange}
                                            required
                                            className={`w-full px-3 py-2 border ${formErrors['address.postalCode'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors['address.postalCode'] && <p className="text-red-500 text-xs mt-1">{formErrors['address.postalCode']}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.address.country}
                                            onChange={handleAddressChange}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Shop Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                        <input
                                            type="text"
                                            id="gstNumber"
                                            name="gstNumber"
                                            value={formData.shopDetails.gstNumber}
                                            onChange={handleShopDetailsChange}
                                            className={`w-full px-3 py-2 border ${formErrors['shopDetails.gstNumber'] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                        />
                                        {formErrors['shopDetails.gstNumber'] && <p className="text-red-500 text-xs mt-1">{formErrors['shopDetails.gstNumber']}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="shopType" className="block text-sm font-medium text-gray-700 mb-1">Shop Type</label>
                                        <select
                                            id="shopType"
                                            name="shopType"
                                            value={formData.shopDetails.shopType}
                                            onChange={handleShopDetailsChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">Select Shop Type</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Wholesale">Wholesale</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Service">Service</option>
                                            <option value="Online">Online</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
                                        <input
                                            type="date"
                                            id="establishedDate"
                                            name="establishedDate"
                                            value={formData.shopDetails.establishedDate || ''}
                                            onChange={handleShopDetailsChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="deliveryProvided"
                                            name="deliveryProvided"
                                            checked={formData.shopDetails.deliveryProvided}
                                            onChange={handleShopDetailsChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="deliveryProvided" className="ml-2 block text-sm text-gray-700">
                                            Delivery Service Available
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Business Hours</h3>
                                <div className="bg-white rounded-lg p-2">
                                    {Object.keys(formData.shopDetails.businessHours).map((day) => (
                                        <div key={day} className="grid grid-cols-3 gap-2 mb-2">
                                            <div className="flex items-center">
                                                <span className="capitalize text-sm font-medium text-gray-700">{day}</span>
                                            </div>
                                            <div>
                                                <label htmlFor={`${day}-open`} className="sr-only">Opening Time</label>
                                                <input
                                                    type="time"
                                                    id={`${day}-open`}
                                                    value={formData.shopDetails.businessHours[day].open}
                                                    onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`${day}-close`} className="sr-only">Closing Time</label>
                                                <input
                                                    type="time"
                                                    id={`${day}-close`}
                                                    value={formData.shopDetails.businessHours[day].close}
                                                    onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={toggleEditMode}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">First Name</p>
                                        <p className="font-medium">{profile.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Name</p>
                                        <p className="font-medium">{profile.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{profile.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="font-medium">{profile.phoneNumber}</p>
                                    </div>
                                    {profile.alternateNumber && (
                                        <div>
                                            <p className="text-sm text-gray-500">Alternate Number</p>
                                            <p className="font-medium">{profile.alternateNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500">Street</p>
                                        <p className="font-medium">{profile.address?.street}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="font-medium">{profile.address?.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">State</p>
                                        <p className="font-medium">{profile.address?.state}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Postal Code</p>
                                        <p className="font-medium">{profile.address?.postalCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Country</p>
                                        <p className="font-medium">{profile.address?.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {profile.shopDetails && (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop Details</h2>
                                    <div className="bg-white rounded-lg shadow-sm p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {profile.shopDetails.gstNumber && (
                                                <div>
                                                    <p className="text-sm text-gray-500">GST Number</p>
                                                    <p className="font-medium">{profile.shopDetails.gstNumber}</p>
                                                </div>
                                            )}
                                            {profile.shopDetails.shopType && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Shop Type</p>
                                                    <p className="font-medium">{profile.shopDetails.shopType}</p>
                                                </div>
                                            )}
                                            {profile.shopDetails.establishedDate && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Established Date</p>
                                                    <p className="font-medium">
                                                        {new Date(profile.shopDetails.establishedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-500">Delivery Service</p>
                                                <p className="font-medium">
                                                    {profile.shopDetails.deliveryProvided ? 'Available' : 'Not Available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h2>
                                    <div className="bg-white rounded-lg shadow-sm p-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="font-medium">Day</div>
                                            <div className="font-medium">Open</div>
                                            <div className="font-medium">Close</div>
                                            {profile.shopDetails.businessHours && Object.entries(profile.shopDetails.businessHours).map(([day, hours]) => (
                                                <React.Fragment key={day}>
                                                    <div className="capitalize">{day}</div>
                                                    <div>{hours.open}</div>
                                                    <div>{hours.close}</div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;