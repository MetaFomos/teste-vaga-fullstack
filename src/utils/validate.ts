export const validateCPF = (cpfString: string) => {
  let validated = false; // Start with false
  cpfString = cpfString.replace(/[^\d]+/g,'');
  // Checking cpf lenght
  if (cpfString.length !== 11 || /^(\d)\1{10}$/.test(cpfString)) {
    return validated;
  }

  // Variables to check cpf valid (sum and rest)
  let sum = 0;

  // checking first verification
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfString[i]) * (10 - i);
  }
  let firstVerifier = sum % 11;
  firstVerifier = firstVerifier < 2 ? 0 : 11 - firstVerifier;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfString[i]) * (11 - i);
  }
  let secondVerifier = sum % 11;
  secondVerifier = secondVerifier < 2 ? 0 : 11 - secondVerifier;
  return (
    firstVerifier === parseInt(cpfString[9]) &&
    secondVerifier === parseInt(cpfString[10])
  );
};

export const generateRandomDigit = () => {
  return Math.floor(Math.random() * 10);
};

const calculateVerificationDigit = (cpf: number[], weight: number) => {
  let sum = 0;
  for (let i = 0; i < weight; i++) {
    sum += cpf[i] * (weight + 1 - i);
  }
  const remainder = (sum * 10) % 11;
  return remainder >= 10 ? 0 : remainder;
};

export const generateCPF = () => {
  const cpf: number[] = [];

  // Generate the first 9 digits
  for (let i = 0; i < 9; i++) {
    cpf.push(generateRandomDigit());
  }

  // Calculate the first verification digit
  const firstVerifier = calculateVerificationDigit(cpf, 9);
  cpf.push(firstVerifier);

  // Calculate the second verification digit
  const secondVerifier = calculateVerificationDigit(cpf, 10);
  cpf.push(secondVerifier);

  // Format CPF as a string
  return cpf.join("");
};
