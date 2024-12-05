import User from "../models/User.js";
import UserData from "../shared/interfaces/UserData.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class UserService {
  static async createUser(userData: UserData): Promise<User | null> {
    try {
      const { first_name, last_name, email, password, date_of_birth } =
        userData;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.error("User already exists.");
        return null;
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await User.create({
        first_name: first_name,
        last_name: last_name,
        email,
        password: hashedPassword,
        date_of_birth: date_of_birth,
        date_registered: new Date(),
      });

      return newUser;
    } catch (error) {
      console.error("Error occurred while trying to register user:", error);
      return null;
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    try {
      console.log("Fetching user with ID:", userId);
      return await User.findByPk(userId);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  static async updateUser(
    userId: string,
    newData: Partial<UserData>
  ): Promise<User | null> {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        return await user.update(newData);
      }
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  static async loginUser(email: string, password: string) {
    try {
      const user = await User.findOne({ where: { email } });
      console.log("Fetched user from database:", user);
      if (!user) {
        return null;
      }

      const userPassword = user.dataValues.password;
      const isPasswordValid = bcrypt.compareSync(password, userPassword);
      if (!isPasswordValid) {
        return null;
      }

      const token = jwt.sign(
        { userId: user.dataValues.id, email: user.dataValues.email, name: user.dataValues.first_name },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      console.log({ token, name: user.dataValues.first_name, id: user.dataValues.id });

      return ({ token, name: user.dataValues.first_name, id: user.dataValues.id });
    } catch (error) {
      console.error("Error occurred while trying to login:", error);
      return null;
    }
  }
}

export default UserService;
