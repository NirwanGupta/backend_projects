const nodemailer = require(`nodemailer`);
const sgMail = require('@sendgrid/mail')

const sendEmailEthereal = async(req, res) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'lonny72@ethereal.email',
            pass: 'MbhWgvPVKXbQM6V9uc'
        }
    });

    let info = await transporter.sendMail({
        from: `Nirwan Gupta <nirwan@gmail.com>`,
        to: `bar@example.com`,
        subject: `BAR`,
        html: `<h1>EMAIL SENT SUCCESSFULLY</h1>`
    })
    res.json(info);
}

const sendEmail = async (req, res) => {
    if (!process.env.SENDGRID_API_KEY) {
        return res.status(500).json({ error: 'SENDGRID_API_KEY is not set in the environment variables.' });
    }
    // const SENDGRID_API_KEY = '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';
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);


    const msg = {
        to: 'guptanirwan@gmail.com', // Change to your recipient
        from: 'aryawart.kathpal2909@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };

      console.log(msg.text);

    let info = await sgMail.send(msg);
    res.json(info);
}

module.exports = sendEmail;