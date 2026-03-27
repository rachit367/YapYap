const {
  handleRegister,
  handleLogin,
  handleGetUserProfile,
  handleSearchUsers
} = require("./../services/authService");

async function register(req, res, next) {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const result = await handleRegister(username, fullName, password, email);

    if (result.error === "USER_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      path: "/"
    });

    return res.status(201).json({
      success: true,
      user: {
        id: result._id,
        username: result.username,
        fullName: result.fullName,
        email: result.email,
        connectCode: result.connectCode
      }
    });

  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;

    if ((!identifier) || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password required"
      });
    }

    const result = await handleLogin(identifier, password);

    if (result.error === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      path: "/"
    });

    return res.status(200).json({
      success: true,
      user: {
        id: result._id,
        username: result.username,
        fullName: result.fullName,
        email: result.email,
        connectCode: result.connectCode
      }
    });

  } catch (err) {
    next(err);
  }
}

async function getUserProfile(req, res, next){
  try {
    const userId=req.user_id
    const data=await handleGetUserProfile(userId)
    if(data.error==='INVALID USER'){
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }
    return res.status(200).json({
      success:true,
      user:data
    });

  } catch (err) {
    next(err);
  }
};

async function logout(req, res, next){
  try {
    res.clearCookie('token',{
      secure:process.env.NODE_ENV === "production",
      httpOnly:true,
      sameSite:'Strict',
      path:'/'
    })
    return res.status(200).json({
      success:true,
      message:'User Logged out'
    });

  } catch (err) {
    next(err);
  }
};

async function searchUsers(req, res, next) {
  try {
    const query = req.query.q;
    if (!query) return res.status(200).json({ success: true, users: [] });
    const users = await handleSearchUsers(query, req.user_id);
    return res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getUserProfile,
  logout,
  searchUsers
};