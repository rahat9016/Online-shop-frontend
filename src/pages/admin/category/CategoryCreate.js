import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForms from "../../../components/forms/CategoryForms";
import LocalSearch from "../../../components/forms/LocalSearch";
import AdminNav from "../../../components/nav/AdminNav";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((categories) => setCategories(categories.data));
  // Step one
  const [keyword, setKeyword] = useState("");
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`${res.data.name}`);
        loadCategories();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 400) toast.error(error.response.data);
      });
  };
  const handleRemove = (slug) => {
    if (window.confirm("Delete Category ?")) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} deleted`);
          loadCategories();
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status === 400) toast.error(error.response.data);
        });
    }
  };

  // let searched = (query) => (c) => {
  //   return c.name.toLowerCase().includes(query);
  // };
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading</h4>
            ) : (
              <h4>Category Create</h4>
            )}
            <CategoryForms
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />
            <hr />
            {/* Step Two */}
            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {/* Show All Categories Item  */}
            {categories.length > 0 ? (
              categories
                .filter((cat) => cat.name.toLowerCase().includes(keyword))
                .map((category) => (
                  <div className="alert alert-secondary " key={category._id}>
                    {category.name}
                    <span
                      onClick={() => handleRemove(category.slug)}
                      className="btn btn-sm float-right"
                    >
                      <DeleteOutlined className="text-danger" />
                    </span>
                    <Link to={`/admin/category/${category.slug}`}>
                      <span className="btn btn-sm float-right">
                        <EditOutlined className="text-warning" />
                      </span>
                    </Link>
                  </div>
                ))
            ) : (
              <p>No Item...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
