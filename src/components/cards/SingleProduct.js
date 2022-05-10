import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Tabs, Tooltip } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useHistory } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { toast } from "react-toastify";
import { ShowAverage } from "../../functions/rating";
import { addToWishlist } from "../../functions/user";
import Laptop from "../../images/apple.jpg";
import RatingModal from "../modal/RatingModal";
import ProductListItem from "./ProductListItem";
const { TabPane } = Tabs;
const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
  const [tooltip, setTooltip] = useState("Click to add");
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();
  //Cart handler
  const handleAddToCart = () => {
    //Create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      //if cart is in the local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.push({
        ...product,
        count: 1,
      });
      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      setTooltip("Added");
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };
  const handleAddedWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      console.log("Added wishlist", res.data);
      toast.success("Add to wishlist");
      history.push("/user/wishlist");
    });
  };
  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((i) => (
                <img src={i.url} alt={title} key={i.public_id} />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={
              <img
                src={Laptop}
                classNam="mb-3 card-image"
                alt="Pic not found"
              />
            }
          />
        )}
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call Use on xxxx xxxx to learn more about this product
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          ShowAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">Not rating yet</div>
        )}
        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" />
                <br />
                Add to Card
              </a>
              ,
            </Tooltip>,
            <a onClick={handleAddedWishlist} href>
              <HeartOutlined className="text-info" />
              <br />
              Add to wishlist
            </a>,
            <RatingModal>
              <StarRatings
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItem product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
