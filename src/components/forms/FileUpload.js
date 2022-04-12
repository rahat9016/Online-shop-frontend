import { Avatar, Badge } from "antd";
import axios from "axios";
import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadImages`,
                { image: uri },
                { headers: { authtoken: user ? user.token : "" } }
              )
              .then((res) => {
                console.log(res);
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((error) => {
                setLoading(false);
                console.log(error);
              });
          },
          "base64"
        );
      }
    }
  };
  const handleRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeImage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
        const { images } = values;
        const filterImage = images.filter(
          (image) => image.public_id !== public_id
        );
        setValues({ ...values, images: filterImage });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => handleRemove(image.public_id)}
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              <Avatar
                key={image.public_id}
                src={image.url}
                size={60}
                shape="square"
                className="m-3"
              />
            </Badge>
          ))}
      </div>
      <div className="row ">
        <label className="btn btn-primary w-4">
          Choose file
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
