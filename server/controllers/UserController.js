 const User = require("../models/User");
const { error, success } = require("../Uitils/responseWrapper");
const Post = require('../models/Post');
const { mapPostOutput } = require("../Uitils/Utils");
const cloudinary = require("cloudinary").v2

const followUnfollowUserController = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId)

        if (!userToFollow) {
            return res.send(error(404, 'User to follow not found'))
        }

        if (curUser.followings.includes(userIdToFollow)) {
            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex, 1);

            const followerIndex = userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followerIndex, 1);
        }
        else {
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);
        }

        await userToFollow.save();
        await curUser.save();

        return res.send(success(200),{user : userToFollow})
    } catch (e) {
        console.log(e);
        return res.send(error(500, e.message))
    }
}

const getTheFollowingPost = async (req, res) => {
    try {
        const curUserId = req._id
        const curUser = await User.findById(curUserId)

        const fullPosts = await Post.find({
            'owner': {
                '$in': curUser.followings
            }
        }).populate('owner')

        const posts = fullPosts.map(item => mapPostOutput(item,req._id)).reverse();
        const followingsId = curUserId.followings.map((item) => item._id)
        followingsId.push(req._id)
        const notFollowingsId = await User.find({
            _id: {
                $nin: followingsId
            }
        })

        return res.send(success(200, {...curUser.doc,notFollowingsId,posts}))
    }catch (e) {
        return res.send(error(500, e.message))
    }
}

const deleteProfileController = async (req,res) => {
    try{
        const curUserId = req._id;
            
        Post.deleteMany({
            "owner" : curUserId
        })

        curUser.followers.forEach( async(followerId) => {
            const follower = User.findById(followerId)
            const index = follower.followings.indexOf(curUserId);
            follower.following .splice(index,1);
            await follower.save()
        })
        
        curUser.followings.forEach( async(followingId) => {
            const following = User.findById(followingId)
            const index = following.followoers.indexOf(curUserId);
            following.followers.splice(index,1)
            await following.save()
        })

        const allPost = await Post.find()
        allPost.forEach(async (post) => {
            const index = post.likes.indexOf(curUserId)
            post.likes.splice(index,1);
            await post.save()
        })
       const curUser = await User.findById(curUserId)
       curUser.remove(curUserId); 
       return res.send(success(200, ' profile deletedf '))
 
    } catch(e){
         return res.send(error(500,e.message))
    }
 }

 const getMyInfo = async (req,res) => {
    try{
        
     const user = await User.findById(req._id)
    return res.send(success(200,{user}))

    }
    catch(e){
        return res.send(error(500,e.message));
    }
}

const updateMyProfile = async (req,res) => {
    try {
        const {name,bio, userImg} = req.body;
        const user = await User.findById(req._id);
        if(name){
            user.name = name;
        }
        if(bio){
            user.bio = bio;
        }
        if(userImg){
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'profileImg'
            })
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }
            await user.save;
            return res.send(success(200,{user}));
        }
    } catch (e) {
        return res.send(error(500,e.message));
    }
}
    const getUserProfile = async(req,res) => {
        const userId = req.body.userId
        const user = await User.findById(userId).populate({
             path: 'post',
             poppulate: {
                path:  'owner'
             }
        }) 

        const fullPosts = user.posts
        const posts = fullPosts.map(item => mapPostOutput(item,user._id)).reverse();

        return res.send(success(200,...user.doc,{posts}))
    }


module.exports = {
    followUnfollowUserController,
    getTheFollowingPost,
    deleteProfileController,
    getMyInfo,
    updateMyProfile,
    getUserProfile
}
