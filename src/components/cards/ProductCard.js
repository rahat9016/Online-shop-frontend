import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import _ from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ShowAverage } from "../../functions/rating";
import laptop from "../../images/apple.jpg";
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const [tooltip, setTooltip] = useState("Click to add");
  //Destructure Product
  const { title, images, description, slug, quantity } = product;
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

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        ShowAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">Not rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : laptop}
            alt={"Not found"}
            style={{ height: "150px", objectFit: "cover" }}
            className="m-2"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" />
            <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart} disabled={quantity < 1}>
              <ShoppingCartOutlined className="text-danger" />
              <br />
              {quantity < 1 ? "Out of stoke" : "Add to Card"}
            </a>
            ,
          </Tooltip>,
        ]}
      >
        <Meta
          title={title}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
