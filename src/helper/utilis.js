export const parseErrorResponse = error => {
  let message = 'There was some problem. Please try again';
  let data;
  let redirect = true;
  if (error && error.response && error.response.data) {
    const result = error.response.data;
    const status = result.status;
    message = result.message;

    switch (status) {
      case 404:
        data = {
          status,
          message,
          redirect,
        };
        break;

      case 500:
        data = {
          status,
          message,
          redirect: false,
        };
        break;

      default:
        data = {
          status,
          message,
          redirect: false,
        };
        break;
    }
  } else {
    data = {
      status: 400,
      message,
      redirect,
    };
  }

  return data;
};
