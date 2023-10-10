import multer from "multer";

import AppError from "../utils/AppError.js";

const uploadFileOnCloud = () => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
    ) {
      cb(null, true);
    } else {
      cb(new AppError("invalid extention", 400), false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};

export default uploadFileOnCloud;
