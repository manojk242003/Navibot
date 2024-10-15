import { useRecoilValue } from 'recoil';
import { cartState } from '../atoms/CartState';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Location } from '../atoms/Location';
import { Shops } from '../atoms/shops';

const Cart = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const locValue = useRecoilValue(Location);
  const shops = useRecoilValue(Shops);
  console.log(locValue)

  useEffect(() => {
    console.log(shops)
    axios.get('http://localhost:5000/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      console.log(res);
    }).catch(err => console.log(err));
  }, []);

  const cart = useRecoilValue(cartState);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleCheckout = async () => {
    if (!imageFile) {
      alert('Please upload an image for the order.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('details', JSON.stringify(cart));

      const shopLocation = shops.find(shop => shop.id === cart[0].shopId);
      console.log(shopLocation);
      formData.append('start_location', JSON.stringify({ lat: shopLocation.lat, lon: shopLocation.lon }));
      formData.append('end_location', JSON.stringify({ lat: locValue.lat, lon: locValue.lon }));
      if(locValue.lat!=""){
      const response = await axios.post('http://localhost:5000/order', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Order successfully placed!');
      console.log('Order created:', response.data);}
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">No items in cart</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => {
            const shop = shops.find(shop => shop.id === item.shopId);
            return (
              <li key={item.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">Shop: {shop?.name || 'Unknown'}</p>
                  <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                  <p className="text-gray-800 font-semibold">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</h3>
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Upload an Image</label>
          <input type="file" onChange={handleImageChange} className="mb-2" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 mt-2 rounded-lg object-cover" />}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
  