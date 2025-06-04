import { useEffect, useState } from "react";
import './App.css';
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';

function App() {
  const [display, setDisplay] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((json) => {
        setDisplay(json.products);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const AddToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingProduct = updatedCart.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      return updatedCart;
    });
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
    setIconClicked(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, product) => total + product.price * product.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mb-2 mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">MyShop</div>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">About</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Login</li>

          </ul>
          <FaShoppingCart
            className={`text-3xl cursor-pointer transition-opacity duration-300 ${iconClicked ? 'opacity-100' : 'opacity-50'
              }`}
            onClick={handleCartClick}
          />
          {cart.length > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((total, product) => total + product.quantity, 0)}
            </span>
          )}
        </div>
      </nav>



      {/* Off-Canvas Cart */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${showCart ? 'transform translate-x-0' : 'transform translate-x-full'
          }`}
        style={{ zIndex: 100 }}
      >
        <button
          className="absolute top-3 right-5 text-gray-600 hover:text-red-500 text-2xl font-bold px-2"
          onClick={() => setShowCart(false)}
        >
          &times;
        </button>
        <div className="p-4">
          <h3 className="text-xl font-semibold">Your Cart</h3>
          <ul className="mt-2">
            {cart.length > 0 ? (
              cart.map((product) => (
                <li key={product.id} className="flex justify-between items-center py-2 border-b">
                  {/* <span>{product.title} (x{product.quantity})</span> */}

                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{product.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCart((prevCart) =>
                            prevCart.map((item) =>
                              item.id === product.id && item.quantity > 1
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                            )
                          )
                        }
                        className="px-2 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{product.quantity}</span>
                      <button
                        onClick={() =>
                          setCart((prevCart) =>
                            prevCart.map((item) =>
                              item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                            )
                          )
                        }
                        className="px-2 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>


                  <span>${(product.price * product.quantity).toFixed(2)}</span>
                  <FaTrashAlt
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 cursor-pointer ml-2"
                  />
                </li>
              ))
            ) : (
              <li>Your cart is empty</li>
            )}
          </ul>
          {cart.length > 0 && (
            <div className="mt-4 text-lg font-semibold">
              <p>Total Price: ${getTotalPrice()}</p>
              <button
                onClick={() => {
                  alert("Your order is successful!");
                  setCart([]);
                  setShowCart(false);
                }}
                className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {display.map((product) => (
            <div
              key={product.id}
              className="card bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-800 font-medium">
                  <strong>Price:</strong> ${product.price}
                </p>
                <p className="text-yellow-600">
                  <strong>Rating:</strong> ⭐ {product.rating}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Category:</strong> {product.category}
                </p>
                <button
                  onClick={() => AddToCart(product)}
                  className="w-full bg-blue-500 mt-2 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
