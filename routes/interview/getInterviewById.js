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
            });
            if (!interview) {
                reply.code(404).send({ message: "Interview not found" });
            }



            return { interview };
        }
    )
}