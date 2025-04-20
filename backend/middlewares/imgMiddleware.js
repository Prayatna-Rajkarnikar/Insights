import multer from "multer";
import path from "path";

// allowed image file types
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //set the folder based on the request or route
    let folder = "./public/images";

    if (req.baseUrl.includes("/blog")) {
      folder = "./public/blogImages"; // Folder for blog images
    }

    callback(null, folder);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);

    callback(null, Date.now() + ext); // Generate a unique filename
  },
});

const fileFilter = (req, file, callback) => {
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Invalid file type. Only JPG, PNG, and JPEG are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
