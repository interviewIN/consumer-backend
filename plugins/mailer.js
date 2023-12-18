const nodemailer = require("nodemailer");
const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  fastify.decorate("sendEmail", async function (email, subject, text) {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      let details = {
        from: "tesEventee@gmail.com",
        to: email,
        subject: subject,
        html: text,
      };

      transporter.sendMail(details, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("email sent!" + info.response);
        }
      });
    } catch (err) {
      reply.send(err);
    }
  });
});
