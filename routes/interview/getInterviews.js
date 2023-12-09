module.exports = async (fastify, opts) => {
    fastify.get(
        "/",
        {
            onRequest: [fastify.authenticate],
        },
        async (request, reply) => {
            const interviews = await fastify.prisma.interview.findMany({
                OR: [
                    {
                        companyId: request.user.id,
                    },
                    {
                        candidateId: request.user.id,
                    },
                ],
            });
            return { interviews };
        }
    )
};