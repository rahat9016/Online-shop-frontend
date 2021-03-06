import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";
import { getCategory } from "../../functions/category";

const CategoryHome = () => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    getCategory(slug)
      .then((res) => {
        setCategory(res.data.category);
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);
  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col">
          {loading ? (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              {products.length} Product in "{category.name}" category
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-5 " key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryHome;
