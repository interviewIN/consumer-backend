module.exports = async (fastify, opts) => {
	fastify.post(
		"/generateQuestion",
		{
			onRequest: [fastify.authenticate],
		},
		async (request, reply) => {
			const { interviewId, chat } = request.body;

			console.log(request.body);

			const interview = await fastify.prisma.interview.findUnique({
				where: {
					id: interviewId,
				},
			});

			if (!interview) {
				reply.code(404).send({ message: "Interview not found" });
				return;
			}

			if (interview.candidateId !== request.user.id) {
				reply
					.code(403)
					.send({ message: "You are not allowed to access this interview" });
				return;
			}

			const interviewQuestion = {
				status: interview.status,
				question: "",
			};

			if (chat.length === 0) {
				interview.status = "IN_PROGRESS";
				interviewQuestion.question = interview.questions[0];
			} else {
				const lastChat = chat[chat.length - 1];
				const lastQuestionIndex = interview.questions.indexOf(
					lastChat.question
				);

				if (interview.answers.length > lastQuestionIndex) {
					interview.answers[lastQuestionIndex] = lastChat.answer;
				} else {
					while (interview.answers.length < lastQuestionIndex) {
						interview.answers.push(chat[interview.answers.length].answer);
					}
					interview.answers.push(lastChat.answer);
				}

				if (lastQuestionIndex === -1) {
					reply.code(400).send({ message: "Invalid question" });
					return;
				}

				if (lastQuestionIndex === interview.questions.length - 1) {
					interview.status = "PENDING";
					interviewQuestion.question = "Thank you for your time!";

					// TODO: Req summary from summary service
				} else {
					interviewQuestion.question =
						interview.questions[lastQuestionIndex + 1];
				}
			}

			try {
				await fastify.prisma.interview.update({
					where: {
						id: interviewId,
					},
					data: {
						status: interview.status,
						answers: interview.answers,
						summary: interview.summary,
					},
				});

				interviewQuestion.status = interview.status;
			} catch (err) {
				console.log(err);
				reply.code(500).send({ message: "Internal server error" });
			}

			return interviewQuestion;
		}
	);
};
