const fs = require("fs");
const util = require("util");
const path = require("path");
const bcrypt = require("bcrypt");
const writeFile = util.promisify(fs.writeFile);

let accounts = require("./accounts.json");

const saveAccounts = async (newAccounts = []) => {
  const fileName = path.join(__dirname, "accounts.json");
  const fileContents = JSON.stringify(newAccounts, null, 2);
  try {
    await writeFile(fileName, fileContents);
    accounts = newAccounts;
  } catch (error) {
    console.error("Error saving accounts");
    console.error(error);
  }
};

const hasAccount = email => accounts.some(account => account.email === email);
const findAccount = email => accounts.find(account => account.email === email);
const findAllAccounts = () => accounts;
const verifyPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const addAccount = async ({ email, name, password }) => {
  if (hasAccount(email)) {
    throw new Error(`Account already exists for ${email}`);
  }
  let hash = bcrypt.hashSync(password, 10);
  const user = {
    email,
    name,
    password: hash,
    created: new Date().toISOString()
  };
  await saveAccounts([...accounts, user]);
  return user;
};

module.exports = {
  hasAccount,
  findAccount,
  findAllAccounts,
  addAccount,
  verifyPassword
};
