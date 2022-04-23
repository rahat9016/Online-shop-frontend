import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";
import { getProduct } from "../functions/product";

const Product = () => {
  const [product, setProduct] = useState({});
  const { slug } = useParams();
  useEffect(() => {
    loadSingleProduct();
  }, []);
  const loadSingleProduct = () => {
    getProduct(slug)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => {});
  };
  return (
    <div className="container">
      <div className="row pt-4">
        <SingleProduct key={product.title} product={product} />
      </div>
    </div>
  );
};

export default Product;
