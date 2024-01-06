const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../Uitils/responseWrapper");


const getMyPostController = async (req, res) => {
    try {
        const curUserId = req._id
        const curUser = User.findById(curUserId)

        const posts = await Post.findOne({
            'owner':  curUserId

    }).populate(likes)

    return res.send(success(200, {posts}));
    } catch (e) {
        return res.send(error(500, e.message))
    }
    
}

const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body
        if(!caption || !postImg){
            return res.send(error(400,"cation is required"))
        }

        const cloudImg = await cloudinary.uploader.upload(postImg,{
            folder: 'postImg'
        })

        const owner = await req._idp

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

    const post = await Post.findById(postId).poppulate('owner');
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

const getUserPost = async (req, res) => {
        try {
            const { userIdToCheckPost } = req.body;

        const userToCheckPost = await User.findById(userIdToCheckPost);
        if (!userIdToCheckPost) {
            return res.send(error(404, 'User not found'))

        }

        if (!userToCheckPost) {
            return res.send(error(404, 'User to check post not found'))
        }

        const posts = await Post.find({
            "owner":  userIdToCheckPost
        }).populate (likes) 

        return res.send(success(200, {posts}));
        } catch (e) {
            return res.send(error(500,e.message))
        }

}








module.exports = {
        getUserPost,
        createPostController,
        likeAndUnlikePost,
        updatePostController,
        deletePostController,
        getMyPostController,
    }
