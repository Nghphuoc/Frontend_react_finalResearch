import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-white shadow-sm pt-20">
      {/* Call to Action Section - Đẩy lên trên footer */}
      <div className="flex justify-center items-center  mt-10 h-32 relative z-10">
        <div className="bg-gray-200 w-1/2 max-w-lg text-slate-800 text-center py-8 px-6 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold">Ready for a next project?</h2>
          <p className="mt-2">Let's get started!</p>
          <button className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300">
            Contact us
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-200  text-slate-800 py-16 mt-0 relative z-0 text-sm">
        <div className="mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold">COLORLIB</h3>
              <p className="mt-2">© 2019</p>
            </div>
            <div>
              <h3 className=" font-bold">Customers</h3>
              <ul className="mt-2 space-y-1">
                <li>Buyer</li>
                <li>Supplier</li>
              </ul>
            </div>
            <div>
              <h3 className=" font-bold">Company</h3>
              <ul className="mt-2 space-y-1">
                <li>About us</li>
                <li>Careers</li>
                <li>Contact us</li>
              </ul>
            </div>
            <div>
              <h3 className=" font-bold">Further Information</h3>
              <ul className="mt-2 space-y-1">
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className=" font-bold">Follow us</h3>
              <div className="flex justify-center md:justify-start mt-2 space-x-3">
                <a
                  href="https://www.facebook.com/Huuphuoc.1025?mibextid=ZbWKwL"
                  className="hover:text-blue-800 text-4xl bg-white text-blue-600 transition duration-300"
                >
                  <FaFacebookSquare />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-800 text-4xl text-gray-600 bg-white transition duration-300"
                >
                  <FaSquareXTwitter />
                </a>
                <a
                  href="#"
                  className="bg-white text-4xl hover:text-blue-900 text-blue-700 transition duration-300"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  className="bg-white text-4xl hover:text-fuchsia-400 text-pink-500 transition duration-300"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
