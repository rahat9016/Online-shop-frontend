import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import React from "react";
import { Link } from "react-router-dom";
import { ShowAverage } from "../../functions/rating";
import laptop from "../../images/apple.jpg";
const ProductCard = ({ product }) => {
  //Destructure Product
  const { title, images, description, slug } = product;
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
          <>
            <ShoppingCartOutlined className="text-danger" />
            <br />
            Add to Card
          </>,
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
