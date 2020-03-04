import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../../mongo/models/users';
import Products from '../../mongo/models/products';
import { Request, Response } from 'express';

const expiresIn = 60 * 10;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      const isOK = await bcrypt.compare(password, user.password);
      if (isOK) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn }
        );
        res.send({ status: 'OK', data: { token, expiresIn } });
      } else {
        res.status(403).send({ status: 'INVALID PASSWORD', message: '' });
      }
    } else {
      res.status(401).send({ status: 'USER NOT FOUND', message: '' });
    }
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, data } = req.body;

    const hash = await bcrypt.hash(password, 15);

    /*await Users.create({
      username,
      email,
      password: hash,
      data
    });*/

    const user = new Users();
    user.username = username;
    user.email = email;
    user.password = hash;
    user.data = data;

    await user.save();

    res.send({ status: 'OK', message: 'user created' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: 'DUPLICATES_VALUES', message: error.keyValue });
      return;
    }
    //console.log(error);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new Error('Mising param userId.');
    }
    console.log('userid ', userId);
    await Users.findByIdAndDelete(userId);
    await Products.deleteMany({ user: userId });
    res.send({ status: 'OK', message: 'user deleted' });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.find().select({ password: 0, __v: 0, role: 0 });
    res.send({ status: 'OK', data: users });
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req.sessionData', req.sessionData.userId);
    const { username, email, data } = req.body;
    await Users.findByIdAndUpdate(req.sessionData.userId, {
      username,
      email,
      data
    });
    res.send({ status: 'OK', message: 'user updated' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: 'DUPLICATES_VALUES', message: error.keyValue });
      return;
    }
    //console.log(error);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

export default { createUser, deleteUser, getUsers, updateUser, login };
