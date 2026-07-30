//login the user register the user
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

//create fresh entry in database
const signupUser = async (req, res) => {
  const { name, email, password, orgid } = req.body;

  const userdata = {
    name,
    email,
    password,
    orgid,
  };
  const newuser = userModel(userdata);
  const user = await newuser.save();
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.status(200).send(token);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: "user does not exits" });
  }

  console.log(user);
  const isMatch = (password === user.password);

  if (!isMatch) {
    return res.status(400).send({ message: "invalid creadentials" });
  }
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.status(200).send({ token, sucess: true });
};



export { loginUser, signupUser };
