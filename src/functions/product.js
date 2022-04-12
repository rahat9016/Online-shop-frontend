import axios from "axios";

export const createProduct = async (product, authToken) =>
  await axios.post(`${process.env.REACT_APP_API}/product`, product, {
    headers: {
      authToken,
    },
  });

export const getProductByCount = async (count) =>
  await axios.get(`${process.env.REACT_APP_API}/products/${count}`);

export const removeProduct = async (slug, authToken) =>
  await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
      authToken,
    },
  });
