import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProduct } from "./service";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu sản phẩm
        getProduct(id).then((response)=>{
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error)=>{
        console.error(error);
      })

  }, [id]);

//   reviews: [
//     { user: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm rất tốt!" },
//     { user: "Trần Thị B", rating: 4, comment: "Hiệu năng ổn định." },
//   ];

  if (!product) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Card được thay thế bằng div */}
      <div className="p-6 shadow-lg rounded-2xl border bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="rounded-xl shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            <p className="text-xl text-red-500 font-semibold">$
              {product.price}
            </p>
            <p className="mt-4 text-gray-700">{product.description}</p>
            <p className="mt-2 text-gray-600 text-sm">
              Bảo hành 24 tháng chính hãng.
            </p>
            {/* Sử dụng button mặc định của Tailwind thay cho react-bootstrap */}
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
          <div className="mt-4 space-y-4">
            {/* {reviews.map((review, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm">
                <p className="font-semibold">{review.user}</p>
                <div className="flex items-center space-x-1 text-yellow-500">
                  {Array(review.rating)
                    .fill()
                    .map((_, i) => (
                      <Star key={i} size={16} />
                    ))}
                </div>
                <p className="text-gray-700 mt-1">{review.comment}</p>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
