const express = require("express");
const app = express();
const Controller = require("./controllers/controller");
const authentication = require("./middleware/authentication");
const upload = require("./middleware/uploadMiddleware");

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", Controller.register);
app.post("/login", Controller.login);
app.get("/profile/:id", authentication, Controller.getProfile);

app.put("/update-profile/:id", authentication, Controller.updateProfile);
app.put(
  "/upload",
  authentication,
  upload.single("profile_image"),
  Controller.uploadImage
);

app.get("/banners", Controller.banner);
app.get("/services", authentication, Controller.service);
app.get("/balance", authentication, Controller.balance);
app.post("/topup", authentication, Controller.topup);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
