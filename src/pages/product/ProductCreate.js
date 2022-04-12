import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FileUpload from "../../components/forms/FileUpload";
import ProductCreateForm from "../../components/forms/ProductCreateForm";
import AdminNav from "../../components/nav/AdminNav";
import { getCategories, getCategorySubs } from "../../functions/category";
import { createProduct } from "../../functions/product";
const initialState = {
  title: "",
  description: "",
  price: "",
  categories: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "HP", "Asus", "Acer", "Lenovo"],
  color: "",
  brand: "",
};
const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOption, setSubOption] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = () => {
    getCategories()
      .then((c) => setValues({ ...values, categories: c.data }))
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        toast.success(`${res.data.title}`);
        console.log(res);
        window.alert(`${res.data.title} is created`);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) toast.error(error.response.data);
      });
  };
  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value)
      .then((res) => {
        console.log(res.data);
        setSubOption(res.data);
      })
      .catch();
    setShowSub(true);
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product create</h4>
          )}
          <hr />
          {JSON.stringify(values.images)}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            subOption={subOption}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
