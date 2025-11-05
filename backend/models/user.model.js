import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true, minlength: 3, maxlength: 15, match: [/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, underscores, or dots.']},
    email:{type:String, required:true, unique:true, match: [/.+\@.+\..+/, 'Please enter a valid email address']},
    password:{type:String, required:true, minlength: 3},
    profilePicture:{type:String, default:""},
    bio:{type:String, default:""},
    gender:{type:String, enum:['male', 'female', 'prefer not to say']},
    followers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    posts:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
    bookmarks:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
    name:{type:String, default:""}
}, {timestamps:true});

export const User = mongoose.model('User', userSchema);
