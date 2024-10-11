// src/atoms/cartState.js
import { atom } from 'recoil';

// Define the cart atom
export const Location = atom({
  key: 'LocationState', // unique ID for the atom
  default: {lat:'',lon:''},      // default value for the cart (an empty array)
});
