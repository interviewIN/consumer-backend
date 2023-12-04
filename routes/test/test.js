

module.exports = async (fastify, opts) => {
    fastify.get(
        "/",
        {
            onRequest: [fastify.authenticate],
        },
        async (request, reply) => {

            const user = await fastify.prisma.user.findUnique({
                where: {
                    id: request.user.id,
                },
            });

            return { 
                message: "Hello from test",
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                }
            };
        }
    )
};