import multer from "multer";
import path from "path";

const storage = multer.memoryStorage()



const uploadXlsx= multer({ storage: storage });

export default uploadXlsx;