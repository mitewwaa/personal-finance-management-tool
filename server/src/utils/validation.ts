export const validatePassword = (password: string): string | null => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
    }
    return null;
  };

  export const validateEmail = (email: string): string | null => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  export const validateName = (name: string): string | null => {
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
      return 'Name should only contain letters.';
    }
    return null;
  };
  