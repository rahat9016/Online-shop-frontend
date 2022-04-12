import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import { createOrUpdateUser } from "../../functions/auth";

const RegistrationComplete = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  useSelector((state) => ({ ...state }));
  let history = useHistory();
  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForResister"));
    // console.log(window.location.href);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("password must be at least 6 characters long");
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      console.log("Result", result);
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForResister");
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                email: res.data.email,
                name: res.data.name,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((error) => console.log(error));
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const CompleteRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type={"email"}
        value={email}
        autoFocus
        className="form-control"
        disabled
      />
      <input
        type={"password"}
        value={password}
        autoFocus
        className="form-control my-2"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" className="btn btn-raised">
        Complete Registration
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Resister</h4>

          {CompleteRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
