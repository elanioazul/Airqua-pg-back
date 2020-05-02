import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { errorMessage, status } from './status'

import env from '../../env';

dotenv.config();


/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

  const verifyToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      errorMessage.error = 'Token not provided';
      return res.status(status.bad).send(errorMessage);
    }
    try {
      //jwt.verify() will verify the users token when a protected route is accessed.
      const decoded =  jwt.verify(token, process.env.SECRET);
      //If the user exists in the DB, we created a new object property in the req object. 
      //We will use this to process other requests handler.
      req.user = {
        email: decoded.email,
        user_id: decoded.user_id,
        username: decoded.username
      };
      next();
    } catch (error) {
      errorMessage.error = 'Authentication Failed';
      return res.status(status.unauthorized).send(errorMessage);
    }
  };
  
  export default verifyToken;