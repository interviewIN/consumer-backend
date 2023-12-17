module.exports = async (fastify, opts) => {
	fastify.post(
		"/apply",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {

            if(request.user.role !== "CANDIDATE"){
                reply.code(403).send({ message: "Forbidden" });
				return;
            }

			const { jobId } = request.body;

			const job = await fastify.prisma.job.findUnique({
				where: {
					id: jobId,
				},
			});

			if (!job) {
				reply.code(404).send({ message: "Job not found" });
				return;
			}

			const interview = await fastify.prisma.interview.findUnique({
				where: {
					candidateId_jobId: {
                        candidateId: request.user.id,
                        jobId: jobId,
                    },
				},
			});

			if (interview) {
				reply.code(400).send({ message: "Already applied" });
				return;
			} else {
				const interview = await fastify.prisma.interview.create({
					data: {
                        status: "WAITING",
						chat: [],
                        updatedAt: new Date(),
						job: {
							connect: {
								id: jobId,
							},
						},
						candidate: {
							connect: {
								id: request.user.id,
							},
						},
					},
				});
				return { interview };
			}
		}
	);
};
