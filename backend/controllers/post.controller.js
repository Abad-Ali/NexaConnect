import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import {Comment} from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// TO ADD A NEW POST
export const addNewPost = async(req, res)=>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if (caption && caption.length > 500) {
            return res.status(400).json({
                message: 'Caption is too long (max 500 characters)',
                success: false
            });
        }
        if(!image){
            return res.status(400).json({
                message:'Image required',
                success:false
            });
        }
        if (!authorId) {
            return res.status(401).json({
                message: 'Unauthorized. Author ID missing.',
                success: false
            });
        }

        //Image upload
        const optimizedImageBuffer = await sharp(image.buffer).resize({width:700,height:700,fit:"cover"}).toFormat('jpeg', {quality:80}).toBuffer();

        //buffer to datauri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author', select:'-password'});

        return res.status(201).json({
            message:'New post created successfully',
            post,
            success:true
        });

    } catch (error) {
        // console.log(error)
        console.error('Error in addNewPost:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};

// TO GET ALL POSTS OF ALL USERS IN FEED
export const getAllPost = async(req, res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username profilePicture'})
        .populate({
            path:'comments',
            // sort:{createdAt:-1},  // This will be ignored
            options: { sort: { createdAt: -1 } },
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success:true
        });

    } catch (error) {
        // console.log(error);
        console.error('Error in getAllPost:', error);
        return res.status(500).json({
            message: 'Failed to fetch posts.',
            error: error.message,
            success: false
        });
    }
};

// TO GET POSTS OF A PERTICULER USER 
export const getUserPost =  async(req, res)=>{
    try {
        const authorId = req.id;
        if (!authorId) {
            return res.status(401).json({
                message: 'Unauthorized. Author ID missing.',
                success: false
            });
        }

        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username profilePicture'
        }).populate({
            path:'comments',
            // sort:{createdAt:-1},  // This will be ignored
            options: { sort: { createdAt: -1 } },
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success:true
        });

    } catch (error) {
        // console.log(error)
        console.error('Error in getUserPost:', error);
        return res.status(500).json({
            message: 'Failed to fetch user posts.',
            success: false
        });
    }
};

//TO LIKE A POST
export const likePost = async(req, res)=>{
    try {
        const likedBy_Id = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:'Post not found',
                success:false
            });
        }

        //like Logic 
        await post.updateOne({$addToSet:{likes:likedBy_Id}});
        await post.save();

        // implent socket io for real time notification
        const user = await User.findById(likedBy_Id).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likedBy_Id){
            //emit a notification
            const notification = {
                type:'like',
                userId:likedBy_Id,
                userDetails:user,
                postId,
                message:'Someone like your post',
                timestamp: new Date().toISOString()
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        };


        return res.status(200).json({
            message:'Post liked successfully',
            success:true
        });

    } catch (error) {
        // console.log(error);
        console.error('Error in likePost:', error);
        return res.status(500).json({
          message: 'Failed to like post',
          success: false
        });
    }
};

// TO DISLIKE THE POST
export const dislikePost = async(req, res)=>{
    try {
        const likedBy_Id = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:'Post not found',
                success:false
            });
        }

        //dislike Logic 
        await post.updateOne({$pull:{likes:likedBy_Id}});
        await post.save();

        // implent socket io for real time notification
        const user = await User.findById(likedBy_Id).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likedBy_Id){
            //emit a notification
            const notification = {
                type:'dislike',
                userId:likedBy_Id,
                userDetails:user,
                postId,
                message:'disliked your post',
                timestamp: new Date().toISOString()
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        };

        return res.status(200).json({
            message:'Post disliked successfully',
            success:true
        });

    } catch (error) {
        // console.log(error);
        console.error('Error in dislikePost:', error);
        return res.status(500).json({
          message: 'Failed to like post',
          success: false
        });
    }
};

// TO ADD Comment
export const addComment = async(req, res)=>{
    try {
       const postId = req.params.id;
       const commentedById = req.id;

       const {text} = req.body;
       if(!text){
          return res.status(400).json({
              message:'Text required for comment',
              success:false
          });
        }

        const post = await Post.findById(postId);

    //    const comment = await Comment.create({
    //     text,
    //     author:commentedById,
    //     post:postId
    //    })
    //    await comment.populate({
    //     path:'author',
    //     select:'username profilePicture'
    //    });
       
       // First create the comment
       let comment = await Comment.create({
         text,
         author: commentedById,
         post: postId
       });

       // Then populate author info separately
       comment = await comment.populate({
         path: 'author',
         select: 'username profilePicture'
       });

       post.comments.push(comment._id);
       await post.save();

       return res.status(200).json({
        message:'Comment added successfully',
        comment,
        success:true
       });

    } catch (error) {
        // console.log(error);
        console.error('Error in addComment:', error);
        return res.status(500).json({
          message: 'Failed to add comment',
          success: false
        });
    }
};

// TO GET COMMENT OF THE POST
export const getCommentOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).sort({ createdAt: -1 }).populate('author', 'username profilePicture');
    
        if(comments.length === 0){
            return res.status(404).json({
                message:'No comment found',
                success:false
            });
        }
    
        return res.status(200).json({
            success:true,
            comments
        });

    } catch (error) {
        // console.log(error);
        console.error('Error in getCommentOfPost:', error);
        return res.status(500).json({
          message: 'Failed to fetch comments',
          success: false
        });
    }
};

// TO DELETE POST
export const deletePost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:'Post not found',
                success:false
            });
        }

        // check if logged-in  user is the author
        if(post.author.toString() !== authorId){
            return res.status(403).json({
                message:'Unauthorized. You can only delete your own posts.',
                success:false
            });
        }

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post ID form the User's posts
        let user = await User.findById(authorId);
        if(user){
            user.posts = user.posts.filter(id => id.toString() !== postId);
            await user.save();
        }

        // delete associated coments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message:'Post deleted successfully',
            success:true
        });

    } catch (error) {
        // console.log(error);
        console.error('Error in deletePost:', error); // ✅ Proper logging
        return res.status(500).json({
          message: 'Failed to delete post',
          success: false
        });
    }
};

// TO BOOKMARK THE POST
export const bookmarkPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:'Post not found.',
                success:false
            });
        }

        const user = await User.findById(authorId);
        if (!user) {
          return res.status(404).json({
            message: 'User not found.',
            success: false
          });
        }
        
        if(user.bookmarks.includes(post._id)){
            // already bookmarked ---->  remove it 
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({
                message:'Post removed from bookmarks',
                success:true
            });
        }else{
            // bookmarked the post
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({
                message:'Post bookmarked successfully',
                success:true
            });
        }

    } catch (error) {
        // console.log(error);
        console.error('Error in bookmarkPost:', error);
        return res.status(500).json({
          message: 'Failed to toggle bookmark',
          success: false
        });
    }
};