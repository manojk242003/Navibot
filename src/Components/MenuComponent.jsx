import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { cartState } from '../atoms/CartState';

const MenuComponent = ({ item }) => {
  const [cart, setCart] = useRecoilState(cartState);

  // Function to add the item to the cart or update its quantity
  const addToCart = () => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // If the item already exists in the cart, update its quantity
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // If the item doesn't exist, add it to the cart with quantity 1
      const newItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        image: item.image,
        rating: item.rating,
        reviews: item.reviews,
        quantity: 1, // Initialize quantity to 1
      };
      setCart([...cart, newItem]);
    }
    
  };
  console.log(cart)

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="flex items-center">
        <div className="text-sm text-red-500 font-bold mr-2">🌟 Bestseller</div>
      </div>

      {/* Title and Price */}
      <div className="mt-2 mb-2 text-black">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-lg font-bold">₹{item.price}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center text-green-600 text-sm">
        <span>⭐ {item.rating}</span>
        <span className="ml-2 text-gray-500">({item.reviews})</span>
      </div>

      {/* Description */}
      <p className="text-gray-500 mt-2">{item.description}</p>

      {/* Image and Add Button */}
      <div className="flex justify-between items-center mt-4">
        {/* Image */}
        <img
          src={item.image} // Use the image prop passed
          alt={item.title}
          className="w-24 h-24 rounded-lg object-cover"
        />

        {/* Add Button */}
        <button
          onClick={addToCart}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
        >
          ADD
        </button>
      </div>
    </div>
  );
};

MenuComponent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
  }).isRequired,
};

export default MenuComponent;
