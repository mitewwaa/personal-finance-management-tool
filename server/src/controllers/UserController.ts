import { Request, Response } from "express";
import UserService from "../services/UserService";
import UserData from "../interfaces/UserData";

class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserData = req.body;

      if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
        res.status(400).json({ message: "All fields are required!" });
        return;
      }

      const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email);
      if (!isEmailValid) {
        res.status(400).json({ message: "Invalid email format!" });
        return;
      }

      const isNameValid = /^[a-zA-Z-]+$/.test(userData.first_name) && /^[a-zA-Z-]+$/.test(userData.last_name);
      if (!isNameValid) {
        res.status(400).json({ message: "Invalid first name or last name! Only letters and hyphens are allowed." });
        return;
      }

      const isPasswordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(userData.password);
      if (!isPasswordStrong) {
        res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character!" });
        return;
      }

      const existingUser = await UserService.getUserByEmail(userData.email);
      if (existingUser) {
        res.status(400).json({ message: "User with this email already exists." });
        return;
      }

      const newUser = await UserService.createUser(userData);
      if (newUser) {
        res.status(201).json(newUser);
      } else {
        res.status(400).json({ message: "Failed to create user." });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.params.userId);
      const user = await UserService.getUserById(req.params.userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const userData: Partial<UserData> = req.body;
      const updatedUser = await UserService.updateUser(userId, userData);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const isDeleted = await UserService.deleteUser(req.params.userId);
      if (isDeleted) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email,password);
      const user = await UserService.loginUser(email, password);
      if (user.token) {
        res.status(200).json({ token: user.token });
    } else {
        res.status(401).json({ message: "Invalid email or password." });
    }
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default UserController;
