import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { getProductCount, getProducts } from "../../functions/product";
import LoadingCard from "../cards/LoadingCard";
import ProductCard from "../cards/ProductCard";
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  useEffect(() => {
    loadAllProduct();
  }, [page]);

  useEffect(() => {
    getProductCount()
      .then((res) => {
        setProductsCount(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const loadAllProduct = () => {
    setLoading(true);
    getProducts("createdAt", "desc", page)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {productsCount}
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          <Pagination
            current={page}
            total={(productsCount / 2) * 10}
            onChange={(value) => {
              console.log(value);
              setPage(value);
            }}
          />
        </nav>
      </div>
    </>
  );
};

export default NewArrivals;
