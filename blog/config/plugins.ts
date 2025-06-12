module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: env("EMAIL_USER"),
          pass: env("EMAIL_PASS"),
        },
      },
      settings: {
        defaultFrom: env("EMAIL_USER"),
        defaultReplyTo: env("EMAIL_USER"),
      },
    },
  },
});
