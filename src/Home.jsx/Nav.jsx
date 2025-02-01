

function Navtest (){


    return (
      <>
        <div>
          <header className="bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              <div className="flex items-center">
                <i className="fas fa-watch text-2xl"></i>
                <span className="ml-2 text-xl font-bold">XTRA Watch</span>
              </div>
              <nav className="flex space-x-4">
                <a href="#" className="text-black hover:text-gray-700">
                  Home
                </a>
                <div className="relative group">
                  <a
                    href="#"
                    className="text-black hover:text-gray-700 flex items-center"
                  >
                    Collections <i className="fas fa-chevron-down ml-1"></i>
                  </a>

                  <div className="absolute left-0 mt-2 w-max bg-white shadow-lg rounded-md hidden group-hover:flex p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {[
                        { title: "Modern Watch", icon: "fas fa-watch" },
                        { title: "Classic Watch", icon: "fas fa-clock" },
                        { title: "Sports Watch", icon: "fas fa-stopwatch" },
                        { title: "Bestsellers", icon: "fas fa-star" },
                        { title: "Custom Watch", icon: "fas fa-cogs" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-md p-6 text-center w-40"
                        >
                          <i className={`${item.icon} text-6xl mb-4`}></i>
                          <h2 className="text-xl font-bold mb-4">
                            {item.title}
                          </h2>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                            Check Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <a href="#" className="text-black hover:text-gray-700">
                  Watches
                </a>
                <div className="relative group">
                  <a href="#" className="text-black hover:text-gray-700">
                    Quick find <i className="fas fa-chevron-down"></i>
                  </a>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                    <a
                      href="#"
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                    >
                      Find 1
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                    >
                      Find 2
                    </a>
                  </div>
                </div>
                <div className="relative group">
                  <a href="#" className="text-black hover:text-gray-700">
                    Pages <i className="fas fa-chevron-down"></i>
                  </a>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                    <a
                      href="#"
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                    >
                      Page 1
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                    >
                      Page 2
                    </a>
                  </div>
                </div>
              </nav>
              <div className="flex items-center space-x-4">
                <button className="bg-black text-white px-4 py-2 rounded-full">
                  Contact Us
                </button>
                <div className="relative">
                  <i className="fas fa-shopping-cart text-2xl"></i>
                  <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs rounded-full px-1">
                    0
                  </span>
                </div>
              </div>
            </div>
          </header>
        </div>
      </>
    );
}

export default Navtest;