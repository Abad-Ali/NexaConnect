import express from 'express';
import { register, login, logout, getProfile, editProfile, getsuggestedUsers, followOrUnfollow, getSearchedUser, getUsersByIds } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated,getsuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);
router.route('/search').get(isAuthenticated,getSearchedUser);
router.route('/users').get(isAuthenticated,getUsersByIds);

export default router