const successTrue = (message, resData) => ({
  success: true,
  message,
  resData,
});

const successFalse = (message, resData) => ({
  success: false,
  message,
  resData,
});

module.exports = {
  successTrue,
  successFalse,
};
