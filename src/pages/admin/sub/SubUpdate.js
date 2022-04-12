import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForms from "../../../components/forms/CategoryForms";
import AdminNav from "../../../components/nav/AdminNav";
import { getCategories } from "../../../functions/category";
import { getSub, updateSub } from "../../../functions/sub";

const SubUpdate = () => {
  const history = useHistory();
  let { slug } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadCategories();
    loadSubsCategory();
  }, []);
  console.log(slug);
  const loadCategories = () =>
    getCategories().then((categories) => setCategories(categories.data));

  const loadSubsCategory = () =>
    getSub(slug).then((sub) => {
      setName(sub.data.name);
      setParent(sub.data.parent);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateSub(slug, { name, parent }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} is Updated`);
        history.push("/admin/sub");
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
              <h4>Update Sub Category </h4>
            )}
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setParent(e.target.value)}
              >
                <option>Select Category</option>
                {categories.length > 0 &&
                  categories.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      selected={c._id === parent}
                    >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
