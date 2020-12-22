const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "doojvuxfw",
  api_key: "348274156466816",
  api_secret: "-daQVdy6z1oUSwOgMaejwdXMB7M",
});

exports.cloudUpload = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({ productImage: result.url });
      },
      { resource_type: "auto" }
    );
  });
};
