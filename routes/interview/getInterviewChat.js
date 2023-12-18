module.exports = async (fastify, opts) => {
	fastify.get(
		"/:id/chat",
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
				return;
			}

            if(interview.candidateId !== request.user.id){
                reply.code(403).send({ message: "You are not allowed to access this interview" });
                return;
            }

            const interviewChat = {
                status: interview.status,
                chat: [],
            }

            interview.answers.forEach((answer, index) => {
                interviewChat.chat.push({
                    question: interview.questions[index],
                    answer: answer,
                })

                if(index === interview.answers.length - 1){
                    interviewChat.chat.push({
                        question: "Thank you for your time!",
                        answer: "",
                    })
                }
            })

			return interviewChat;
		}
	);
};
