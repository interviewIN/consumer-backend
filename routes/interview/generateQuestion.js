const axios = require("axios");

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
				select: {
					id: true,
					status: true,
					questions: true,
					answers: true,
					summary: true,
					candidateId: true,
					candidate: {
						select: {
							name: true,
						},
					},
					job: {
						select: {
							title: true,
							company: {
								select: {
									name: true,
								},
							},
						},
					},
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
			} else if(["PENDING", "ACCEPTED", "REJECTED"].includes(interview.status)){
				reply.code(403).send({ message: "Interview is already completed" });
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

					const requestBody = {
						candidate_name: interview.candidate.name,
						job_title: interview.job.title,
						company_name: interview.job.company.name,
						interview_qna: interview.questions.map((question, index) => {
							return {
								question: question,
								answer: interview.answers[index],
							};
						}),
					}

					const response = await axios.post(
						process.env.SUMMARY_URL,
						requestBody
					).then((res) => res.data).catch((err) => console.log(err));

					interview.summary = {
						overallImpression: response.overall_impression,
						chanceOfGettingTheJob: response.chance_of_getting_the_job,
						mostRelevantPosition: response.most_relevant_position,
						personalCapability: response.personal_capability,
						psychologicalCapability: response.psychological_capability,
						technicalCapability: response.technical_capability,
						finalThoughts: response.final_thoughts,
					};

				} else {
					interviewQuestion.question =
						interview.questions[lastQuestionIndex + 1];
				}
			}

			if(interview.summary === null){
				interview.summary = {};
			}

			try {
				await fastify.prisma.interview.update({
					where: {
						id: interviewId,
					},
					data: {
						status: interview.status,
						answers: interview.answers,
						summary: {
							upsert: {
								update: interview.summary,
								create: interview.summary,
							}
						},
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
