import multer from "multer";
export { userProfilePictureStorage, uploadUserProfilePicture };

// Set up multer storage configuration
const userProfilePictureStorage = multer.diskStorage({
  destination: "uploads/userProfilePictures",
  filename: function (req, file, cb) {
    cb(null, req.userId! + ".png");
  },
});

// Create multer middleware for file upload
const uploadUserProfilePicture = multer({
  storage: userProfilePictureStorage,
});
