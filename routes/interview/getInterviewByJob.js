module.exports = async (fastify, opts) => {
    fastify.get(
        "/job/:id",
        {
            onRequest: [fastify.authenticate],
        },
        async (request, reply) => {

            if(request.user.role === "CANDIDATE"){
                reply.code(403).send({ message: "Only companies can access this route" });
                return;
            }

            const interviews = await fastify.prisma.interview.findMany({
                where: {
                    job: {
                        id: parseInt(request.params.id),
                    }
                },
            });

            if (!interviews) {
                reply.code(404).send({ message: "Interview not found" });
            }

            return { interviews };
        }
    )
}