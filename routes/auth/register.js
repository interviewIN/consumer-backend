const bcrypt = require("bcryptjs");
const authSchema = require("../../schemas/authSchema");

module.exports = async (fastify, opts) => {
  fastify.post("/register", authSchema, async (request, reply) => {
    const { username, password, role } = request.body;
    const uname = await fastify.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (uname) {
      reply.code(400).send({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await fastify.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role,
      },
    });
    return { user };
  });
};
