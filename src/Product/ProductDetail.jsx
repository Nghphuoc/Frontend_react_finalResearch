// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { Star } from "lucide-react";
// import { getProduct } from "./service";
// import { addProductToCart } from "./service";
// import toast, { Toaster } from "react-hot-toast";
// import NavBar from "../Nav/Navbar";
// import Footer from "../Foot/Footer";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState([]);
// const cartId = sessionStorage.getItem("cartId");

//   useEffect(() => {
//     // Giả lập dữ liệu sản phẩm
//         getProduct(id).then((response)=>{
//         setProduct(response.data);
//       })
//       .catch((error)=>{
//         console.error(error);
//       })

//   }, [id]);


//   // function add to cart 

// const handleClickAddToCart = async (productId) => {
//   if (!cartId || !productId) {
//     toast.error("You must be logged in to add products to cart");
//     navigate("/home");
//     return;
//   }
//   const cartResponse = await addProductToCart(cartId, productId);
//   if (cartResponse) {
//     toast.success("add product success");
//   } else {
//     toast.error("add product failed");
//   }
//   };


//   const reviews = [
//     { user: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm rất tốt!" },
//     { user: "Trần Thị B", rating: 4, comment: "Hiệu năng ổn định." },
//   ];

//   if (!product) return <p className="text-center text-lg">Loading...</p>;

//   return (
//     <>
//     <NavBar/>
//       <Toaster />
//       <div className="max-w-4xl mx-auto p-6">
//         {/* Card được thay thế bằng div */}
//         <div className="p-6 shadow-lg rounded-2xl border bg-white">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <img
//               src={product.imageUrl}
//               alt={product.productName}
//               className="rounded-xl shadow-md"
//             />
//             <div>
//               <h1 className="text-3xl font-bold">{product.productName}</h1>
//               <p className="text-xl text-red-500 font-semibold">
//                 ${product.price}
//               </p>
//               <p className="mt-4 text-gray-700">{product.description}</p>
//               <p className="mt-2 text-gray-600 text-sm">
//                 Bảo hành 24 tháng chính hãng.
//               </p>
//               {/* Sử dụng button mặc định của Tailwind thay cho react-bootstrap */}

//               <button
//                 className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//                 onClick={() => handleClickAddToCart(product.productId)}
//               >
//                 Thêm vào giỏ hàng
//               </button>
//             </div>
//           </div>
//           <div className="mt-6">
//             <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
//             <div className="mt-4 space-y-4">
//               {reviews.map((review, index) => (
//                 <div key={index} className="p-4 border rounded-lg shadow-sm">
//                   <p className="font-semibold">{review.user}</p>
//                   <div className="flex items-center space-x-1 text-yellow-500">
//                     {Array(review.rating)
//                       .fill()
//                       .map((_, i) => (
//                         <Star key={i} size={16} />
//                       ))}
//                   </div>
//                   <p className="text-gray-700 mt-1">{review.comment}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </>
//   );
// };

// export default ProductDetail;



import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProduct, addProductToCart } from "./service";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../Nav/Navbar";
import Footer from "../Foot/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const cartId = sessionStorage.getItem("cartId");

  useEffect(() => {
    getProduct(id)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleClickAddToCart = async (productId) => {
    if (!cartId || !productId) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    const cartResponse = await addProductToCart(cartId, productId);
    cartResponse
      ? toast.success("Thêm sản phẩm thành công")
      : toast.error("Thêm sản phẩm thất bại");
  };

  if (!product) return <p className="text-center text-lg">Đang tải...</p>;

  return (
    <>
      <NavBar />
      <Toaster />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="rounded-xl shadow-md object-cover w-full md:w-1/2"
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.productName}
            </h1>
            <p className="text-2xl text-red-600 font-semibold">
              ${product.price}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            <p className="text-gray-500 text-sm">
              Bảo hành 24 tháng chính hãng.
            </p>
            <button
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
              onClick={() => handleClickAddToCart(product.productId)}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm</h2>
          <div className="space-y-4">
            {[
              { user: "Nguyễn Văn Minh", rating: 5, comment: "Sản phẩm rất tốt!" },
              { user: "Trần Thị Thanh ", rating: 4, comment: "Hiệu năng ổn định." },
            ].map((review, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <p className="font-semibold text-gray-800">{review.user}</p>
                <div className="flex items-center space-x-1 text-yellow-500">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <Star key={i} size={16} />
                    ))}
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
