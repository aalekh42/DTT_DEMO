exports.authentication = async(req, res, next) => {
  try {
    var authheader = req.headers.authorization;
    
    if (!authheader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err)
    }
    var auth;
    try{
      auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':');
    } catch(err) {
      err.status = 400;
      err.message += ' - Something wrong with Auth header';
      throw err;
    }
    var user = auth[0];
    var pass = auth[1];
  
    const {BASIC_PASSWORD} = process.env;
    if (user && user!='' && pass == BASIC_PASSWORD) {
      // If Authorized user
      next();
    } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  } catch(error) {
    next(error);
  }
}