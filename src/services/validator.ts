
export class Validator {
  validateLogin(value: any) {
    if (!value || typeof value !== 'string') {
      return false;
    }

    if (value.length < 3 || value.length > 20) {
      return false;
    }

    const validFormat = /^[a-zA-Z0-9_-]+$/;
    const onlyDigits = /^[0-9_-]+$/;

    if (!validFormat.test(value)) {
      return false;
    }

    if (onlyDigits.test(value)) {
      return false;
    }

    if (!/[a-zA-Z]/.test(value)) {
      return false;
    }

    return true;
  }

  validatePassword(value: any) {
    if (!value || typeof value !== 'string') {
      return false;
    }

    if (value.length < 8 || value.length > 40) {
      return false;
    }

    if (!/[A-Z]/.test(value)) {
      return false;
    }

    if (!/[0-9]/.test(value)) {
      return false;
    }

    return true;
  }
}
