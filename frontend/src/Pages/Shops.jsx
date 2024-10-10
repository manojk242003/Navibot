import { useNavigate } from 'react-router-dom';

const Shop = () => {
    const navigate = useNavigate();
    const shops = [
        {
            id: 1,
            name: "Shop1",
            description: "Food",
            image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        },
        {
            id: 2,
            name: "Shop2",
            description: "Food",
            image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        },
        // Add more shops as needed
    ];

    const handleClick = (id) => { 
        navigate(`/shop/${id}`);
        // Implement any further logic here
    }

    return (
        <div className="flex flex-wrap m-2">
            {shops.map((shop) => (
                <div key={shop.id} className="card bg-base-100 w-96 shadow-xl m-2">
                    <figure>
                        <img src={shop.image} alt={shop.name} />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{shop.name}</h2>
                        <p>{shop.description}</p>
                        <div className="card-actions justify-end">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => handleClick(shop.id)}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Shop;
