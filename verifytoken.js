const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
  
  const token = req.headers['authorization']; 

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token.' });
    }

    // if everything is good, save the decoded id to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
