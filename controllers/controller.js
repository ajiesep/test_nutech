const { User, Banner, Service, Balance } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const {
  errorResponse,
  successResponse,
} = require("../helpers/responseHelpers");
const path = require("path");
const { where } = require("sequelize");

class Controller {
  static async register(req, res, next) {
    try {
      const { email, first_name, last_name, password } = req.body;
      if (!email || !password || !first_name) {
        return res
          .status(400)
          .json(errorResponse(102, "Parameter email tidak sesuai format"));
      }
      await User.create({
        email,
        first_name,
        last_name,
        password,
      });

      return res
        .status(201)
        .json(successResponse(0, "Registrasi berhasil silahkan login"));
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        return res.status(400).json(errorResponse(102, messages.join(", ")));
      }

      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res
          .status(400)
          .json(errorResponse(102, "Email atau password tidak boleh kosong"));
      }

      // Cari pengguna berdasarkan email
      const user = await User.findOne({ where: { email } });

      // Jika user tidak ditemukan, beri respons yang lebih sesuai
      if (!user) {
        return res
          .status(404)
          .json(errorResponse(102, "Email tidak ditemukan"));
      }

      // Cek apakah password yang dimasukkan cocok
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   return res
      //     .status(400)
      //     .json(errorResponse(103, "Username atau password salah"));
      // }

      // Jika login berhasil, buat token JWT
      const token = signToken({ id: user.id }, { expiresIn: "1h" });

      // Respons sukses dengan token
      return res
        .status(200)
        .json(successResponse(0, "Login Sukses", { token }));
    } catch (error) {
      console.error("Login error:", error.message);
      next(error); // Penanganan error lainnya
    }
  }

  static async getProfile(req, res, next) {
    try {
      const userId = req.params.id;

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({
          status: 102,
          message: "Pengguna tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image:
            user.profile_image || "https://yoururlapi.com/default_profile.jpeg",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null,
        });
      }

      const userId = req.user.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          status: 102,
          message: "Pengguna tidak ditemukan",
          data: null,
        });
      }
      const imagePath = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      user.profile_image = imagePath;
      await user.save();

      return res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: user.profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { first_name, last_name } = req.body;

      if (!first_name || !last_name) {
        return res.status(400).json({
          status: 102,
          message: "First name dan Last name harus diisi",
          data: null,
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          status: 102,
          message: "Pengguna tidak ditemukan",
          data: null,
        });
      }
      user.first_name = first_name;
      user.last_name = last_name;
      await user.save();

      return res.status(200).json({
        status: 0,
        message: "Update Profile berhasil",
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image:
            user.profile_image || "https://yoururlapi.com/default_profile.jpeg",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async banner(req, res, next) {
    try {
      const banners = await Banner.findAll();

      if (banners.length === 0) {
        return res.status(404).json({
          status: 102,
          message: "Tidak ada banner ditemukan",
          data: null,
        });
      }
      const formattedBanners = banners.map((banner) => ({
        banner_name: banner.banner_name,
        banner_image: banner.banner_image,
        description: banner.description || "No description available",
      }));

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: formattedBanners,
      });
    } catch (error) {
      next(error);
    }
  }

  static async service(req, res, next) {
    try {
      const services = await Service.findAll();
      console.log(services, "ini services");

      if (services.length === 0) {
        return res.status(404).json({
          status: 102,
          message: "Tidak ada layanan ditemukan",
          data: null,
        });
      }

      const formattedServices = services.map((service) => ({
        service_code: service.service_code,
        service_name: service.service_name,
        service_icon: service.service_icon,
        service_tariff: service.service_tariff,
      }));

      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: formattedServices,
      });
    } catch (error) {
      next(error);
    }
  }

  static async balance(req, res, next) {
    try {
      const balance = await Balance.findOne({ where: { userId: req.user.id } });
      if (!balance) {
        return res
          .status(404)
          .json({ status: 404, message: "Balance not found", data: null });
      }
      return res.status(200).json({
        status: 0,
        message: "Get Balance Berhasil",
        data: balance,
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }

  static async topup(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak valid atau kadaluwarsa",
          data: null,
        });
      }

      const token = authHeader.split(" ")[1];
      let decoded;
      try {
        decoded = jwt.verify(token, "kepobanget");
      } catch (error) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak valid atau kadaluwarsa",
          data: null,
        });
      }

      const email = decoded.email;
      const { top_up_amount } = req.body;

      if (typeof top_up_amount !== "number" || top_up_amount <= 0) {
        return res.status(400).json({
          status: 102,
          message:
            "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
          data: null,
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          status: 104,
          message: "User tidak ditemukan",
          data: null,
        });
      }

      user.balance += top_up_amount;
      await user.save();

      await Transaction.create({
        user_id: user.id,
        amount: top_up_amount,
        transaction_type: "TOPUP",
      });

      return res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: {
          balance: user.balance,
        },
      });
    } catch (error) {
      console.error("Error in topup controller:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null,
      });
    }
  }
}

module.exports = Controller;
