module.exports = async (fastify, opts) => {
	fastify.get(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			const jobs = await fastify.prisma.jobs.findMany({
				OR: [
					{
						companyId: request.user.id,
					},
					{
						candidateId: request.user.id,
					},
				],
			});

			const user = await fastify.prisma.user.findUnique({
				where: {
					id: request.user.id,
				},
			});

			if (user.role === "candidate") {
				interviews.forEach(async (job) => {
					job.applied = false;
					const interview = await fastify.prisma.interview.findUnique({
						where: {
							jobId: job.id,
							candidateId: request.user.id,
						},
					});

					if (interview) {
						job.applied = true;
					}
				});
			}

			return { interviews };
		}
	);
};
