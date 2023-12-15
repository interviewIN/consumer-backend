const bcrypt = require("bcryptjs");
const loginSchema = require("../../schemas/loginSchema");

module.exports = async (fastify, opts) => {
	fastify.post("/login", loginSchema, async (request, reply) => {
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
		const token = fastify.jwt.sign({ id: user.id, role: user.role });
		reply
			.setCookie("token", token, {
				path: "/",
				httpOnly: true,
				sameSite: true,
			})
			.code(200)
			.send({
				token: token,
				role: user.role,
			});
	});
};
