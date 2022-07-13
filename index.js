const express = require('express')
const cors = require('cors')
const port = 5000 || process.env.PORT
const sharp = require('sharp')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config()


// file upload folder
const UPLOADS_FOLDER = "./uploads";

const upload = multer({
  dest: UPLOADS_FOLDER
})

const app = express()
app.use(bodyParser())
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/optimize', async(req, res) => {
  
  try {

    const result = await sharp('images/image.jpg').resize(1000).webp().toBuffer()
    console.log(result)
    res.send(result)

  } catch (error) {
    console.log(error)
  }

})

app.post('/optimize', upload.single('image'), async(req, res) => {
  
  // const fileExt = path.extname(file.name);
  const file = req.file;
  const {file_formate, height, width, quality} = req.body;
  
  console.log("file formate", {file_formate}, {height}, {width}, {quality})
  try {

    if(file_formate == "jpg"){

      const result = await sharp(file.path).resize({height: parseInt(height), width: parseInt(width)}).jpeg({quality: parseInt(quality)*10}).toBuffer()
      fs.unlinkSync(file.path)
      res.send(result)

    }else if(file_formate == "png"){

      const result = await sharp(file.path).resize({height: parseInt(height), width: parseInt(width)}).png({compressionLevel:parseInt(quality)-1}).toBuffer()
      fs.unlinkSync(file.path)
      res.send(result)

    }else{

      const result = await sharp(file.path).resize({height: parseInt(height), width: parseInt(width)}).webp({quality:parseInt(quality)*10}).toBuffer()
      fs.unlinkSync(file.path)
      res.send(result)

    }
    // console.log(result)

  } catch (error) {
    console.log(error)
  }


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})