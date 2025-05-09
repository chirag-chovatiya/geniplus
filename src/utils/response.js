// const sendResponse = (func, statusCode, message, data) => {
//   const obj = {
//       code: statusCode,
//       message: message
//     }
//     return func.json({ data, ...obj });
// }

// export default sendResponse



const sendResponse = (func, statusCode, message, data) => {
  let obj
  if (data) {
    obj = {
      code: statusCode,
      message: message,
      data: data
    }
  } else {
    obj = {
      code: statusCode,
      message: message
    }
  }
  return func.json({ data, ...obj });
}
export default sendResponse
