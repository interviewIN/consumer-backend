module.exports = {
  schema: {
    body: {
      type: "object",
      required: ["username", "password", "name", "email"],
      properties: {
        username: { type: "string" },
        name: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
      },
    },
  },
};
