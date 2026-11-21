import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
    name: "favourites",
    initialState: {
    items: [],
    items: JSON.parse(localStorage.getItem("eventsphere-favorites")) || [],
  },
    reducers: {
        toggleFavorites(state, action) {
            const event = action.payload;
            const isEventExists = state.items.find((e) => (e.id || e._id) === (event._id || event.id))
            if(isEventExists){
                state.items = state.items.filter((e) => (e.id || e._id) !== (event._id || event.id))
            }else{
                state.items.push(event)
            }
            localStorage.setItem("eventsphere-favorites" , JSON.stringify(state.items))

        },
        removeFavorites(state) { },
        clearFavorties(state) {
            state.items = [];
            localStorage.clear("eventsphere-favorites")
         },
    },

})

export const { toggleFavorites, removeFavorites, clearFavorties } =
    favouriteSlice.actions;


export default favouriteSlice.reducer