


export function checkPasswordStrength(password: string): boolean {
    // Password must be at least 8 characters long
    if (password.length < 8) {
        return false;
    }
    
    // Password must contain at least two uppercase letters, two lowercase letters, two digits, and two special characters  
    const uppercaseRegex = /[A-Z]/g;
    const lowercaseRegex = /[a-z]/g;
    const digitRegex = /[0-9]/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;

    const uppercaseMatches = password.match(uppercaseRegex) || [];
    const lowercaseMatches = password.match(lowercaseRegex) || [];
    const digitMatches = password.match(digitRegex) || [];
    const specialCharMatches = password.match(specialCharRegex) || [];

    if (uppercaseMatches.length < 2) {
        return false;
    }
    if (lowercaseMatches.length < 2) {
        return false;
    }
    if (digitMatches.length < 2) {
        return false;
    }
    if (specialCharMatches.length < 2) {
        return false;
    }

    return true;
}