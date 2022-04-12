import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForms from "../../../components/forms/CategoryForms";
import LocalSearch from "../../../components/forms/LocalSearch";
import AdminNav from "../../../components/nav/AdminNav";
import { getCategories } from "../../../functions/category";
import { createSub, getSubs, removeSub } from "../../../functions/sub";
const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState("");
  useEffect(() => {
    loadCategories();
    loadSubsCategory();
  }, []);

  const loadCategories = () =>
    getCategories().then((categories) => setCategories(categories.data));
  const loadSubsCategory = () =>
    getSubs().then((categories) => setSubCategories(categories.data));
  // Step one
  const [keyword, setKeyword] = useState("");
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        setLoading(false);
        console.log(res);
        setName("");
        toast.success(`${res.data.name}`);
        loadSubsCategory();
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
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} deleted`);
          loadSubsCategory();
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
              <h4>Sub Category Create</h4>
            )}
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Select Category</option>
                {categories.length > 0 &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <CategoryForms
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />
            <hr />
            {/* Step Two */}
            <LocalSearch keyword={keyword} setKeyword={setKeyword} />

            {/* Show All Categories Item  */}
            {subCategories
              .filter((sub) => sub.name.toLowerCase().includes(keyword))
              .map((sub) => (
                <div className="alert alert-secondary " key={sub._id}>
                  {sub.name}
                  <span
                    onClick={() => handleRemove(sub.slug)}
                    className="btn btn-sm float-right"
                  >
                    <DeleteOutlined className="text-danger" />
                  </span>
                  <Link to={`/admin/sub/${sub.slug}`}>
                    <span className="btn btn-sm float-right">
                      <EditOutlined className="text-warning" />
                    </span>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
