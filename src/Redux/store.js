import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "./propertySlice"; // Import the slice

const store = configureStore({
  reducer: {
    properties: propertyReducer,
  },
});

export default store;
