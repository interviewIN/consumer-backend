module.exports = async (fastify, opts) => {
	fastify.get(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			if (request.user.role === "CANDIDATE") {
				const jobs = await fastify.prisma.job.findMany({
					select: {
						id: true,
						title: true,
						description: true,
						company: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				});

				const interviews = await fastify.prisma.interview.findMany({
					where: {
						candidate: {
							id: request.user.id,
						},
					},
				});

				jobs.forEach(async (job) => {
					job.applied = false;

					const interview = interviews.find((interview) => {
						return interview.jobId === job.id;
					});

					if (interview) {
						job.applied = true;
					}
				});

				return { jobs };
			} else {
				const jobs = await fastify.prisma.job.findMany({
					where: {
						company: {
							id: request.user.id,
						},
					},
				});
				return { jobs };
			}
		}
	);
};
