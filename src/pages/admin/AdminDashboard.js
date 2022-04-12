import React, { useEffect, useState } from "react";
import AdminProductCard from "../../components/cards/AdminProductCard";
import AdminNav from "../../components/nav/AdminNav";
import { getProductByCount } from "../../functions/product";

const AdminDashboard = () => {
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
  return (
    <>
      <div className="row">
        <div className="container-fluid">
          <div className="col-md-2">
            <AdminNav />
          </div>

          <div className="col">
            {loading ? <h4>Loading...</h4> : <h4>All Products</h4>}
            <div className="row">
              {products.map((product) => (
                <div key={product._id} className="col-md-4">
                  <AdminProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
