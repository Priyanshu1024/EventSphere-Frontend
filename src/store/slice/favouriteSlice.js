import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
    name: "favourites",
    initialState: {
        name: "nishant",
    },
    reducers: {
        toggleFavorites(state) {


        },
        removeFavorites(state) { },
        clearFavorties(state) { },
    },

})

export const { toggleFavorites, removeFavorites, clearFavorties } =
    favouriteSlice.actions;


export default favouriteSlice.reducer