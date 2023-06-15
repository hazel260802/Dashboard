const runInterval = (callback, interval) => {
    callback(); // Execute the callback immediately
  
    return setInterval(callback, interval);
  };
  
module.exports = { runInterval };
  