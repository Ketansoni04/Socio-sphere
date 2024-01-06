const router = require('express').Router();
const UserController = require('../controllers/UserController')
const requireUser = require('../middlewares/requireUser')

router.post("/follow", requireUser, UserController.followUnfollowUserController)
router.get("/getFeedData", requireUser, UserController.getTheFollowingPost)
router.delete("/delProfile", requireUser, UserController.deleteProfileController)
router.get("/getMyInfo", requireUser, UserController.getMyInfo)
router.get("/", requireUser, UserController.updateMyProfile)
router.post('/getUserProfile',requireUser, UserController.getUserProfile)
module.exports = router;