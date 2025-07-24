const bcrypt = require("bcryptjs");

module.exports = {
  hashPassword: async (password) => {
    const passwordString = String(password);
    return await bcrypt.hash(passwordString, 10);
  },

  comparePassword: async (password, hash) => {
    const passwordString = String(password);
    return await bcrypt.compare(passwordString, hash);
  },
};
