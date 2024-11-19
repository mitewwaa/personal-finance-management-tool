export const validatePassword = (password: string): string => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
  }
  return "";
};

export const validateEmail = (email: string): string => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return "";
};

export const validateName = (name: string): string => {
  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(name)) {
    return "Name should only contain letters.";
  }
  return "";
};

export const validateRegistrationForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): string => {
  // Валидация на първо и фамилно име
  const nameError = validateName(firstName) || validateName(lastName);

  // Валидация на имейл
  const emailError = validateEmail(email);

  // Валидация на парола
  const passwordError = validatePassword(password);

  // Валидация на съвпадение на паролите
  const confirmPasswordError =
    password !== confirmPassword ? "Passwords do not match." : "";

  // Връщане на първата намерена грешка, ако има такава
  if (nameError || emailError || passwordError || confirmPasswordError) {
    return nameError || emailError || passwordError || confirmPasswordError;
  }

  return ""; // Няма грешки
};
