module.exports = async (fastify, opts) => {
	fastify.get(
		"/:id",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			const interview = await fastify.prisma.interview.findUnique({
				where: {
					id: parseInt(request.params.id),
				},
				include:{
					summary: true,
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
				}
			});
			if (!interview) {
				reply.code(404).send({ message: "Interview not found" });
				return;
			} else if (interview.job.company.id !== request.user.id) {
				reply
					.code(403)
					.send({ message: "You are not allowed to access this interview" });
				return;
			}

			return { interview };
		}
	);
};
