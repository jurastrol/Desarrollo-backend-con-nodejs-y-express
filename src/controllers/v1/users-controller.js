const bcrypt = require('bcrypt');
const Users = require('../../mongo/models/users');

const createUser = async (req, res) => {
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

const deleteUser = (req, res) => {
  res.send({ status: 'OK', message: 'user deleted' });
};

const getUsers = (req, res) => {
  res.send({ status: 'OK', data: [] });
};

const updateUser = async (req, res) => {
  try {
    const { username, email, data, userId } = req.body;
    await Users.findByIdAndUpdate(userId, {username, email, data});
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

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  updateUser
};
