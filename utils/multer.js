import multer from "multer";
import path from "path";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },

  filename: (req, file, cb) => {
   
    cb(
      null,
      file.originalname.replace(/\.[^/.]+$/, "") +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});


const upload = multer({ storage: storage });

export default upload;