module.exports = async (fastify, opts) => {
	fastify.get(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			const user = await fastify.prisma.user.findUnique({
				where: {
					id: parseInt(request.user.id),
				},
				select: {
					name: true,
					email: true,
				},
			});

			return { user };
		}
	);
};
