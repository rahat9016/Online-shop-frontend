import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FileUpload from "../../components/forms/FileUpload";
import ProductUpdateForm from "../../components/forms/ProductUpdateForm";
import AdminNav from "../../components/nav/AdminNav";
import { getCategories, getCategorySubs } from "../../functions/category";
import { getProduct, updateProduct } from "../../functions/product";
// Initial Product
const initialState = {
  title: "",
  description: "",
  price: "",
  // categories: "",
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

const ProductUpdate = () => {
  const [values, setValues] = useState(initialState);
  const [subOption, setSubOption] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);
  const history = useHistory();
  const loadProduct = () => {
    getProduct(slug).then((p) => {
      setValues({ ...values, ...p.data });
      getCategorySubs(p.data.category._id).then((res) => {
        setSubOption(res.data);
      });
      let arr = [];
      p.data.subs.map((s) => {
        return arr.push(s._id);
      });
      setArrayOfSubs((prev) => arr);
    });
  };

  const loadCategories = () => {
    getCategories()
      .then((c) => {
        setCategories(c.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    values.subs = arrayOfSubs;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is updated`);
        history.push("/admin/products");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(error.response.data.error);
      });
  };
  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleCategoryChange = (e) => {
    e.preventDefault();

    setValues({ ...values, subs: [] });

    setSelectedCategory(e.target.value);

    getCategorySubs(e.target.value)
      .then((res) => {
        console.log(res.data);
        setSubOption(res.data);
      })
      .catch();

    if (values.category._id === e.target.value) {
      loadProduct();
    }
    setArrayOfSubs([]);
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
            <h4>Product Update</h4>
          )}
          <FileUpload
            values={values}
            setValues={setValues}
            setLoading={setLoading}
          />
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOption={subOption}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
            selectedCategory={selectedCategory}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
