import { configureStore } from "@reduxjs/toolkit";
import favouriteSliceReducer from "./slice/favouriteSlice"
export const store = configureStore({
    reducer : {
       favourites :  favouriteSliceReducer ,
    } , 
});
