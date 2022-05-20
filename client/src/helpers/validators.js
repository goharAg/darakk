const validateName = (firstName) => {
  if (firstName.length === 0) return '';
  if (firstName.length < 2) {
    return 'At least 2 characters';
  }
  if (firstName.length > 255) {
    return 'At most 255 characters';
  }
  if (/^[a-zA-Z]+$/.test(firstName) === false) {
    return 'Only letters';
  }

  return '';
};

const validateEmail = function (email) {
  if (email.length === 0) return '';
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email) ? '' : 'Invalid email';
};

const validatePassword = function (password) {
  if (password.length === 0) {
    return '';
  }

  if (password.length < 6) {
    return 'At least 6 characters';
  }
  if (password.length > 16) {
    return 'At most 20 characters';
  }

  if (!password.match(/[a-z]/)) {
    return 'At least one lowercase letter';
  }
  if (!password.match(/[A-Z]/)) {
    return 'At least one uppercase letter';
  }

  if (!password.match(/[0-9]/)) {
    return 'At least one number';
  }

  if (!password.match(/[!@#$%^&*.]/)) {
    return 'At least one special character';
  }

  return '';
};

const validationMapping = {
  first_name: validateName,
  last_name: validateName,
  email: validateEmail,
  password: validatePassword,
};

const validate = (type, value) => {
  if (type in validationMapping) {
    return validationMapping[type](value);
  }
  throw new Error('Unknown validation type: ' + type);
};

export default validate;
