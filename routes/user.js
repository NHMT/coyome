var express = require('express');
var router = express.Router();
var user = require('../queries/user');
const upload = require('../queries/middleware_upload');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    req.flash('chua_dn', 'Vui lòng đăng nhập trước khi thực hiện thao tác!');
    res.redirect('/');
  }

router.get('/home/:id',user.get_UserHome);
router.get('/posts-detail/:id', user.get_PostsDetail);
router.get('/delete-post/:id',isAuthenticated, user.delete_Post);
router.get('/all-posts/:id',isAuthenticated, user.all_Post);
router.get('/add-post',isAuthenticated, user.show_add_Post);
router.get('/get_keyword/:keyword',isAuthenticated, user.get_keyword);
router.post('/add-post',isAuthenticated,upload.single('anh'), user.add_Post);
router.get('/post-edit/:id',isAuthenticated, user.show_edit_Post);
router.post('/update-post',isAuthenticated,upload.single('anh'), user.update_Post);
router.get('/follow-user/:id1/:id2',isAuthenticated, user.follow_User);
router.get('/connect-user/:id1/:id2',isAuthenticated, user.connect_User);
router.get('/unconnect-user/:id1/:id2',isAuthenticated, user.unconnect_User);
router.get('/acount-management/:id', user.acount_Management_User);
router.get('/letter-box/:id', user.letter_Box);
router.get('/chat-box/:id' , user.chat_User);

module.exports = router;