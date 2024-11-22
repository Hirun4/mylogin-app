import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    //check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Validate input fields
    if (!username || !password || !email) {
      return res
        .status(400)
        .send({ error: "Username, email, and password are required" });
    }

    // Check if the username already exists
    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      return res.status(400).send({ error: "Please use a unique username" });
    }

    // Check if the email already exists
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    // Save user to  database
    const result = await user.save();

    //  success
    return res
      .status(201)
      .send({ msg: "User registered successfully", user: result });
  } catch (error) {
    // Log  errors
    console.error("Error during registration:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

// export async function register(req,res) {
//     try {
//         const {username,password,profile,email} =req.body;

//        //check the existing user
//        const existUsername = new Promise((resolve,reject) => {
//         UserModel.findOne({username} ,function(err,user) {
//             if(err) {
//                 console.error("Error checking username:", err);
//                  reject(new Error(err))}
//             if(user) {
//                 console.error("Username already exists:", username);
//                 reject({error : "Please use unique username"});}

//             resolve();
//         })
//        });

//         //check for existing email.
//        const existEmail = new Promise((resolve,reject) => {
//         UserModel.findOne({email} ,function(err,email) {
//             if(err)  reject(new Error(err))
//             if(email) reject({error : "Please use unique Email"});

//             resolve();
//         })
//        });

//        await Promise.all([existUsername,existEmail])
//        .then(() => {
//         if (password) {
//             bcrypt.hash(password,10)
//             .then(hashedPassword => {
//                  const user = new UserModel({
//                     username,
//                     password: hashedPassword,
//                     profile: profile || '',
//                     email
//                  })

//                  //return and save result as a response
//                  user.save()
//                  .then(result => res.status(201).send({msg: "user registered successfully"}))
//                  .catch (error => res.status(500).send({error}))

//             }).catch(error => {
//                 return res.status(500).send({
//                     error: "Enable to hashed password"
//                 })
//             })
//         }
//        }).catch(error => {
//         return res.status(500).send({error})
//        })

//     } catch (error) {
//         return  res.status(500).send(error);
//     }
// }

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have Password" });

            //create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not Match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(500).send({ err });
      if (!user)
        return res.status(501).send({ error: "Couldn't Find the User" });

      /**remove password from user */
      // mongoose return unnecessary data with object so convert it into json

      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(user);
    });
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
}

export async function updateUser(req, res) {
  try {
    // const id =req.query.id;
    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      // update the data
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;

        return res.status(201).send({ msg: "Record Updated...!" });
      });
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; //reset the otp value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
  if(req.app.locals.resetSession){
    req.app.locals.resetSession = false; //allow access to this route only once
    return res.status(201).send({ msg: "access granted!"})
  }
  return res.status(440).send({ error: "Session expired!" });
}

export async function resetPassword(req, res) {
  try {
    const {username,password} = req.body;

     try {
      UserModel.findOne({username})
      .then(user => {
        bcrypt.hash(password,10)
        .then(hashedPassword => {
          UserModel.updateOne({username: user.username},{password: hashedPassword},function(err,data){
            if(err) throw err;
            return res.status(201).send({msg: "record updated"})
          })
        })
        .catch(e => {
          return res.status(500).send({ error: "Enable to hash password"})
        })
      })
      .catch(error => {
        return res.status(404).send({error: "Username not found"})
      })
      
     } catch (error) {
      return res.status(500).send({error})
     }

    
  } catch (error) {
    return res.status(401).send({error})
  }
}


