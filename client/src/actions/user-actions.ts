import axios from "axios";

export async function registerUser(
  name: string,
  userName: string,
  email: string,
  password: string,
  avatar: string
) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/user/register`,
      {
        name,
        userName,
        email,
        password,
        avatar,
      }
    );

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("REGISTER_USER_ERROR", error);
    throw error;
  }
}

export async function loginUser(
  isEmail: boolean,
  password: string,
  loginField: string
) {
  try {
    const res = isEmail
      ? await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/login`,
          {
            email: loginField,
            password,
          }
        )
      : await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/login`,
          { 
            userName: loginField,
            password,
          }
        );

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("LOGIN_USER_ERROR", error);
    throw error;
  }
}
