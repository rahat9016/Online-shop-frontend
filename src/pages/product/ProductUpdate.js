import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AdminNav from "../../components/nav/AdminNav";

const ProductUpdate = () => {
  const { slug } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Update</h4>
          <hr />
          <div className="p-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
