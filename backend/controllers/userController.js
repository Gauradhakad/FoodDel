import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt.js";
import validator from "validator";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Does Not Exist!" });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Wrong Credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }

}


// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // checking if user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        // validatin email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a Valid Email!" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter password more than 8 characters" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel(
            {
                name: name,
                email: email,
                password: hashPassword
            })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser };


