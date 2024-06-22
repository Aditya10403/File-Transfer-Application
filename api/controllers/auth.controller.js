import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    // res.status(500).json(error.message);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials!"));
    }
    // remove password from res
    const { password: hashedPassword, ...rest } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    /* 
    access_token -> browser's cookie name
    token -> value of token
    sending validUser to use/signin 
    */
    const expiryDate = new Date(Date.now() + 6 * 3600000); // 6 hrs
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
