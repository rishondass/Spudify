var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const {v4: uuidv4} = require('uuid');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,"./music/")
  },
  filename: (req,file,cb)=>{
    cb(null,uuidv4())
  }
});
const stream = require('stream');
const upload = multer({ storage: storage});
const mm = require('music-metadata');
const util = require('util');
const db = require('../database/prisma.ts');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ytdl = require('ytdl-core');
const youtubeDl = require('youtube-dl-exec')

//Testing potential downloading from youtube

// router.get('/movie', async (req,res)=>{
//   const filePath = path.resolve(__dirname)
//   res.sendFile(filePath+"/video.mp4")
// });

// router.get('/movie3',async(req,res)=>{
//   const pathUrl = path.resolve(__dirname,"..");
//   const url = 'https://music.youtube.com/watch?v=B1kJ9RnHZ9o'
//   const id = ytdl.getURLVideoID(url)
//   let info = await ytdl.getInfo(id);
//   let format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
//   const range = req.headers.range;
//   console.log(range);
//   const begin = "1:00"
//   const r = ytdl(url, {begin,dlChunkSize: 0, format}).pipe(res);
//   // r.on('close',()=>{
//   //   console.log('finished downloading')
//   //   res.sendFile(pathUrl+'/song.mp4')
//   // })
  
  
// })

// router.get('/movie4',(req,res)=>{
//   youtubeDl('https://www.youtube.com/watch?v=6xKWiCMKKJg', {
//   dumpSingleJson: true,
//   noCheckCertificates: true,
//   noWarnings: true,
//   preferFreeFormats: true,
//   addHeader: ['referer:youtube.com', 'user-agent:googlebot']
// }).then(output => console.log(output))
// })

// router.get('/temp', async (req,res)=>{
//   const songs = await db.song.findMany({});
//   //console.log(songs);
//   res.render('music',{music:songs});
// });


router.get('/:id',async (req,res)=>{
  const audioFilePath = path.resolve(__dirname,"..") + '/music/'+req.params.id;
  
  // Ensure the file exists before streaming
  if (fs.existsSync(audioFilePath)) {
    const range = req.headers.range;
    if (!range) {
      // If there is no Range header, serve the entire file
      res.status(200).sendFile(audioFilePath);
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : undefined;

    const audioStat = fs.statSync(audioFilePath);
    const fileSize = audioStat.size;
    const chunkSize = end ? (end - start) + 1 : (fileSize - start);

    //console.log(start, end)
    const file = fs.createReadStream(audioFilePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end ? end : fileSize - 1}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'audio/mp3',
    });

    
    file.pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  const songs = await db.song.findMany({
    where:{
      OR:[
        {userID : req.headers.userid},
        {userID: null}
      ]
      
    }
  });
  //console.log(songs);
  //res.render('music',{music:songs});
  const data = JSON.stringify(songs);
  res.send(data);
});

router.get('/info/:id', async function(req, res, next) {
  if(req.params.id){
    console.log(req.params.id);
    const songs = await db.song.findUnique({
      where:{
        songID: req.params.id,
      }
    });
    const data = JSON.stringify(songs);
  res.send(data);
  }else{
    res.sendStatus(404);
  }
  
  
  
});



router.get('/artwork/:id',(req,res) => {
  const imagePath = path.resolve(__dirname,"..") + '/music/artwork/'+req.params.id+'.jpg';

  //res.sendFile(filePath);

  if (fs.existsSync(imagePath)) {
    // Set the appropriate Content-Type header
    res.setHeader('Content-Type', 'image/jpeg');

    // Read the image file and send it as the response
    fs.createReadStream(imagePath).pipe(res);
  } else {
    // If the file doesn't exist, send a 404 Not Found response
    const altPath = path.resolve(__dirname,"..") + '/music/artwork/noart.svg';
    fs.createReadStream(altPath).pipe(res);
    
  }
});



router.post('/',upload.single('file'),async (req, res, next) => {
  try{
    const metadata = await mm.parseFile(req.file.path);
    
    //console.log(metadata.common);
    let imagePath = null;
    if(metadata.common.picture){
      //console.log(metadata.common.picture[0])
      imagePath = path.resolve(__dirname,"..") + `/music/artwork/${req.file.filename}.jpg`

      fs.writeFileSync(imagePath, metadata.common.picture[0].data,'binary',(err)=>{
        if(err) console.error(err)
      });
    }

    const fileMetadata = JSON.parse(req.body.fileMetadata);
    
    console.log(fileMetadata);

    const song = await db.song.create({
      data: {
        songID: req.file.filename,
        title: fileMetadata.title || req.file.originalname,
        audioURL: req.file.path,
        artist: fileMetadata.artist,
        album: fileMetadata.album || "",
        genre: fileMetadata.genre?(fileMetadata.genre):"",
        duration: metadata.format.duration,
        track: parseInt(fileMetadata.track)||metadata.common.track.no || 0,
        imagePath: imagePath,
        userID: fileMetadata.userID || null,

      }
    })
    console.log(song);
    res.sendStatus(200);
  }catch(e){
    console.error(e);
    res.status(500).send(e);
  }
})

router.delete('/',async (req,res,next)=>{
  //console.log(req.body);
  const song = await db.song.deleteMany({
    where: {
      songID: req.body.songID
    },
  });
  const imagePath = path.resolve(__dirname,"..") + `/music/artwork/${req.body.songID}.jpg`
  fs.stat(imagePath, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stats.isFile()) {
      fs.unlink(imagePath,(err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } 
  });

  const filePath = path.resolve(__dirname,"..") + `/music/${req.body.songID}`
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stats.isFile()) {
      fs.unlink(filePath,(err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } 
  });
  res.sendStatus(200);
})

router.post('/like',async (req,res)=>{
  console.log(req.body);
  if(req.body.type === "add"){
    const song = await db.likedSongs.create({
      data:{
        userID: req.body.userID,
        songID: req.body.songID,
      }
    })
    res.sendStatus(200);
  }
  else if(req.body.type === "remove"){
    const song = await db.likedSongs.delete({
      where:{
        songID_userID:{songID:req.body.songID,userID:req.body.userID},
      }
    })
    res.sendStatus(200);
  }else{
    res.sendStatus(500);
  }
  
});


module.exports = router;
