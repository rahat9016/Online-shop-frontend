import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminProductCard from "../../components/cards/AdminProductCard";
import AdminNav from "../../components/nav/AdminNav";
import { getProductByCount, removeProduct } from "../../functions/product";
const AllProducts = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    loadingAllProducts();
  }, []);

  const loadingAllProducts = () => {
    setLoading(true);
    getProductByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  const handleRemove = (slug) => {
    let answer = window.confirm("Delete ?");
    if (answer) {
      removeProduct(slug, user.token)
        .then((res) => {
          loadingAllProducts();
          toast.error(`${res.data.title}is deleted`);
        })
        .catch((error) => {
          if (error.response.status === 400) toast.error(error.response.data);
          console.log(error);
        });
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="  row">
          <div className="col-md-2">
            <AdminNav />
          </div>

          <div className="col">
            {loading ? <h4>Loading...</h4> : <h4>All Products</h4>}
            <div className="row">
              {products.map((product) => (
                <div key={product._id} className="col-md-4 pb-3">
                  <AdminProductCard
                    product={product}
                    handleRemove={handleRemove}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
