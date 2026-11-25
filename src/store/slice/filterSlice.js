import { createSlice } from "@reduxjs/toolkit";

 const filterSlice = createSlice({
    name : "filters" , 
    initialState : {
        search : "" , 
        format : "" , 
        isPaid : "" ,
        category : ""
    } , 
    reducers : {
        setFormat(state , action){
            state.format = action.payload
        },
        setEntry(state , action){
            state.isPaid = action.payload
        }
    }
})

export const { setFormat  , setEntry} = filterSlice.actions;

export default filterSlice.reducer