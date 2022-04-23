import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Tabs } from "antd";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import Laptop from "../../images/apple.jpg";
import ProductListItem from "./ProductListItem";
const { TabPane } = Tabs;
const SingleProduct = ({ product }) => {
  const { title, images, description } = product;
  console.log(product);
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
        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" />
              <br />
              Add to Card
            </>,
            <Link>
              <HeartOutlined className="text-info" />
            </Link>,
          ]}
        >
          <ProductListItem product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
