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
				include: {
					job: true,
				},
			});
			return { 
				interviews: interviews.map((interview) => {
					return {
						id: interview.id,
						status: interview.status,
						jobId: interview.jobId,
						jobTitle: interview.job.title,
						jobCompany: interview.job.company,
						jobLocation: interview.job.location,
					}
				})
			 };
		}
	);
};
