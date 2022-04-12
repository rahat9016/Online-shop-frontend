import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForms from "../../../components/forms/CategoryForms";
import AdminNav from "../../../components/nav/AdminNav";
import { getCategory, updateCategory } from "../../../functions/category";
const CategoryUpdate = () => {
  const history = useHistory();
  let { slug } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategory(slug).then((c) => setName(c.data.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateCategory(slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} is Updated`);
        history.push("/admin/category");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 400) toast.error(error.response.data);
      });
  };
  //

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
              <h4>Update Category </h4>
            )}
            <CategoryForms
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
