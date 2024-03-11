// controllers/userController.js
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET = process.env.SECRET || 'SECRET';
const JWT_EXPIRATION_TIME = '1h';

const userController = {
  registerUser: async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword, role });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Failed to register user' });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ email: user.email, role: user.role }, SECRET, { expiresIn: JWT_EXPIRATION_TIME });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Failed to login user' });
    }
  }
};

export default userController;