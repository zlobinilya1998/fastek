const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public/images")) {
      fs.mkdirSync("public/images", { recursive: true });
    }
    cb(null, `${__dirname}/public/images/`);
  },
});
const uploads = multer({ storage });

const port = 3000;

app.use(cors());
app.use("/static", express.static(__dirname + "/public"));

app.get("/download", function (req, res) {
  const { file } = req.query;
  const path = `${__dirname}/public/images/`;
  try {
    if (fs.existsSync(path)) {
      return res.download(`${__dirname}/public/images/${file}`);
    }
    return res.status(400).json({ message: "Download error" });
  } catch (e) {
    res.status(500).json({ message: "Download error" });
  }
});

app.post("/upload", uploads.single("file"), function (req, res) {
  res.send(req.file);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
