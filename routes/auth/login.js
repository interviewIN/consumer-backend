const bcrypt = require("bcryptjs");
const authSchema = require("../../schemas/authSchema");

module.exports = async (fastify, opts) => {
  fastify.post("/login", authSchema, async (request, reply) => {
    const { username, password } = request.body;
    const user = await fastify.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      reply.code(400).send({ message: "Username does not exist" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      reply.code(400).send({ message: "Invalid password" });
    }
    const token = fastify.jwt.sign({ id: user.id });
    reply
      .setCookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: true,
      })
      .code(200)
      .send({ token });
  });
};
