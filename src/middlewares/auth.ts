/* eslint-disable no-throw-literal */
import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

const isValidHostname = (req:Request, res:Response, next:NextFunction): void => {
  const validHosts = ['dina.ec', 'localhost'];
  if (validHosts.includes('localhost')) {
    next();
  } else {
    res.status(403).send({ status: 'ACCESS_DENIED' });
  }
};

const isAuth = (req:Request, res:Response, next:NextFunction): void=> {
  try {
    const { token } = req.headers;
    if (token) {
      const data:any = jwt.verify(token as string, process.env.JWT_SECRET!);
      console.log('jwt data', data);
      req.sessionData = { userId: data.userId, role: data.role };
      next();
    } else {
      throw {
        code: 403,
        status: 'ACCESS_DENIED',
        message: 'Missing header token'
      };
    }
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || 'ERROR', message: e.message });
  }

  //   const validHosts = ['dina.ec', 'localhost'];
  //   if (validHosts.includes('localhost')) {
  //     next();
  //   } else {
  //     res.status(403).send({ status: 'ACCESS_DENIED' });
  //   }
  //   console.log('req.hostname', req.hostname);
};

const isAdmin = (req:Request, res:Response, next:NextFunction): void => {
  try {
    const { role } = req.sessionData;
    console.log('isAdmin: ', role);
    if (role !== 'admin') {
      throw {
        code: 403,
        status: 'ACCESS_DENIED',
        message: 'Invalid role.'
      };
    }
    next();
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || 'ERROR', message: e.message });
  }

  //   const validHosts = ['dina.ec', 'localhost'];
  //   if (validHosts.includes('localhost')) {
  //     next();
  //   } else {
  //     res.status(403).send({ status: 'ACCESS_DENIED' });
  //   }
  //   console.log('req.hostname', req.hostname);
};

export { isValidHostname, isAuth, isAdmin };
