const fp = require("fastify-plugin");

module.exports = fp(async (fastify, opts) => {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
