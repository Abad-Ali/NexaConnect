import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

// // REGISTER
// export const register = async(req,res)=>{
//     try {
//        const {username, email, password} = req.body;

//        if(!username || !email || !password){
//             return res.status(400).json({
//                 message:"Something is missing, please check!",
//                 success:false
//             });
//         };

//         const user = await User.findOne({email});
//         if(user){
//             return res.status(409).json({
//                 message:"Email already in use. Try a different one.",
//                 success:false
//             });
//         };

//         const hashedPassword = await bcrypt.hash(password, 12); // use bcrypt to hash password

//         await User.create({
//             username,
//             email,
//             password:hashedPassword
//         });
//         return res.status(201).json({
//             message:"Account created successfully",
//             success:true
//         });
        
//     } catch (error) {
//         // console.log(error);
//         console.error("Registration error:", error);
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false
//         });
//     }
// }

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic required fields check
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        message: "Email already in use. Try a different one.",
        success: false,
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already exists. Try a different one.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: messages.join(", "),
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};



// LOGIN
export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Something is missing, please check!",
                success:false
            });
        };

        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false
            });
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect password",
                success:false
            });
        };
        
        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});

        const populatedPost = await Promise.all(
            user.posts.map(async (postId)=>{
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )

         // Prepare user data for frontend
        // user = {
        const userData = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPost
        }

        return res.cookie('token', token, {httpOnly:true, secure: true, sameSite:"none", maxAge: 1*24*60*60*1000}).json({
            message:`Welcome back ${userData.username}`,
            success:true,
            // userData  // to return for forntend
            user: userData
        })

    } catch (error) {
        // console.log(error);
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// LOGOUT
export const logout  = async(_,res)=>{
    try {
       return res.cookie ("token", "", {maxAge:0}).status(200).json({
        message:"Logged out successfully.",
        success:true
       });
    } catch (error) {
        // console.log(error);
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// GET USER PROFILE
export const getProfile = async(req,res)=>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password').populate({path:'posts' , options: { sort: { createdAt: -1 }}}).populate('bookmarks');

        if (!user) {
          return res.status(404).json({
            message: "User not found",
            success: false,
          });
        }

        return res.status(200).json({
            user,
            success:true
        });

    } catch (error) {
        // console.log(error);
        console.error("Get profile error:", error);
            return res.status(500).json({
              message: "Internal Server Error",
              success: false,
        });
    }
};

// EDIT USER PROFILE
export const editProfile = async(req,res)=>{
    try {
        const userId = req.id;
        const{name, bio, gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
           cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                message:'User not found.',
                success:false
            });
        }
    
        if(name) user.name = name;
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message:'Profile updated successfully',
            success:true,
            user
        });

    } catch (error) {
    //   console.log(error)
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while updating the profile.',
            success: false,
            error: error.message
        });
    }
};

// GET SUGGESTED USERs
export const getsuggestedUsers = async(req, res)=>{
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select('-password').sort({ createdAt: -1 });
        if(!suggestedUsers || suggestedUsers.length === 0){
            return res.status(400).json({
                message:'Currently do not have any user to show',
                success:false
            });
        }
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        })
    } catch (error) {
        // console.log(error);
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while fetching suggested users.',
            success: false,
            error: error.message
        });
    }
};

// FOLLOW OR UNFOLLOW
export const followOrUnfollow = async (req, res)=>{
    try {
        const followerId = req.id; // The user who is following
        const followeeId = req.params.id; // The user who is being followed
        if(followerId === followeeId){
            return res.status(400).json({
                message:"You can't follow yourself.",
                success:false
            });
        }

        const user = await User.findById(followerId);
        const targetUser = await User.findById(followeeId);

        if(!user || !targetUser){
            return res.status(404).json({
                message:'user not found',
                success:false
            });
        }

        const isFollowing = user.following.includes(followeeId);
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id:followerId}, {$pull:{following:followeeId}}),
                User.updateOne({_id:followeeId}, {$pull:{followers:followerId}})
            ]);
            return res.status(200).json({
                message:"Unfollowed successfully",
                success:true
            });
        }else{
            await Promise.all([
                // User.updateOne({_id:followerId}, {$push:{following:followeeId}}),   //$push works, but it can cause duplicate entries. To prevent this, useing $addToSet
                // User.updateOne({_id:followeeId}, {$push:{followers:followerId}})
                User.updateOne({_id:followerId}, {$addToSet:{following:followeeId}}),
                User.updateOne({_id:followeeId}, {$addToSet:{followers:followerId}})
            ]);
            return res.status(200).json({
                message:"Followed successfully",
                success:true
            });
        }

    } catch (error) {
        // console.log(error);
        console.error("Follow/Unfollow Error:", error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};


// TO SEARCH A USER
export const getSearchedUser = async (req, res) => {
    try {
        const { username } = req.query;
        // console.log(username);

        if (!username) {
            return res.status(400).json({
                message: 'Username is required.',
                success: false
            });
        }

        const searchedUser = await User.findOne({ username });

        if (!searchedUser) {
            return res.status(404).json({
                message: 'User does not exist.',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            user: searchedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while fetching the searched user.',
            success: false,
            error: error.message
        });
    }
};

// GET MULTIPLE USERS BY IDS
export const getUsersByIds = async (req, res) => {
  try {
    const { ids } = req.query; // ?ids=abc,def,ghi

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: "User IDs are required."
      });
    }

    const idArray = ids.split(",");
    const users = await User.find({ _id: { $in: idArray } })
      .select("username bio profilePicture");

    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users by IDs.",
      error: error.message
    });
  }
};
