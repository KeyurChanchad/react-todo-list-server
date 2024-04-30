const jwt = require('jsonwebtoken');
const { secrek_key } = require('../../constant');

// Middleware to verify authentication
const verifyAuth = (req, res, next) => {
  let authToken = req.headers['authorization'];
  // Check if authToken exists
  if (!authToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  authToken = authToken.split('Bearer ')[1]
  console.log('REq header token ', authToken);
  try {
    // Verify the authentication token
    const decodedToken = jwt.verify(authToken, secrek_key);
    
    // Extract userId from the decoded token and attach it to the request object
    req.userId = decodedToken.userId;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying authentication token:', error);
    res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
};

module.exports =  verifyAuth ;