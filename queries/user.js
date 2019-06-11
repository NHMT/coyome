var moment = require('moment');
const path = require('path');
var express = require("express");
var app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(4000);

io.on("connection", function(socket)
	{
		socket.on("disconnect", function()
			{
			});
         //server lắng nghe dữ liệu từ client
		socket.on("Con",async function(data){
        var id_user1 = data.id_user;
        var id_user2 = data.id_user2;
        const connect = await pool.query('INSERT INTO cho_connect(id_usercon1,id_usercon2) VALUES($1, $2)',[id_user1, id_user2]);
        const user = await pool.query('SELECT * FROM users WHERE id=$1',[id_user1]);
				//sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
        socket.broadcast.emit("Server-sent-data", {user1:user.rows, user2: id_user2});
    });
    socket.on("UnCon",async function(data){
      var id_user1 = data.id_user;
      var id_user2 = data.id_user2;
      const unconnect = await pool.query('DELETE FROM cho_connect WHERE id_usercon1=$1 AND id_usercon2=$2',[id_user1, id_user2]);
    })
    socket.on("cho_ketnoi",async function(data){
      var id = data;
      const cho_ketnoi = await pool.query('SELECT * FROM cho_connect WHERE id_usercon2 = $1',[id]);
      const all_user = await pool.query('SELECT * FROM users');
      socket.emit("result_choConnect", {data1:cho_ketnoi.rows,data2:all_user.rows});
    })
    socket.on("chapnhan_ketnoi", async function(data){
      var user1 = data.user1;
      var user2 = data.user2;
      const cho_connect = await pool.query('DELETE FROM cho_connect WHERE id_usercon1=$1 AND id_usercon2=$2',[user1,user2]);
      const connect = await pool.query('INSERT INTO connect_users(id_usercon1,id_usercon2) VALUES($1,$2)',[user1, user2]);
      socket.emit("result_chapnhan", data.user1);
    })
    socket.on("ko_ketnoi", async function(data){
      var user1 = data.user1;
      var user2 = data.user2;
      const cho_connect = await pool.query('DELETE FROM cho_connect WHERE id_usercon1=$1 AND id_usercon2=$2',[user1,user2]);
    })
	});

const Resize = require('./Resize');
//Connect PostgreSQL
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Coyome',
  password: 'minhtri',
  port: 5432,
});

