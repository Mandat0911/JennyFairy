import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "nguyenmandat0744@gmail.com",
        pass: "pmnl bahk chcj rshg",
    }
})