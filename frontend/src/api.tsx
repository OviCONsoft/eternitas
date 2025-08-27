import { Visibility } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

type pubproftype = {
  id: number;
  First_name: string;
  Middle_name: string;
  Last_name: string;
  Privacy: boolean;
  Profile_pic: string;
};

export interface profiledata {
  profileType: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string; // Date of Birth
  deathDate: string; // Date of Death
  relationship: string;
  description: string;
}

export const loginUser = async (
  email: string,
  password: string,
  remember: boolean
) => {
  try {
    await axios.post(
      `${process.env.REACT_APP_SERVER_ENV}/api/login`,
      { email, password, remember }, // Request body
      {
        withCredentials: true, // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extract error message from the response
      throw new Error(`${error.response.data.detail}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    // Sending the POST request using axios
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_ENV}/api/register`,
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
        throw new Error(error.message);
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const resetpassword = async (email: string) => {
  try {
    await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/forgotpassword`, {
      email: email,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const updatepassword = async (password: string) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_ENV}/api/updatepassword`,
      { password: password },
      { withCredentials: true }
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
        throw new Error(error.message);
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const profilesubmit = async (data: profiledata) => {
  try {
    await axios.post(
      `${process.env.REACT_APP_SERVER_ENV}/api/createprofile`,
      data,
      { withCredentials: true }
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
        throw new Error(error.message);
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const getprofiledata = async () => {
  try {
    const response = await axios
      .get(`${process.env.REACT_APP_SERVER_ENV}/api/editprofile`, {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.detail}`,
        });
      } else if (error?.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const profileupload = async (picture: File) => {
  try {
    const formData = new FormData();
    formData.append("file", picture);
    await axios.post(
      `${process.env.REACT_APP_SERVER_ENV}/api/uploadpic`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
        throw new Error(error.message);
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const mediaupload = async (media: File[]) => {
  try {
    const formData = new FormData();

    media.forEach((file) => {
      formData.append("files", file);
    });

    await axios.post(
      `${process.env.REACT_APP_SERVER_ENV}/api/uploadmedia`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
        throw new Error(error.message);
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const getmedia = async () => {
  try {
    const response = await axios
      .get(`${process.env.REACT_APP_SERVER_ENV}/api/getmedia`, {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.detail}`,
        });
      } else if (error?.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const getpublicmedia = async (id: number) => {
  try {
    const response = await axios
      .post(
        `${process.env.REACT_APP_SERVER_ENV}/api/profilemedia/${id}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        return res.data;
      });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.detail}`,
        });
      } else if (error?.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const getpublicprofiledata = async (id: number) => {
  try {
    const response = await axios
      .post(
        `${process.env.REACT_APP_SERVER_ENV}/api/profiledata/${id}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        return res.data;
      });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.detail}`,
        });
      } else if (error?.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const deletemedia = async (fname: string) => {
  try {
    await axios.delete(
      `${process.env.REACT_APP_SERVER_ENV}/api/deletemedia/${fname}`,
      { withCredentials: true }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.detail}`,
        });
      } else if (error?.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
    }
  }
};

export const changevisibility = async (
  visibility: boolean,
  pagepassword: string
) => {
  try {
    axios.patch(
      `${process.env.REACT_APP_SERVER_ENV}/api/profile/visibility`,
      { Privacy: visibility, Pagepassword: pagepassword },
      { withCredentials: true }
    );
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops..",
      text: `Couldn't turn visibility ${visibility ? "Private" : "Public"}`,
    });
  }
};

export const publicprof = async (): Promise<pubproftype[] | undefined> => {
  try {
    const response = await axios.get<pubproftype[]>(
      `${process.env.REACT_APP_SERVER_ENV}/api/publicuserdata`
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops..",
      text: `Couldn't fetch public data of users"}`,
    });
  }
};