async function get_UserHome(req, res, next){
    
    var id = req.params.id;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]); 
    if(user.rows.length < 1){
      res.send('Xin lỗi không có User này!');
      return false;
    }
    else{
      const user_con = await pool.query('SELECT * FROM connect_users WHERE id_usercon1 = $1 OR id_usercon2 = $1', [user.rows[0].id]); 
      const user_baiviet = await pool.query('SELECT * FROM baiviet WHERE id_user = $1 ORDER BY created_at DESC', [user.rows[0].id]); 
      const chude_baiviet = await pool.query('SELECT * FROM chude'); 
      const baiviet_comment = await pool.query('SELECT * FROM luotcmt');   
      const user_comment = await pool.query('SELECT * FROM luotcmt WHERE id_user = $1',[user.rows[0].id]);   
      const baiviet_vote = await pool.query('SELECT * FROM luotvote'); 
      const user_followers = await pool.query('SELECT * FROM folow_users WHERE id_user = $1',[user.rows[0].id]); 
      const user_following = await pool.query('SELECT * FROM folow_users WHERE id_userfl = $1',[user.rows[0].id]); 
      const comment_of_comment = await pool.query('SELECT * FROM luotcmt_cmt'); 
      const cho_connect = await pool.query('SELECT * FROM cho_connect WHERE id_usercon2 =$1',[user.rows[0].id]);


      var user_connect = [];
      for(const id of user_con.rows ){
          const user = await pool.query('SELECT * FROM users WHERE id = $1',[id.id_usercon2]);
          const user2 = await pool.query('SELECT * FROM users WHERE id = $1',[id.id_usercon1]);
          user_connect.push(user.rows[0]);
          user_connect.push(user2.rows[0]);
      }

      res.render('user/user_homepage', {
        title: 'User Home', 
        data:user.rows[0],
        user_con:user_con.rows, 
        user_baiviet:user_baiviet.rows,
        chude_baiviet: chude_baiviet.rows,
        baiviet_comment: baiviet_comment.rows,
        user_comment: user_comment.rows,
        comment_of_comment: comment_of_comment.rows,
        user_followers: user_followers.rows,
        user_following: user_following.rows,
        baiviet_vote: baiviet_vote.rows,
        user_connect: user_connect,
        cho_connect: cho_connect.rows,
        moment: moment
      });   
    }
    
  
}
async function get_PostsDetail(req, res, next){
  var id_BaiViet = req.params.id;
  const baiviet = await pool.query('SELECT * FROM baiviet WHERE id = $1', [id_BaiViet]); 
  const chude = await pool.query('SELECT * FROM chude WHERE id = $1', [baiviet.rows[0].id_chude]); 
  const author = await pool.query('SELECT * FROM users WHERE id = $1', [baiviet.rows[0].id_user]); 
  const all_baiviet_user = await pool.query('SELECT * FROM baiviet WHERE id_user = $1', [author.rows[0].id]); 
  const duoc_follow = await pool.query('SELECT * FROM folow_users WHERE id_userfl = $1', [author.rows[0].id]); 
  const baiviet_cungcd = await pool.query('SELECT * FROM baiviet WHERE id_chude = $1 AND id != $2 ORDER BY created_at DESC LIMIT 10' ,[chude.rows[0].id,id_BaiViet ]);
  const banbe = await pool.query('SELECT * FROM connect_users WHERE id_usercon1 = $1',[author.rows[0].id]);
  var baiviet_bb=[];
  for(const user of banbe.rows){
    const baiviet_banbe = await pool.query('SELECT * FROM baiviet WHERE id_user = $1 ORDER BY created_at DESC LIMIT 2' ,[user.id_usercon2]);
    if(baiviet_banbe.rows.length >= 1){
      baiviet_bb.push(baiviet_banbe.rows);
    }
  }
  const comment = await pool.query('SELECT * FROM luotcmt WHERE id_baiviet = $1', [id_BaiViet]);
  const user_comment = await pool.query('SELECT * FROM users');
  const luotvote_comment = await pool.query('SELECT * FROM luotvote_cmt');
  const comment_comment = await pool.query('SELECT * FROM luotcmt_cmt');
  

  res.render('posts_detail',{
    title:'Posts_Detail', 
    baiviet: baiviet.rows,
    chude: chude.rows,
    author: author.rows,
    all_baiviet_user: all_baiviet_user.rowCount,
    duoc_follow: duoc_follow.rowCount,
    baiviet_cungcd: baiviet_cungcd.rows,
    baiviet_bb: baiviet_bb[0],
    comment: comment.rows,
    user_comment: user_comment.rows,
    luotvote_comment:luotvote_comment.rows,
    comment_comment:comment_comment.rows,
    moment: moment
  });
}
//Delete Post
async function delete_Post(req, res, next){
  var id_BaiViet = req.params.id;
  const delete_post = await pool.query('DELETE FROM baiviet WHERE id = $1', [id_BaiViet]);
  if (delete_post.rowCount == 1) {
    res.send('true');
  }
  else{
    res.send('false');
  }
  //res.send(delete_post.rowCount);
}
// All Post
async function all_Post(req, res, next){
  var id = req.params.id;
  const baiviet = await pool.query('SELECT * FROM baiviet WHERE id_user = $1', [id]);
  const chude = await pool.query('SELECT * FROM chude');
  const user_duyet = await pool.query('SELECT * FROM users');

  res.render('user/all_post', {
    title: 'Tất cả bài viết',
    baiviet: baiviet.rows,
    chude: chude.rows,
    user_duyet: user_duyet.rows,
  });
}

