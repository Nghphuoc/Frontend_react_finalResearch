import { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [product, setProduct] = useState({
    productName: "",
    description: "",
    price: "",
    imageUrl: "", // This will store the image URL
  });
  const [image, setImage] = useState(null); // This will store the selected image

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    // Check if image is selected
    if (!image) {
      alert("Please select an image.");
      return;
    }

    // Prepare FormData for Cloudinary upload
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "DataIMG"); // Cloudinary preset

    try {
      // Upload image to Cloudinary
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnnxwgvxa/image/upload",
        formData
      );
      const imageUrl = res.data.secure_url; // Get the image URL from Cloudinary

      // Send product data along with the image URL to the backend
      const productData = { ...product, imageUrl };

      // Send to backend (make sure the backend can handle multipart/form-data)
      const formDataToBackend = new FormData();
      formDataToBackend.append("productData", JSON.stringify(productData)); // Add the product data
      formDataToBackend.append("file", image); // Add the image file

      await axios.post("http://localhost:8080/api/product", formDataToBackend, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure content type is multipart
        },
      });

      console.log("Sản phẩm đã thêm thành công");
      alert("Sản phẩm đã được thêm!");
    } catch (error) {
      console.error("Lỗi tải ảnh hoặc tạo sản phẩm:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Thêm Sản Phẩm</h2>

      {/* Input for product name */}
      <div className="mb-4">
        <input
          type="text"
          name="productName"
          placeholder="Tên sản phẩm"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Input for description */}
      <div className="mb-4">
        <input
          type="text"
          name="description"
          placeholder="Mô tả"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Input for price */}
      <div className="mb-4">
        <input
          type="number"
          name="price"
          placeholder="Giá"
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Input for image */}
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Submit button */}
      <div className="mt-4">
        <button
          onClick={handleUpload}
          className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
