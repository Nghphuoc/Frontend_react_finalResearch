// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Upload, Loader2, Check, Image, X } from "lucide-react";
// import { getAllCategory, AddProduct } from "./service";

// const UploadImage = () => {
//   const [product, setProduct] = useState({
//     productName: "",
//     description: "",
//     price: "",
//     imageUrl: "",
//     stock_quantity: "",
//     categories: [],
//   });

//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

//   useEffect(() => {
//     getDataCategory();
//   }, []);

//   const handleChange = (e) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5000000) {
//         // 5MB limit
//         alert("File too large. Max size is 5MB.");
//         return;
//       }
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     setImage(null);
//     setPreview(null);
//   };

//   const handleUpload = async () => {
//     // Basic validation
//     if (!image) {
//       alert("Please select an image.");
//       return;
//     }
//     if (!product.productName.trim()) {
//       alert("Product name is required.");
//       return;
//     }
//     if (!product.price || parseFloat(product.price) <= 0) {
//       alert("Please enter a valid price.");
//       return;
//     }

//     setLoading(true);
//     setSubmitStatus(null);

//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", "DataIMG");

//     try {
//       const res = await axios.post(
//         "https://api.cloudinary.com/v1_1/dnnxwgvxa/image/upload",
//         formData
//       );
//       const imageUrl = res.data.secure_url;
//       const productData = { ...product, imageUrl };

//       await AddProduct(productData);

//       setSubmitStatus("success");
//       setTimeout(() => {
//         setProduct({
//           productName: "",
//           description: "",
//           price: "",
//           imageUrl: "",
//           stock_quantity: "",
//           categories: [],
//         });
//         setImage(null);
//         setPreview(null);
//         setSubmitStatus(null);
//       }, 2000);
//     } catch (error) {
//       console.error("Upload error:", error);
//       setSubmitStatus("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function getDataCategory() {
//     try {
//       const res = await getAllCategory();
//       setCategories(res.data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   }

//   const handleCategoryChange = (e) => {
//     const categoryId = e.target.value ? parseInt(e.target.value) : null;
//     setProduct((prevProduct) => ({
//       ...prevProduct,
//       categories: categoryId ? [{ categoryId }] : [],
//     }));
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//         Add New Product
//       </h2>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Image Upload Section */}
//         <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
//           <div className="flex flex-col items-center space-y-4">
//             <h3 className="text-lg font-semibold text-gray-700 self-start">
//               Product Image
//             </h3>

//             {!preview ? (
//               <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 bg-gray-50 transition-all hover:bg-gray-100">
//                 <label className="cursor-pointer flex flex-col items-center">
//                   <Image className="w-16 h-16 text-gray-400 mb-2" />
//                   <span className="text-gray-500 font-medium mb-2">
//                     Upload product image
//                   </span>
//                   <span className="text-xs text-gray-400 mb-4">
//                     PNG, JPG up to 5MB
//                   </span>
//                   <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
//                     <Upload className="w-4 h-4 mr-2" />
//                     Select Image
//                   </span>
//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     accept="image/*"
//                   />
//                 </label>
//               </div>
//             ) : (
//               <div className="relative w-full aspect-square">
//                 <img
//                   src={preview}
//                   alt="Product preview"
//                   className="w-full h-full object-contain rounded-lg border border-gray-200"
//                 />
//                 <button
//                   onClick={removeImage}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                   title="Remove image"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Product Details Form */}
//         <div className="w-full lg:w-2/3">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             Product Details
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             {/* Product Name */}
//             <div className="col-span-2 sm:col-span-1">
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Product Name*
//               </label>
//               <input
//                 type="text"
//                 name="productName"
//                 placeholder="Enter product name"
//                 value={product.productName}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//             </div>

//             {/* Price */}
//             <div className="col-span-2 sm:col-span-1">
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Price (VND)*
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Enter price"
//                 value={product.price}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//             </div>

//             {/* Description */}
//             <div className="col-span-2">
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 placeholder="Detailed description of the product"
//                 value={product.description}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//               />
//             </div>

//             {/* Stock Quantity */}
//             <div className="col-span-2 sm:col-span-1">
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Stock Quantity*
//               </label>
//               <input
//                 type="number"
//                 name="stock_quantity"
//                 placeholder="Enter quantity"
//                 value={product.stock_quantity}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//             </div>

//             {/* Category */}
//             <div className="col-span-2 sm:col-span-1">
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Category*
//               </label>
//               <select
//                 name="categories"
//                 value={product?.categories?.[0]?.categoryId || ""}
//                 onChange={handleCategoryChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
//               >
//                 <option value="">Select category</option>
//                 {categories?.map((category) => (
//                   <option key={category.categoryId} value={category.categoryId}>
//                     {category.categoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Submit Button */}
//             <div className="col-span-2 flex justify-end mt-4">
//               <button
//                 onClick={handleUpload}
//                 disabled={loading || submitStatus === "success"}
//                 className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center transition-all ${
//                   loading
//                     ? "bg-blue-400 cursor-not-allowed"
//                     : submitStatus === "success"
//                     ? "bg-green-600"
//                     : submitStatus === "error"
//                     ? "bg-red-600"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="animate-spin w-5 h-5 mr-2" />
//                     Processing...
//                   </>
//                 ) : submitStatus === "success" ? (
//                   <>
//                     <Check className="w-5 h-5 mr-2" />
//                     Product Added
//                   </>
//                 ) : submitStatus === "error" ? (
//                   <>
//                     <X className="w-5 h-5 mr-2" />
//                     Failed - Try Again
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5 mr-2" />
//                     Add Product
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Required fields note */}
//           <p className="text-gray-500 text-xs mt-6">
//             Fields marked with * are required
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadImage;
