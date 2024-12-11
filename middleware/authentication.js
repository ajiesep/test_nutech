const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/index");

async function autentication(req, res, next) {
  try {
    const access_token = req.headers.authorization;
    if (!access_token) {
      throw { name: "Unauthorized" };
    }
    const [Bearer, token] = access_token.split(" ");
    if (Bearer !== "Bearer") {
      throw { name: "Unauthorized" };
    }
    const payload = verifyToken(token);
    if (!payload) {
      throw { name: "Unauthorized" };
    }
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Unauthorized" };
    }
    req.user = {
      id: user.id,
    };
    console.log(req.user.id, "ini auth");

    next();
  } catch (error) {
    // console.log(error);
    // next(error);
    let message = "Token tidak valid";
    let statusCode = 403;

    // Cek apakah error adalah karena token kadaluwarsa
    if (error.name === "TokenExpiredError") {
      message = "Token kadaluwarsa";
      statusCode = 401;
    }

    // Berikan respons dengan format yang diinginkan
    return res.status(statusCode).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }
}
module.exports = autentication;

// const jwt = require("../helpers/jwt");

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({
//       status: 101,
//       message: "Token tidak ditemukan",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
//     req.user = decoded; // Simpan payload di req.user
//     next();
//   } catch (error) {
//     console.error("JWT Error:", error.message);
//     return res.status(403).json({
//       status: 102,
//       message: "Token tidak valid",
//     });
//   }
// };

// module.exports = authMiddleware;

// // const jwt = require("jsonwebtoken");

// // const authMiddleware = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader) {
// //     return res.status(401).json({
// //       status: 101,
// //       message: "Token tidak ditemukan",
// //     });
// //   }

// //   const token = authHeader.split(" ")[1];

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Gunakan kunci rahasia Anda
// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     return res.status(403).json({
// //       status: 102,
// //       message: "Token tidak valid",
// //     });
// //   }
// // };

// // module.exports = authMiddleware;
