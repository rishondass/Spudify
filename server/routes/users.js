var express = require('express');
var router = express.Router();
const db = require('../database/prisma.ts');

/* GET users listing. */
router.get('/:email', async function(req, res, next) {
  if(req.params.email){
    const {username} = req.headers;
    const user = await db.user.findUnique
    ({
      where:{email:req.params.email},
      include:{
        likedSongs:{
          select:{
            songID: true,
            dateAdded:true,
          },
          orderBy:{
            dateAdded: 'desc',
          }
        }
      }
    })
    if(user){
      //console.log(user);
      res.send(user);
    }else{
      const user = await db.user.create({
        data:{
          userName: username,
          email: req.params.email,
          fullName: username
        }
      });
      console.log(user);
      res.send(user)
    }
  }else{
    res.status(404).send({message: 'User not found'});
  }
});

router.get('/', async function(req, res, next) {
  res.send({data:"hello"})
});

module.exports = router;
