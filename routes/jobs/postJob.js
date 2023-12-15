module.exports = async (fastify, opts) => {
	fastify.post(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			
            if(request.user.role !== "COMPANY"){
                reply.code(403).send({ message: "Forbidden" });
                return;
            }

            const { title, description } = request.body;

            const job = await fastify.prisma.job.create({
                data: {
                    title: title,
                    description: description,
                    company: {
                        connect: {
                            id: request.user.id,
                        },
                    },
                },
            });

            return { job };
		}
	);
};
