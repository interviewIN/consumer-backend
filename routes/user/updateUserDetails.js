module.exports = async (fastify, opts) => {
	fastify.patch(
		"/",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			
            const { name, email } = request.body;

            try{
                await fastify.prisma.user.update({
                    where: {
                        id: parseInt(request.user.id),
                    },
                    data: {
                        name: name,
                        email: email,
                    },
                });
            } catch (err) {
                reply.code(500).send({ message: `Update Failed, Err=[${err}]` });
            }

			return { message: "User details updated successfully" };
		}
	);
};
