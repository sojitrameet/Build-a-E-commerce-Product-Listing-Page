import { useEffect, useState } from "react";
import './App.css';
import { FaShoppingCart } from 'react-icons/fa'; // For cart icon
import { FaTrashAlt } from 'react-icons/fa'; 

function App() {
  const [display, setDisplay] = useState([]);
  const [cart, setCart] = useState([]); // Store products added to the cart
  const [showCart, setShowCart] = useState(false); // For toggling the cart view
  const [iconClicked, setIconClicked] = useState(false); // Track if the cart icon is clicked

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
        // If the product already exists in the cart, increase the quantity
        existingProduct.quantity += 1;
      } else {
        // If the product is not in the cart, add it with quantity 1
        updatedCart.push({ ...product, quantity: 1 });
      }

      return updatedCart;
    });
  };
  const handleCartClick = () => {
    setShowCart(!showCart); // Toggle the cart view
    setIconClicked(true); // Mark the icon as clicked to apply opacity change
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId)); // Remove product from cart

  };

  // Calculate total price of the cart
  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-blue-600">Product Listing</h1>

      <div className="relative">
        <FaShoppingCart
          className={`text-3xl cursor-pointer transition-opacity duration-300 ${iconClicked ? 'opacity-100' : 'opacity-50'}`}
          onClick={handleCartClick} // Toggle cart view on click
        />
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
            {cart.reduce((total, product) => total + product.quantity, 0)} {/* Display item count */}
          </span>
        )}
      </div>
    </div>

    {/* Off-Canvas Cart (Side Drawer) */}
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 ${showCart ? 'transform translate-x-0' : 'transform translate-x-full'}`}
      style={{ zIndex: 100 }}
    >
       <button
      className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
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
                <span>{product.title} (x{product.quantity})</span>
                <span>${(product.price * product.quantity).toFixed(2)}</span>
                <FaTrashAlt
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 cursor-pointer ml-2"
                  />
              </li>
            ))
          ) : (
            <li>Your cart is empty</li> // Show empty message if no products in the cart
          )}
        </ul>
        {cart.length > 0 && (
          <div className="mt-4 text-lg font-semibold">
            <p>Total Price: ${getTotalPrice()}</p>
          </div>
        )}
      </div>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                onClick={() => AddToCart(product)} // Add the product to the cart
                className="w-full bg-blue-500 mt-2 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
