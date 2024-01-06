const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../Uitils/responseWrapper');

const signupController = async (req, res) => {
  try {
        const { name, email, password } = await req.body;

        if (!email || !password || !name) {
            return res.send(error(400, "All fields required"));
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send(error(409, "user is already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

         return res.send(success(201, "user created successfully"));
  }
  catch (e) {
        res.send(error((500), e.message));
  }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = await req.body

        if (!email || !password) {
            return res.send(error(400, "all fields required"))
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.send(error(404, "user is not registered"));
        }

        const matched = await bcrypt.compare(password, user.password)
        if (!matched) {
            return res.send(error(403, "Incorrect password"))
        }

        const accessToken = genrateAccessToken({ _id: user.id });

        const refreshToken = genrateRefreshToken({_id: user.id});
 
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true
        });
        return res.send(success(200, { accessToken }));

    }
    catch (e) {
        return res.send(error(500, e.message));
    }
}

const refreshAccessTokenController = async (req, res) => {
    const cookies = await req.cookies;
    if (!cookies.jwt) {
        return res.send(error(401, 'refresh token not found'));
    }

    const refreshToken = cookies.jwt;

    console.log("refresh", refreshToken);

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)
        const _id = decoded._id
        const accessToken =  genrateAccessToken({ _id });
        return res.send(success(201, { accessToken }));
    }
    catch (e) {
        console.log(e);
        return res.send(error(401, 'invaid refresh key'))
    }
}

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, 'user successfully logged out'))
    } catch (e) {
        console.log(e);
    }
}

// internL Function
const genrateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1d"
        })
        console.log(token)
        return token;
    }
    catch (e) {
        res.send(error((500), e.message))
    }
}

const genrateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y"
        })
        console.log(token)
        return token;
    }
    catch (e) {
        res.send(error((500), e.message))
    }
}

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
}










