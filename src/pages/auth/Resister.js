import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../firebase";

const Resister = () => {
  console.log(process.env.REACT_APP_RESISTER_REDIRECT_URL);
  const [email, setEmail] = useState("");
  const history = useHistory();
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [user, history]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_RESISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(email, config);
    toast.success(`Email is sent to ${email}. Click the link to complete`);
    window.localStorage.setItem("emailForResister", email);
    setEmail("");
  };
  const resisterFrom = () => (
    <form onSubmit={handleSubmit}>
      <input
        type={"email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        className="form-control"
      />
      <button type="submit" className="btn btn-raised">
        Resister
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Resister</h4>

          {resisterFrom()}
        </div>
      </div>
    </div>
  );
};

export default Resister;
