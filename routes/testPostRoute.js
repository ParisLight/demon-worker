import express from "express";
import fileUpload from 'express-fileupload';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.use(fileUpload({
  useTempFiles : true,
  tempFileDir : `/${process.env.FILES_PATH}/`
}));

router.post('/test-post', (req, res) => {
  if(req.files){
    console.log(req.files);
    res.status(200).send(req.files)
    return
  }
  res.status(200).send(req.body.response);
})

export default router;