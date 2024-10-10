// src/atoms/cartState.js
import { atom } from 'recoil';

// Define the cart atom
export const cartState = atom({
  key: 'cartState', // unique ID for the atom
  default: [],      // default value for the cart (an empty array)
});
