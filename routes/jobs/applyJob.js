module.exports = async (fastify, opts) => {
  fastify.post(
    "/apply",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      if (request.user.role !== "CANDIDATE") {
        reply.code(403).send({ message: "Forbidden" });
        return;
      }

      const { jobId } = request.body;

      const job = await fastify.prisma.job.findUnique({
        where: {
          id: jobId,
        },
      });

      if (!job) {
        reply.code(404).send({ message: "Job not found" });
        return;
      }

      const company = await fastify.prisma.user.findUnique({
        where: {
          id: Number(job.companyId),
        },
      });
      console.log(company);

      if (!company) {
        reply.code(404).send({ message: "Company not found" });
        return;
      }

      const user = await fastify.prisma.user.findUnique({
        where: {
          id: Number(request.user.id),
        },
      });

      if (!user) {
        reply.code(404).send({ message: "User not found" });
        return;
      }

      const interview = await fastify.prisma.interview.findUnique({
        where: {
          candidateId_jobId: {
            candidateId: request.user.id,
            jobId: jobId,
          },
        },
      });

      if (interview && user && company) {
        reply.code(400).send({ message: "Already applied" });
        return;
      } else {
        const interview = await fastify.prisma.interview.create({
          data: {
            status: "WAITING",
            questions: job.interviewQuestions,
            answers: [],
            summary: "",
            job: {
              connect: {
                id: jobId,
              },
            },
            candidate: {
              connect: {
                id: request.user.id,
              },
            },
          },
        });
        const message = `<html>
          <body>
              <p>Dear ${user.name},</p>

              <p>Thank you for your interest in the <strong>${job.title}</strong> position at <strong>${company.name}</strong>. We have successfully received your application.</p>

              <p>Our team is currently reviewing applications, and we are committed to a thorough and fair selection process. We appreciate the time and effort you put into your application.</p>

              <h3>Here's what you can expect next:</h3>
              <ul>
                  <li><strong>Application Review:</strong> Our hiring team will review your application and assess its alignment with the requirements of the position.</li>
                  <li><strong>Communication:</strong> Should your qualifications meet our needs, we will contact you to discuss the next steps, which typically include interviews and further assessments.</li>
              </ul>

              <p>Please note that due to the volume of applications, we may not be able to provide personalized feedback to each applicant. However, we will ensure to keep you informed about the status of your application.</p>

              <p>Thank you again for considering a career with us. We wish you all the best in your job search and future endeavors.</p>

              <p>Warm regards,</p>
              <p>
              InterviewIn
              </p>
          </body>
          </html>`;
        const subject = `Application Received - ${job.title} at ${company.name}`;
        fastify.sendEmail(user.email, subject, message);
        return { message: "Applied successfully" };
      }
    }
  );
};
