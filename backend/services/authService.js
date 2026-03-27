const bcrypt = require("bcrypt");
const userModel = require("./../models/userModel");
const { generateToken } = require("./../utils/tokenUtil");
const { nanoid } = require("nanoid");

async function handleRegister(username, fullName, password, email) {
  const existingUser = await userModel.exists({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return { error: "USER_EXISTS" };
  }

  const connectCode = nanoid(12);
  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    fullName,
    email,
    password: hashed,
    connectCode
  });

  const token = await generateToken(user.username, user.connectCode, user.email,user._id);

  return {
    _id: user._id,
    token,
    connectCode: user.connectCode,
    username: user.username,
    fullName: user.fullName,
    email: user.email
  };
}

async function handleLogin(identifier, password) {
  const user = await userModel.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  }).lean();

  if (!user) {
    return { error: "INVALID_CREDENTIALS" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { error: "INVALID_CREDENTIALS" };
  }

  const token = await generateToken(user.username, user.connectCode, user.email,user._id);

  return {
    _id: user._id,
    token,
    connectCode: user.connectCode,
    username: user.username,
    fullName: user.fullName,
    email: user.email
  };
}

async function handleGetUserProfile(userId) {
    const user=await userModel.findById(userId)
    if(!user){
      return {error:'INVALID USER'}
    }

    return {
      _id: user._id,
      connectCode:user.connectCode,
      username:user.username,
      fullName:user.fullName,
      email:user.email
    }
}

async function handleSearchUsers(query, currentUserId) {
    const users = await userModel.find({
        _id: { $ne: currentUserId },
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { fullName: { $regex: query, $options: 'i' } },
            { connectCode: query }
        ]
    })
    .select('_id username fullName connectCode')
    .limit(10)
    .lean();
    return users;
}

module.exports = {
  handleRegister,
  handleLogin,
  handleGetUserProfile,
  handleSearchUsers
};