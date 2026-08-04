const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================
// Register
// ======================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
        } = req.body;


        const userExists = await User.findOne({
            email,
        });


        if(userExists){

            return res.status(400).json({

                success:false,
                message:"Email Already Exists",

            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = new User({

            name,

            email,

            password: hashedPassword,

            role:"Patient",

        });


        await user.save();


        res.status(201).json({

            success:true,

            message:"Registration Successful",

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message,

        });

    }

};



// ======================
// Login
// ======================

const login = async(req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;


        const user = await User.findOne({
            email
        });


        if(!user){

            return res.status(404).json({

                success:false,

                message:"User Not Found"

            });

        }


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if(!isMatch){

            return res.status(401).json({

                success:false,

                message:"Invalid Password"

            });

        }


        const token = jwt.sign(

            {
                id:user._id,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"7d"
            }

        );


        res.status(200).json({

            success:true,

            message:"Login Successful",

            token,

            user:{

                id:user._id,

                name:user.name,

                email:user.email,

                role:user.role

            }

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



module.exports = {

    register,

    login

};