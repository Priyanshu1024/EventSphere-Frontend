 // This is throttling ok now i am gonna write throttling code

  // function throttle(fn , delay){
  //   let shouldWait = false;
  //   return function (...args){

  //     fn(...args);
  //     shouldWait = True;
  //     setTimeout(() => {
  //       shouldWait = false;
  //     }, delay);
  //   }
  // }


  // timestamp based approach

  // function throttle(fn , delay){
  //   let lastExecuted = 0;
  //   return function (...args){
  //     let now = Date.now();

  //     if(now - lastExecuted >= delay){
  //       fn(...args);
  //       lastExecuted = now;
  //     }
      
  //   }
  // }