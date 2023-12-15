const bcrypt = require("bcryptjs");
const registerSchema = require("../../schemas/registerSchema");

module.exports = async (fastify, opts) => {
  fastify.post("/register", registerSchema, async (request, reply) => {
    const { username, email, password, role } = request.body;
    const uname = await fastify.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (uname) {
      reply.code(400).send({ message: "Username already exists" });
      return;
    }

    const isEmailUsed = await fastify.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailUsed) {
      reply.code(400).send({ message: "Email already used" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await fastify.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role,
      },
    });
    return { user };
  });
};
