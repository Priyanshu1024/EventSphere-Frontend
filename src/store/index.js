import { configureStore } from "@reduxjs/toolkit";
import favouriteSliceReducer from "./slice/favouriteSlice"
import filterSliceReducer from "./slice/filterSlice"
export const store = configureStore({
    reducer : {
       favourites :  favouriteSliceReducer ,
       filters : filterSliceReducer 
    } , 
});
