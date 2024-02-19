const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../Uitils/responseWrapper");
const { mapPostOutput } = require("../Uitils/Utils");
const cloudinary = require("cloudinary").v2




const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body
        if(!caption || !postImg){
            return res.send(error(400,"cation is required"))
        }

        const cloudImg = await cloudinary.uploader.upload(postImg,{
            folder: 'postImg'
        })

        const owner = await req._id

        const user = await User.findById(req._id)
        const post = await Post.create({
            owner,
            caption,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.secure_url
            },

        })

        user.posts.push(post._id)
        await user.save();

        return res.send(success(201, post)); 

    }
    catch (e) {
        return res.send(error(500, e.message))
    }
}

const likeAndUnlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
    const curUserId = req._id

    const post = await Post.findById(postId).populate('owner');
    if (!post) {
        return res.send(error(404, 'post not found'))
    }

    if(post.likes.includes(curUserId)) {
        const index = post.likes.indexOf(curUserId);
        post.likes.splice(index, 1);
    }
    else {
        await post.likes.push(curUserId);
    }
    await post.save();
        return res.send(success(200, {post: mapPostOutput(post,req._id)}))
    } catch (e) {
        return res.send(error(500, e.message))
    }
    
}

const deletePostController = async (req, res) => {
    
    try {
        const {postId} = req.body
        const curUserId = req._id

    const curUser = await User.findById(curUserId)
    const post = await Post.findById(postId)
    if (!post) {
        return res.send(error(404, "Post not found"))
    }

    if (post.owner.toString() !== curUserId) {
        return res.send(error(403, 'Only owners can delete the post'))
    }

    const index =  curUser.posts.indexOf(postId)
    curUser.posts.splice(index, 1)

    await curUser.save();
    await post.remove(postId)
    await post.save();

    return res.send(success(200, 'post successfully deleted'))
    } catch (e) {
        console.log(e)
        return res.send(error(500,e.message))
    }

}

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body
        const curUserId = req._id

        const post = await Post.findById(postId)
        if (!post) {
            return res.send(error(404, "Post not found"))
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, 'Only owners can update the post'))
        }
        if (caption) {
            post.caption = caption
        }

        await post.save();

        return res.send(success(200, { post }))


    }
    catch (e) {
        return res.send(error(500, e.message))
    }
}










module.exports = {
        createPostController,
        likeAndUnlikePost,
        updatePostController,
        deletePostController,
    }
