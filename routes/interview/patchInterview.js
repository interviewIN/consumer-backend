module.exports = async (fastify, opts) => {
	fastify.patch(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {

            const { interviewId, status } = request.body;

			const interview = await fastify.prisma.interview.findUnique({
				where: {
					id: interviewId,
				},
            });

            if(!interview){
                reply.code(404).send({ message: "Interview not found" });
            } else if (interview.status !== "PENDING") {
                reply.code(403).send({ message: "Unable to Complete The Request" });
            }

            try {
                updatedInterview = await fastify.prisma.interview.update({
                    where: {
                        id: interviewId,
                    },
                    data: {
                        status: status,
                    },
                });
            } catch (error) {
                reply.code(500).send({ message: `Update Failed, Err=[${error}]` });
                return;
            }
				
			return { updatedInterview };
		}
	);
};
