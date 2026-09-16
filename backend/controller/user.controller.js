const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { sendEmail } = require("../config/email");
const { generateToken, tokenForVerify } = require("../utils/token");
const { secret } = require("../config/secret");
const { MURA, wrapMuraEmail } = require("../utils/muraEmail");

// register user
// sign up
exports.signup = async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      const saved_user = await User.create(req.body);
      const token = saved_user.generateConfirmationToken();

      await saved_user.save({ validateBeforeSave: false });

      const mailData = {
        from: secret.email_user,
        to: `${req.body.email}`,
        subject: `Verify your ${MURA.name} email`,
        html: wrapMuraEmail({
          title: `Verify your ${MURA.name} email`,
          bodyHtml: `
            <h2 style="margin:0 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${MURA.text};">Hello ${req.body.name}</h2>
            <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${MURA.muted};">
              Verify your email address to complete signup and log in to your <strong>${MURA.name}</strong> account.
            </p>
            <p style="margin:0 0 20px 0;font-size:14px;color:${MURA.muted};">This link will expire in <strong>10 minutes</strong>.</p>
            <p style="margin:0 0 24px 0;">
              <a href="${secret.client_url}/email-verify/${token}" style="background:${MURA.primary};color:${MURA.white};padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Verify Account</a>
            </p>
            <p style="margin:0;font-size:13px;color:${MURA.muted};">
              If you did not create a ${MURA.name} account, please contact us at
              <a href="mailto:${MURA.email}" style="color:${MURA.primary};text-decoration:none;">${MURA.email}</a>.
            </p>
          `,
        }),
      };
      const message = "Please check your email to verify!";
      sendEmail(mailData, res, message);
    }
  } catch (error) {
    next(error)
  }
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
module.exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    if (user.status != "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

// confirmEmail
exports.confirmEmail = async (req, res,next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error)
  }
};

// forgetPassword
exports.forgetPassword = async (req, res,next) => {
  try {
    const { verifyEmail } = req.body;
    const user = await User.findOne({ email: verifyEmail });
    if (!user) {
      return res.status(404).send({
        message: "User Not found with this email!",
      });
    } else {
      const token = tokenForVerify(user);
      const body = {
        from: secret.email_user,
        to: `${verifyEmail}`,
        subject: `Reset your ${MURA.name} password`,
        html: wrapMuraEmail({
          title: `Reset your ${MURA.name} password`,
          bodyHtml: `
            <h2 style="margin:0 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${MURA.text};">Hello</h2>
            <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${MURA.muted};">
              A request has been received to change the password for your <strong>${MURA.name}</strong> account.
            </p>
            <p style="margin:0 0 20px 0;font-size:14px;color:${MURA.muted};">This link will expire in <strong>10 minutes</strong>.</p>
            <p style="margin:0 0 24px 0;">
              <a href="${secret.client_url}/forget-password/${token}" style="background:${MURA.primary};color:${MURA.white};padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a>
            </p>
            <p style="margin:0;font-size:13px;color:${MURA.muted};">
              If you did not request this, please contact us immediately at
              <a href="mailto:${MURA.email}" style="color:${MURA.primary};text-decoration:none;">${MURA.email}</a>.
            </p>
          `,
        }),
      };
      user.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      user.confirmationTokenExpires = date;
      await user.save({ validateBeforeSave: false });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error)
  }
};

// confirm-forget-password
exports.confirmForgetPassword = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await User.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
exports.changePassword = async (req, res,next) => {
  try {
    const {email,password,googleSignIn,newPassword} = req.body || {};
    const user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(googleSignIn){
      const hashedPassword = bcrypt.hashSync(newPassword);
      await User.updateOne({email:email},{password:hashedPassword})
      return res.status(200).json({ message: "Password changed successfully" });
    }
    if(!bcrypt.compareSync(password, user?.password)){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    else {
      const hashedPassword = bcrypt.hashSync(newPassword);
      await User.updateOne({email:email},{password:hashedPassword})
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error)
  }
};

// update a profile
exports.updateUser = async (req, res,next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.bio = req.body.bio; 
      const updatedUser = await user.save();
      const token = generateToken(updatedUser);
      res.status(200).json({
        status: "success",
        message: "Successfully updated profile",
        data: {
          user: updatedUser,
          token,
        },
      });
    }
  } catch (error) {
    next(error)
  }
};

// signUpWithProvider
exports.signUpWithProvider = async (req, res,next) => {
  try {
    const user = jwt.decode(req.params.token);
    const isAdded = await User.findOne({ email: user.email });
    if (isAdded) {
      const token = generateToken(isAdded);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: isAdded._id,
            name: isAdded.name,
            email: isAdded.email,
            address: isAdded.address,
            phone: isAdded.phone,
            imageURL: isAdded.imageURL,
            googleSignIn:true,
          },
        },
      });
    } else {
      const newUser = new User({
        name: user.name,
        email: user.email,
        imageURL: user.picture,
        status: 'active'
      });

      const signUpUser = await newUser.save();
      // console.log(signUpUser)
      const token = generateToken(signUpUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: signUpUser._id,
            name: signUpUser.name,
            email: signUpUser.email,
            imageURL: signUpUser.imageURL,
            googleSignIn:true,
          }
        },
      });
    }
  } catch (error) {
    next(error)
  }
};
