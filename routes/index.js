var flash = require('connect-flash');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
//connect database
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Coyome',
  password: 'minhtri',
  port: 5432,
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Coyome'});
});
//Get Home theo chủ đề
router.get('/chude/:idchude',(req, res, next)=>{
  res.render('index_topic', {title: 'Công nghệ'})
})
// router.get('/', function(req, res, next) {

  
//   res.render('index', { title: 'Home', user: req.session.passport.user});
// });
router.post('/login',function(req, res, next){ Passport.authenticate('local', function(err, user, info){
  if (err) { 
    req.flash('err_user', 'Có lỗi trong quá trình xử lý. Vui lòng thử lại!');
    return res.redirect('back'); 
  }
  if (!user) { 
    req.flash('no_user', 'Có vẻ như tài khoản hay mật khẩu không chính xác!');
    return res.redirect('back'); 
  }
  req.logIn(user, async function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Đăng nhập thành công!');
    //Lấy tin nhắn kết nối
    const id = req.user[0].id; 
    const cho_ketnoi = await pool.query('SELECT * FROM cho_connect WHERE id_usercon2 = $1',[id]);
    const all_user = await pool.query('SELECT * FROM users');
    req.app.locals.all_user = all_user.rows;
    req.app.locals.c_cn = cho_ketnoi.rows ;
    return res.redirect('back');
  });
})(req, res, next);});

//Signout
router.get('/signout', function(req, res) {
  req.flash('sign_out', 'Đăng xuất thành công.Hẹn gặp lại nhé!');
  req.logout();
  res.redirect('back');
});
Passport.use( new LocalStrategy(async function(username, password, done){
  var userRecord = await pool.query('SELECT * FROM users WHERE ten_dn = $1 AND password = $2', [username,password]);
  if(userRecord.rows.length > 0){
    return done(null, userRecord.rows);
     
  }else{
    return done(null , false)
  }
}))
Passport.serializeUser(function(user, done) {
  done(null, user);
});

Passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = router;
