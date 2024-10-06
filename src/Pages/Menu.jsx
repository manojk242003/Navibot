import MenuComponent from "../Components/MenuComponent";
import Navbar from "./Navbar";
import { useRecoilState } from "recoil";
import { cartState } from "../atoms/CartState";  // Ensure cartState is imported

const menuItems = [
  { 
    id: 1,
    title: "Lime",
    price: 80,
    description: "A refreshing and tangy citrus delight bursting with vibrant flavors.",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    rating: 4.3,
    reviews: 81,
  },
  { 
    id: 2,
    title: "Mango Shake",
    price: 100,
    description: "A creamy and rich mango shake that leaves you craving for more.",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    rating: 4.5,
    reviews: 120,
  },
  { 
    id: 3,
    title: "Pineapple Juice",
    price: 70,
    description: "Sweet and tangy pineapple juice that refreshes your senses.",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    rating: 4.7,
    reviews: 45,
  },
];

function Menu() {
  const [cart, setCart] = useRecoilState(cartState);  // Manage cart state

  return (
    <div>
      <Navbar /> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
        {menuItems.map((item) => (
          <MenuComponent
            key={item.id}  // Use a unique key for each component
            item={item}// Pass cart state
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
