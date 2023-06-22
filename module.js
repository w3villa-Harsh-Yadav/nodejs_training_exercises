const calculateFactorial = (a) => {
  let factorial = 1;
  if (a == 0) {
    factorial = 0;
  } else {
    for (let i = a; i >= 1; i--) {
      factorial *= i;
    }
  }
  return factorial;
};

module.exports = {
    calculateFactorial,
};
