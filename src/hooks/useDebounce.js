// bhai  future me looking at it and confusing , suen lahi dhyan se e bas sirji padhwai rahthin thik isliye likhal chhhai thik naa isliye ispe confuse mat ho thik. keep learning and keep growing

import { useEffect, useState } from "react";

  // function searchEvent(query){
    
  // }

  // function debounce(fn , delay){
  //   let timer;
  //   return function (...args){
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       fn(...args);
  //     },delay)
      
  //   }
  // }

  // const debouncedSearch = debounce(searchEvent , 350)

  // debouncedSearch()


  export function useDebounce(value , delay=350){
    const [debouncedValue , setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(timer);
      }
    } , [value , delay])

    return debouncedValue;
  }