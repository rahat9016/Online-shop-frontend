import axios from "axios";

//Get All Categories
export const getSubs = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subs`);

// Get One sub
export const getSub = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/sub/${slug}`);

//Remove sub Item
export const removeSub = async (slug, authToken) =>
  await axios.delete(`${process.env.REACT_APP_API}/sub/${slug}`, {
    headers: {
      authToken,
    },
  });

export const updateSub = async (slug, sub, authToken) =>
  await axios.put(`${process.env.REACT_APP_API}/sub/${slug}`, sub, {
    headers: {
      authToken,
    },
  });
export const createSub = async (sub, authToken) =>
  await axios.post(`${process.env.REACT_APP_API}/sub`, sub, {
    headers: {
      authToken,
    },
  });
