import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { cartState } from '../atoms/CartState';

const MenuComponent = ({ item, shopId }) => {
  const [cart, setCart] = useRecoilState(cartState);

  const addToCart = () => {
    if (cart.length > 0 && cart[0].shopId !== shopId) {
      alert('You can only add items from the same shop.');
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      const newItem = {
        ...item,
        quantity: 1,
        shopId,
      };
      setCart([...cart, newItem]);
    }
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="flex items-center">
        <div className="text-sm text-red-500 font-bold mr-2">🌟 Bestseller</div>
      </div>
      <div className="mt-2 mb-2 text-black">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-lg font-bold">₹{item.price}</p>
      </div>
      <div className="flex items-center text-green-600 text-sm">
        <span>⭐ {item.rating}</span>
        <span className="ml-2 text-gray-500">({item.reviews})</span>
      </div>
      <p className="text-gray-500 mt-2">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-24 h-24 rounded-lg object-cover"
        />
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
  shopId: PropTypes.number.isRequired,
};

export default MenuComponent;
