// src/atoms/cartState.js
import { atom } from 'recoil';

// Define the cart atom
export const Shops = atom({
  key: 'Shops', // unique ID for the atom
  default:   [{
    id: 1,
    name: "Shop1",
    description: "Food",
    image: "https://namesurfy.com/wp-content/uploads/2022/12/Fast-Food-Restaurant-name-ideas-banner.webp",
    menuItems:[
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
      ],
    location:"13.008558698875431, 74.79518309195329"
  },
  {
    id: 2,
    name: "Shop2",
    description: "Food",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStuUJWO4NfGa_bDIh4uIrJzC_g1F1TORgr_A&s",
    menuItems:[
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
      ],
    location:"13.008558698875431, 74.79518309195329"
  },  ]
});
