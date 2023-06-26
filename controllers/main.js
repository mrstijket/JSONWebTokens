const CustomAPIError = require('../errors/custom-error');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  if (!username || !password) {
    throw new CustomAPIError('Please provide email and password', 400);
  }

  // dummy id, normally id provided by DB!!
  const id = new Date().getDate();

  // try to keep payloading small, better experience for users
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.status(200).json({ msg: 'user created', token });
}

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('No token provided', 401);
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({
      msg: `Hello, ${decoded.username},secret:Here is your authorize data,
    your lucky number is ${luckyNumber}`
    });
  } catch (error) {
    throw new CustomAPIError('Not authorized to access this route')
  }

  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, East`,
    secret: `Here is your authorized data, 
    your lucky number is ${luckyNumber}`
  });
}

module.exports = { login, dashboard };