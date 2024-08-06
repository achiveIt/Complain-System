import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service:"gmail",
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASS,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: `${process.env.SENDER_MAIL}`,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;