module.exports = async (fastify, opts) => {
	fastify.post(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			const { jobId } = request.body;

            const job = await fastify.prisma.jobs.findUnique({
                where: {
                    id: jobId,
                },
            });

            if (!job) {
                reply.code(404).send({ message: "Job not found" });
            }

            const interview = await fastify.prisma.interview.findUnique({
                where: {
                    jobId: jobId,
                    candidateId: request.user.id,
                },
            });

            if(interview){
                reply.code(400).send({ message: "Already applied" });
            } else {
                const interview = await fastify.prisma.interview.create({
                    data: {
                        jobId: jobId,
                        candidateId: request.user.id,
                        companyId: job.companyId,
                    },
                });
                return { interview };
            }
		}
	);
};
