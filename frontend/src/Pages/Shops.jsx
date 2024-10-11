import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartState } from '../atoms/CartState';

const Shop = () => {
  const navigate = useNavigate();
  const [cart] = useRecoilState(cartState);
  const shops = [
    {
      id: 1,
      name: "Shop1",
      description: "Food",
      image: "https://namesurfy.com/wp-content/uploads/2022/12/Fast-Food-Restaurant-name-ideas-banner.webp",
      location:"13.008558698875431, 74.79518309195329"
    },
    {
      id: 2,
      name: "Shop2",
      description: "Food",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStuUJWO4NfGa_bDIh4uIrJzC_g1F1TORgr_A&s",
      location:"13.008558698875431, 74.79518309195329"
    },
    // Add more shops as needed
  ];

  const handleClick = (id, currentShopId) => {
      navigate(`/shop/${id}`);
    
  };

  return (
    <div className="flex flex-wrap m-2">
      {shops.map((shop) => (
        <div key={shop.id} className="card bg-slate-100 w-96 shadow-xl m-2">
            <img className='h-[60%] w-full' src={shop.image} alt={shop.name} />
          <div className="card-body">
            <h2 className="card-title">{shop.name}</h2>
            <p>{shop.description}</p>
            <div className="card-actions justify-end">
              <button 
                className="btn bg-[#FF5200] text-black" 
                onClick={() => handleClick(shop.id, shop.id)} // Pass the shop ID to the function
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shop;
