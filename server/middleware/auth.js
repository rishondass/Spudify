const auth = (req,res,next)=>{
  const api_key = req.query.api_key;
  const apiKey = process.env.API_KEY;
  if(apiKey === api_key || apiKey === req.headers.api_key) {
    next();
  }else{
    console.log(req.headers.api_key)
    console.error('not authorized')
    res.status(401).send({error: 'Not authorized'});
  }
}

module.exports = auth;