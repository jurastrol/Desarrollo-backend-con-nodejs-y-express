import {Request, Response} from 'express';

import Products from '../../mongo/models/products';

const createProduct = async (req:Request, res:Response): Promise<void> => {
  try {
    const { title, desc, price, images, userId } = req.body;

    const product = await Products.create({
      title,
      desc,
      price,
      images,
      user: userId
    });
    res.send({ status: 'OK', message: 'product created', data: product });
  } catch (e) {
    console.log('createProduct error:', e);
    res.status(500).send({ status: 'ERROR', data: e.message });
  }
};

const getProducts = async (req:Request, res:Response): Promise<void>=> {
  try {
    const products = await Products.find({
      price: { $lt: 10 }
    })
      .select('title desc price')
      .populate('user', 'username email data role ');
    res.send({ status: 'OK', data: products });
  } catch (e) {
    console.log('getProduct error:', e);
    res.status(500).send({ status: 'ERROR', data: e.message });
  }
};

const getProductsByuser = async (req:Request, res:Response): Promise<void> => {
  try {
    const products = await Products.find({
      user: req.params.userId
    });
    res.send({ status: 'OK', data: products });
  } catch (e) {
    console.log('getProduct error:', e);
    res.status(500).send({ status: 'ERROR', data: e.message });
  }
};

export default {
  createProduct,
  getProducts,
  getProductsByuser
};
