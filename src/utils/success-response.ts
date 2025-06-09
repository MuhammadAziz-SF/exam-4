export const successRes = (resData: any, code: number = 200) => {
  return {
    statusCode: code,
    message: 'success',
    data: resData,
  };
};
