import { Request, Response } from "express";
import UserService from "../services/UserService";
import UserData from "../interfaces/UserData";

class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      console.log("Request Body:", req.body);
      const userData: UserData = req.body;
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
      if (user) {
        res.status(200).json(user); // Maybe should implement JWS and this should return token
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
