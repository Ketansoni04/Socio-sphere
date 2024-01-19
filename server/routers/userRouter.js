const router = require('express').Router();
const UserController = require('../controllers/UserController')
const requireUser = require('../middlewares/requireUser')

router.post("/follow", requireUser, UserController.followUnfollowUserController)
router.get("/getFeedData", requireUser, UserController.getTheFollowingPost)
router.delete("/", requireUser, UserController.deleteProfileController)
router.get("/getMyPost", requireUser, UserController.getMyPostController)
router.get("/getMyInfo", requireUser, UserController.getMyInfo)
router.post('/getUserProfile',requireUser, UserController.getUserProfile)
router.put('/',requireUser, UserController.updateMyProfile)
router.get("/getUserPost", requireUser, UserController.getUserPost)
module.exports = router;