const fetch = require("node-fetch");

module.exports = async function fetchUserEmail(token) {
  const query = `query findUserEmail { me { email } }`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify({ query }),
  };
  const { data = { me: { email: "" } } } = await fetch(
    "http://localhost:4001",
    options
  )
    .then((res) => res.json())
    .catch(console.error);

  return data.me.email;
};
