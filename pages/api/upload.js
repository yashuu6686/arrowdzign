
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const uploadDir = path.join(process.cwd(), "public/uploads");

// // create folder if not exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// export default function handler(req, res) {
//   upload.single("file")(req, res, (err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     return res.status(200).json({
//       url: `/uploads/${req.file.filename}`,
//     });
//   });
// }
