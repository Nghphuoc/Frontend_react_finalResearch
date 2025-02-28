
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import NavBar from "../Nav/Navbar";
import Footer from "../Foot/Footer";

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState("Pink");
  const [selectedSSD, setSelectedSSD] = useState("256GB");
  const [quantity, setQuantity] = useState(1);
  const images = [
    "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
    "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-side.svg",
    "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-back.svg",
  ];
const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <>
    <NavBar/>
      <div className="max-w-6xl mx-auto p-6 flex gap-8">
        {/* Image Section */}
        <div className="w-1/2">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <img className="w-full" src={selectedImage} alt="Product" />{" "}
          </div>
          {/* Thumbnail Images */}
          <div className="flex gap-4 mt-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 border-2 rounded-md cursor-pointer ${
                  selectedImage === image
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-1/2 space-y-4">
          <p className="text-green-600 font-semibold">In stock</p>
          <h1 className="text-2xl font-bold">
            Apple iMac 24" All-In-One Computer
          </h1>
          <p className="text-lg">
            Apple M1, 8GB RAM, {selectedSSD} SSD, Mac OS, {selectedColor}
          </p>
          <p className="text-3xl font-bold">$1,249.99</p>

          {/* Color Selection */}
          <div>
            <p className="font-semibold">Colour</p>
            <div className="flex gap-2 mt-2">
              {["Green", "Pink", "Silver", "Blue"].map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded-md ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* SSD Selection */}
          <div>
            <p className="font-semibold">SSD capacity</p>
            <div className="flex gap-2 mt-2">
              {["256GB", "512GB", "1TB"].map((ssd) => (
                <button
                  key={ssd}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSSD === ssd ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedSSD(ssd)}
                >
                  {ssd}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup & Shipping */}
          <div>
            <p className="font-semibold">Pickup</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="pickup" className="form-radio" />{" "}
                Shipping - $19 (Arrives Nov 17)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="pickup" className="form-radio" />{" "}
                Pickup from Flowbox - $9
              </label>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="radio"
                  name="pickup"
                  className="form-radio"
                  disabled
                />{" "}
                Pickup from our store (Not available)
              </label>
            </div>
          </div>

          {/* Warranty Selection */}
          <div>
            <p className="font-semibold">Add extra warranty</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="warranty" className="form-radio" /> 1
                year - $39
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="warranty" className="form-radio" /> 2
                years - $69
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="warranty" className="form-radio" /> 3
                years - $99
              </label>
            </div>
          </div>

          {/* Quantity & Cart */}
          <div className="flex items-center gap-4 mt-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded-md p-2 text-center"
            />
            <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md">
              <ShoppingCart size={20} /> Add to cart
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
