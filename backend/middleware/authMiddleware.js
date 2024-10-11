import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret'; 

 const authMiddleware = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  console.log(authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token)
  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    req.user = decoded.userId;

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export {authMiddleware};
