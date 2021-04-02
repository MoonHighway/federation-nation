const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { generate } = require("shortid");

const writeFile = promisify(fs.writeFile);

let colors = require("./color.data.json");
const saveColors = async (newColors = colors) => {
  const fileName = path.join(__dirname, "color.data.json");
  const fileContents = JSON.stringify(newColors, null, 2);
  try {
    await writeFile(fileName, fileContents);
    colors = newColors;
    console.log(`${colors.length} colors saved`);
  } catch (error) {
    console.error("Error saving colors");
    console.error(error);
  }
};

const findColors = email =>
  !email ? colors : colors.filter(c => c.createdBy.email === email);

const findColor = id => colors.find(c => c.id === id);

const countColors = () => colors.length;

const addColor = (email, title, value) => {
  const newColor = {
    id: generate(),
    title,
    value,
    created: new Date().toISOString(),
    createdBy: {
      email
    }
  };
  saveColors([...colors, newColor]);
  return newColor;
};

module.exports = { countColors, findColors, addColor, findColor };
