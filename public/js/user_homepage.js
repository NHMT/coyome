var xoa_card_baiviet;
$(document).ready(function() {
	$('.popover_card').click(function(){
		var id = $(this).data('id');
		$('.xoa-card').click(function(){
			$.confirm({
				title: '<h6>Bạn có chắc là muốn xóa bài viết này?</h6>',
				content: 'Sẽ tự động hủy sau 10s',
				type: 'red',
				typeAnimated: true,
				autoClose: 'Hủy|10000',
				buttons: {
					deleteUser: {
						text: 'Xóa',
						action: function () {
							$.ajax({
								type : 'GET',
								url : 'http://localhost:3000/user/delete-post/'+id,
								success : function(data)
										  { 
											 if(data == 'false') 
											 {
												$.alert('Có lỗi trong việc xóa bài viết này!');
											 }else{
												$( "#card_baiviet_"+id).remove();
											   $.alert('Xóa bài viết thành công!');
											 }
										  }
								});
								return true;
							
						}
					},
					Hủy: function () {
						$.alert('Hành động <b style="color: red;">Xóa</b> đã bị hủy bỏ!');
					}
				}
			});	
		 });
	});
	//add post
	$('.all_post_xoaPost').click(function(){
		var id = $(this).data('id');
		$.confirm({
			title: '<h6>Bạn có chắc là muốn xóa bài viết này?</h6>',
			content: 'Sẽ tự động hủy sau 10s',
			type: 'red',
			typeAnimated: true,
			autoClose: 'Hủy|10000',
			buttons: {
				deleteUser: {
					text: 'Xóa',
					action: function () {
						$.ajax({
							type : 'GET',
							url : 'http://localhost:3000/user/delete-post/'+id,
							success : function(data)
									  { 
										 if(data == 'false') 
										 {
											$.alert('Có lỗi trong việc xóa bài viết này!');
										 }else{
											$( "#rwo_posts_"+id).remove();
										   $.alert('Xóa bài viết thành công!');
										 }
									  }
							});
							return true;
						
					}
				},
				Hủy: function () {
					$.alert('Hành động <b style="color: red;">Xóa</b> đã bị hủy bỏ!');
				}
			}
		});	
		
	});
	//follow user
	$('.btn-1').click(function(){
		var id_user = $(this).data('id1');
		var id_user2 = $(this).data('id2');
		$.ajax({
			type : 'GET',
			url : 'http://localhost:3000/user/follow-user/'+id_user+'/'+id_user2,
			success : function(data)
					  { 
						 if(data == 'false') 
						 {
							$.alert('Có lỗi trong việc follow tài khoản này!');
						 }else{
							$( ".btn-1").attr('disabled', 'disabled');
							$( ".btn-1").html('<i class="fas fa-check"></i> Đã theo dõi');
						 }
					  }
			});
	})
	//connect user
	// $('.btn-2').click(function(){
	// 	var id_user = $(this).data('id1');
	// 	var id_user2 = $(this).data('id2');
	// 	var connect = $('.click_connect').data('connect');
	// 	if (connect == 0) {
	// 		$.ajax({
	// 			type : 'GET',
	// 			url : 'http://localhost:3000/user/connect-user/'+id_user+'/'+id_user2,
	// 			success : function(data)
	// 					  { 
	// 						  console.log(data);
							  
	// 						 if(data == 'false') 
	// 						 {
	// 							$.alert('Có lỗi trong việc kết nối với tài khoản này!');
	// 						 }else{
	// 							$('.btn-2').html('<i data-connect="1" class="fas fa-link click_connect"></i> Chờ phản hồi');
	// 						 }
	// 					  }
	// 			});
			

			
	// 	}
	// 	else{
	// 		$.ajax({
	// 			type : 'GET',
	// 			url : 'http://localhost:3000/user/unconnect-user/'+id_user+'/'+id_user2,
	// 			success : function(data)
	// 					  { 
	// 						 if(data == 'false') 
	// 						 {
	// 							$.alert('Có lỗi trong việc hủy kết nối tài khoản này!');
	// 						 }else{
	// 							$('.btn-2').html('<i data-connect="0" class="fas fa-link click_connect"></i> Kết nối');
	// 						 }
	// 					  }
	// 			});
			
	// 	}
		
	// });
	var socket = io("http://localhost:4000");
	$(".btn-2").click(function(){
		var id_user = $(this).data('id1');
		var id_user2 = $(this).data('id2');
		var connect = $('.click_connect').data('connect');
		if (connect == 0) {
			$('.btn-2').html('<i data-connect="1" class="fas fa-link click_connect"></i> Chờ phản hồi');
			socket.emit("Con", {id_user:id_user,id_user2:id_user2});
		}else{
			$('.btn-2').html('<i data-connect="0" class="fas fa-link click_connect"></i> Kết nối');
			socket.emit("UnCon", {id_user:id_user,id_user2:id_user2});
		}
	});

	//nut show report user
	$('.nut_show_report_user').click(()=>{
		$('.report_user').addClass('show_report_user');
		$('.mo_background_chat_box').addClass('show_mo_background_chat_box');
	})
	//nut show report bai viet	
	$('.nut_report_baiviet').click(()=>{
		$('.report_baiviet').addClass('show_report_baiviet');
		$('.mo_background_chat_box').addClass('show_mo_background_chat_box');
	});

});