import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import React from "react";
import { Link } from "react-router-dom";
import laptop from "../../images/apple.jpg";
const ProductCard = ({ product }) => {
  //Destructure Product
  const { title, images, description, slug } = product;
  console.log(product);
  return (
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
  );
};

export default ProductCard;
