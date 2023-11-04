const bcrypt = require("bcryptjs");

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const isPassMatched = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
