import type { ValidationType } from './types';

export class Validator {
  patterns: Record<ValidationType, RegExp> = {
    name: /^[A-ZА-ЯЁ][a-zA-Zа-яёА-ЯЁ-]*$/,
    login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z]+[a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    phone: /^\+?\d{10,15}$/,
    message: /^.+$/,
  };

  checkValid(valueStr: string, validationType: ValidationType): boolean {
    const pattern = this.patterns[validationType];

    if (!pattern) {
      return false;
    }

    return pattern.test(valueStr);
  }
}
