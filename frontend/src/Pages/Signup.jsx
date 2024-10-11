import React, { useState } from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [username, setusername] = useState('');
    const [lastName, setLastName] = useState('');
    
    
    const signupHandler = (e) => {
      e.preventDefault();
      console.log(username,email,password)
      axios.post("http://localhost:5000/register",{email,password,username}).then(res=>{
          console.log(res)  
          alert("Refistered successfully  ")
      }).catch((err)=>{
        // alert("Wrong password or User does not exists")
        console.log("Some error occured")
        console.log(err)
      })
    }
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            /> */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Sign up to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <form action="#" method="POST" className="space-y-6"> */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  Username
                </label>
                <div className="mt-2">
                  <input
                  onChange={(e) => setusername(e.target.value)}
                    id="user_name"
                    name="user_name"
                    type="user_name"
                    required
                    autoComplete="email"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                    Password
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                    Confirm Password
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                //   type="submit"
                    onClick={signupHandler}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            {/* </form> */}
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account ?{' '}
              <Link to="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                signin
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }
  
export default Signup
