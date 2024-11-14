import UserModel from '../model/User.model.js'


export async function register(req,res) {
    try {
        const {username,password,profile,email} =req.body;

       //check the existing user
       const existUsername = new Promise((resolve,reject) => {
        UserModel.findOne({username})
       })



    } catch (error) {
        return  res.status(500).send(error);
    }
}


export async function login(req,res) {
    res.json('login route');
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


export async function resetPassword(req,res) {
    res.json('resetPassword route');
}