// ADD Post
async function show_add_Post(req, res, next){
  const chude = await pool.query('SELECT * FROM chude'); 
  res.render('user/add_post', {
    title: 'Thêm bài viết',
    chude: chude.rows,
  });
}
async function get_keyword(req, res, next){
  var keyword = req.params.keyword;
  const baiviet = await pool.query("SELECT * FROM baiviet WHERE keyword ILIKE ('%' || $1 || '%')",[keyword]);
  res.send (baiviet.rows);
}
async function add_Post(req, res, next){
  // folder upload
  const imagePath = path.join(__dirname, '../public/img-posts');
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  const filename = await fileUpload.save(req.file.buffer);
  const id_user = req.user[0].id;
  const tieude  = req.body.tieude;
  const trichdan = req.body.trichdan;
  const noidung  = req.body.ckeditor_form;
  const chude = req.body.chude;
  const keyword = req.body.keyword;
  
  
  const baiviet = await pool.query(
    'INSERT INTO baiviet (tieude, noidung, trichdan, keyword, id_user, id_chude, des_pic) VALUES($1,$2,$3,$4,$5,$6,$7)',[tieude,noidung,trichdan,keyword,id_user,chude,filename]
    );
  if(baiviet.rowCount == 1){
    res.redirect('/user/all-posts/'+id_user);
  }
  else{
    res.redirect('back');
  }
  
}
//EDIT POST
async function show_edit_Post(req, res, next){
  var id_baiviet = req.params.id;
  const baiviet = await pool.query('SELECT * FROM baiviet WHERE id = $1',[id_baiviet]);
  const chude = await pool.query('SELECT * FROM chude');
  res.render('user/edit_post',{
    title: 'Sửa bài viết',
    baiviet: baiviet.rows,
    chude: chude.rows,
  })
}
async function update_Post(req, res, next){
  var id_baiviet = req.body.id_baiviet;
  const imagePath = path.join(__dirname, '../public/img-posts');
  const fileUpload = new Resize(imagePath);
  var filename;
  if (!req.file) {
    filename = await req.body.anhcu;
  }else{
    filename = await fileUpload.save(req.file.buffer);
  }
  //const id_user = req.user[0].id;
  const tieude  = req.body.tieude;
  const trichdan = req.body.trichdan;
  const noidung  = req.body.ckeditor_form;
  const chude = req.body.chude;
  const keyword = req.body.keyword;
  const baiviet = await pool.query('UPDATE baiviet SET tieude=$1, trichdan=$2, noidung=$3,id_chude=$4, keyword=$5, des_pic=$6 WHERE id=$7',[tieude,trichdan,noidung,chude,keyword,filename,id_baiviet]);

}
//Follow User
async function follow_User(req, res, next){
  var id_user1 = req.params.id1;
  var id_user2 = req.params.id2;
  const follow = await pool.query('INSERT INTO folow_users(id_user,id_userfl) VALUES ($1, $2)',[id_user1, id_user2]);
  if(follow.rowCount >= 1){
    res.send('true');
  }
  else{
    res.send('false');
  }
}
//Connect USER
async function connect_User(req, res, next){
  var id_user1 = req.params.id1;
  var id_user2 = req.params.id2;
  const connect = await pool.query('INSERT INTO cho_connect(id_usercon1,id_usercon2) VALUES($1, $2)',[id_user1, id_user2]);
  if(connect.rowCount >= 1){
    res.send('true');
  }
  else{
    res.send('false');
  }

}
async function unconnect_User(req, res, next){
  var id_user1 = req.params.id1;
  var id_user2 = req.params.id2;
  const unconnect = await pool.query('DELETE FROM cho_connect WHERE id_usercon1=$1 AND id_usercon2=$2',[id_user1, id_user2]);
  if(unconnect.rowCount >= 1){
    res.send('true');
  }
  else{
    res.send('false');
  }
}
//Trang quản lý tài khoản USER
async function acount_Management_User(req, res, next){
  res.render('user/acount_management',{title: 'Quản lý tài khoản'});
}
//Trang quản lý hộp thư
async function letter_Box(req, res, next){
  res.render('user/letter_box',{title:'Quản lý hộp thư'});
}
//Chat box
async function chat_User(req, res, next){
  res.render('user/chat_box', {title: 'Trò chuyện'});
}

module.exports= {
    get_UserHome: get_UserHome,
    get_PostsDetail: get_PostsDetail,
    delete_Post: delete_Post,
    all_Post: all_Post,
    show_add_Post: show_add_Post,
    get_keyword: get_keyword,
    add_Post: add_Post,
    show_edit_Post: show_edit_Post,
    update_Post: update_Post,
    follow_User: follow_User,
    connect_User: connect_User,
    unconnect_User: unconnect_User,
    acount_Management_User: acount_Management_User,
    letter_Box: letter_Box,
    chat_User: chat_User,
}