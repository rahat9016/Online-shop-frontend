import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";
import SingleProduct from "../components/cards/SingleProduct";
import { getProduct, getRelated, productStar } from "../functions/product";

const Product = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);
  const { slug } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    loadSingleProduct();
  }, []);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star);
      console.log(existingRatingObject.star);
    }
  }, []);
  const loadSingleProduct = () => {
    getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        getRelated(res.data._id).then((res) => {
          setRelated(res.data);
        });
      })
      .catch((error) => {});
  };
  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token)
      .then((res) => {
        loadSingleProduct();
      })
      .catch((error) => {
        console.log("Rating Clicked", error);
      });
  };
  return (
    <div className="container">
      <div className="row pt-4">
        <SingleProduct
          key={product.title}
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Product</h4>
          <hr />

          <div className="row pb-5">
            {related.length ? (
              related.map((r) => (
                <div className="col-md-4">
                  <ProductCard key={r._id} product={r} />
                </div>
              ))
            ) : (
              <div>Product Not found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
