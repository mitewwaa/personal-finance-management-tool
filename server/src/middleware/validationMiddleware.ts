import { Request, Response, NextFunction } from 'express';
import { validateEmail, validateName, validatePassword } from '../utils/validation';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  console.log('Received registration data:', req.body); // Логиране на получените данни

  let errorMessage = validateName(firstName);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  errorMessage = validateName(lastName);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  errorMessage = validateEmail(email);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  errorMessage = validatePassword(password);
  if (errorMessage) {
    res.status(400).json({ message: errorMessage });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match.' });
    return;
  }

  next();
};
