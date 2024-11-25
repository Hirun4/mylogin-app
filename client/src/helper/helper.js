import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Function to get username from token */
export async function getUsername() {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Reject with a meaningful error message if no token is found
      console.error("Token not found in localStorage.");
      throw new Error("Cannot find token");
    }

    // Decode the token
    const decodedToken = jwtDecode(token);
    console.log(decodedToken); // Debugging: Log the decoded token
    return decodedToken; // Return the decoded token (if needed)
  } catch (error) {
    console.error("Error in getUsername:", error.message || error);
    throw error; // Rethrow the error for the caller to handle
  }
}


/** authenticate function */ 
export async function authenticate(username) {
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/**get  User details */
export async function getUser({ username }){
    try {
        const { data } =  await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/**register user function */
export async function registerUser(credentials) {
    try {
        const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        /**send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return Promise.resolve(msg)

    } catch (error) {
        return Promise.reject({ error })
    }
}    


/**login function */
export async function verifyPassword({ username, password }) {
    try {
        if(username){
            const { data } = await axios.post('/api/login',{ username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/**update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : {"Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/**generate OTP */
export async function generateOTP(username){
    try {
        const { data : { code }, status } = await axios.get('/api/generateOTP', { params : {username}});

        //send mail with the OTP
        if(status === 201){
            let { data : { email }} = await getUser({ username })
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', {username, userEmail: email, text, subject : "Password Recovery OTP" })
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
        return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}