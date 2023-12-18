module.exports = async (fastify, opts) => {
	fastify.get(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			const interviews = await fastify.prisma.interview.findMany({
				where: {
					candidateId: request.user.id,
				},
				select: {
					id: true,
					status: true,
					job: {
						select: {
							title: true,
							company: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});
			return { interviews };
		}
	);
};
