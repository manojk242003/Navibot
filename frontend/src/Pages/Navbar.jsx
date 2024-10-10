import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { cartState } from '../atoms/CartState';

const Navbar = () => {
  const navigate = useNavigate();
  const cart = useRecoilValue(cartState);
  const [loggedin,setLoggedin] = useState(false);

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);


  const logouthandler=()=>{
    localStorage.removeItem("token")

  }

  // const signinHandler = async () => {
  //   try {
  //       const res = await axios.post('http://localhost:5001/api/v1/signin', {
  //           username: username,
  //           password: password,
  //       });
  //       const { token, message } = res.data;

  //       if (token) {
  //           localStorage.setItem('token', token);
  //           console.log('Logged in');
  //           setLoggedin(true);
  //           setOpen(false); // Close modal after successful login
  //       } else {
  //           setErrorMessage(message || 'Login failed'); // Display server message if login fails
  //       }
  //   } catch (error) {
  //       setErrorMessage(
  //           error.response?.data?.message || 'An error occurred. Please try again.' // Handle errors
  //       );
  //   }
  // };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href='/'>daisyUI</a>
      </div>
      {
        !loggedin ? (
          <div> 
              <button onClick={()=>navigate("/signin")}className='border-rounded '>signin/</button>
              <button onClick={()=>navigate("/signup")}className='border-rounded '>signup</button>
          </div>
          
      ) 
        : (<div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Cart">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">{itemCount}</span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">{itemCount} Item{itemCount !== 1 ? 's' : ''}</span>
                <span className="text-info">Subtotal: ${subtotal}</span>
                <div className="card-actions">
                  <button onClick={() => navigate("/cart")} className="btn btn-primary btn-block">
                    View cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" aria-label="User Profile">
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><a>Settings</a></li>
              <li><button onClick={logouthandler}>Logout</button></li>
            </ul>
          </div>
        </div>)
      }
      
    </div>
  );
};

export default Navbar;
