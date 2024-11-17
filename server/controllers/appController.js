import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'







export async function register(req, res) {
    try {
       
        const { username, password, profile, email } = req.body;

        // Validate input fields
        if (!username || !password || !email) {
            return res.status(400).send({ error: "Username, email, and password are required" });
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
            profile: profile || '', 
            email
        });

        // Save user to  database
        const result = await user.save();

        //  success 
        return res.status(201).send({ msg: "User registered successfully", user: result });

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


export async function login(req,res) {
    
    const { username,password } = req.body;

    try{

        UserModel.findOne({ username })
        .then(user => {
            bcrypt.compare(password, user.password)
            .then(passwordCheck => {

                if(!passwordCheck) return res.status(400).send({ error : "Don't have Password"});

                //create jwt token
                const token = jwt.sign({
                    userId: user._id,
                    username : user.username
                }, ENV.JWT_SECRET, {expiresIn : "24h"});

                return res.status(200).send({
                    msg: "Login Successful...!",
                    username: user.username,
                    token
                })


            })
            .catch(error =>{
                return res.status(400).send({ error : "Password does not Match"});
            })
        })
        .catch( error => {
            return res.status(404).send({ error : "Username not found"});
        })

    }catch (error) {
        return res.status(500).send({ error});
    }
}

export async function getUser(req,res) {
    res.json('getUser route');
}

export async function updateUser(req,res) {
    res.json('updateUser route');
}


export async function generateOTP(req,res) {
    res.json('generateOTP route');
}



export async function verifyOTP(req,res) {
    res.json('verifyOTP route');
}


export async function createResetSession(req,res) {
    res.json('createResetSession route');
}

export async function resetPassword(req,res) {
    res.json('resetPassword route');
}


// export async function resetPassword(req,res) {
//     res.json('resetPassword route');
// }