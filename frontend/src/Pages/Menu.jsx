import MenuComponent from "../Components/MenuComponent";
import Navbar from "./Navbar";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState } from "../atoms/CartState";
import { Shops } from "../atoms/shops";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Menu() {
  const [cart, setCart] = useRecoilState(cartState);
  const shops = useRecoilValue(Shops);
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const selectedShop = shops.find((shop) => shop.id === Number(id));
    setMenuItems(selectedShop?.menuItems || []);
  }, [id, shops]);

  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].shopId !== Number(id)) {
      alert("You cannot add items from a different shop. Please clear your cart first.");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, shopId: Number(id), quantity: 1 }];
      }
    });
  };

  return (
    <div className="h-screen w-full bg-white">
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3 bg-white">
        {menuItems.map((item) => (
          <MenuComponent
            key={item.id}
            item={item}
            shopId={Number(id)}
            addToCart={() => addToCart(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
