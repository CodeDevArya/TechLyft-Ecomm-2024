import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req:any, file:any, cb:any) => {
    cb(null, 'uploads');
  },
  filename: (req:any, file:any, cb:any) => {
    const extName = file.originalname.split('.').pop();
    const nameWithoutExt = file.originalname.split(`.${extName}`)[0];
    const newFileName = `${nameWithoutExt.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}-run-${Math.floor(Math.random() * 1000000)}-done-${Date.now()}.${extName}`;
    cb(null, newFileName);
  },
});

export const multipleUpload = multer({ storage }).array('photos', 10); // Ensure 'photos' matches the FormData field name
