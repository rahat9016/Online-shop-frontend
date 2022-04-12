import React, { useState } from "react";
import { toast } from "react-toastify";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";
const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(loading);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(loading);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        toast.success("Password Updated");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };
  console.log(password);
  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        {loading ? (
          <h4 className="text-danger">Loading</h4>
        ) : (
          <h4>Your Password</h4>
        )}
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          disabled={loading}
        />
        <button
          className="btn btn-primary mt-3"
          disabled={!password || password.length < 6}
        >
          Update Password
        </button>
      </div>
    </form>
  );
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Password Update</h4>
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
