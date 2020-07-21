module.exports = function signUpValidation(input) {
  let results = {
    isValid: false,
    error: "",
    field: "",
  };

  let email = input.email;
  let password = input.password;

  if (email.length === 0) {
    results.error = "Please enter your email.";
    results.field = "email";
    return results;
  }

  if (!email.includes("@")) {
    results.error = "Valid email required.";
    results.field = "email";
    return results;
  }

  if (!password.length) {
    results.error = "Please enter a password.";
    results.field = "password";
    return results;
  }

  if (password.length < 6) {
    results.error = "Please enter a password longer than 6 characters.";
    results.field = "password";
    return results;
  }

  results.isValid = true;

  return results;
};
