
import { useRecoilValue } from 'recoil';
import { cartState } from '../atoms/CartState';

const Cart = () => {
  const cart = useRecoilValue(cartState);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>No items in cart</p> : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x ${item.price}
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
    </div>
  );
};

export default Cart;
