$(document).ready(function() {
    var formDangnhap = $('.form_dangnhap');
    var formDangky = $('.form_dangky');
    var mo = $('.mo');
    $("#nut_login").click(function(){
        formDangnhap.addClass('show_dangnhap');
        mo.addClass('mo_show');
    })
    $("#nut_register").click(function(){
        formDangky.addClass('show_dangky');
        mo.addClass('mo_show');
    })
    $(".nut_dangky_2").click(function(){
        formDangky.addClass('show_dangky');
        formDangnhap.removeClass('show_dangnhap');
    })
    $(".nut_dangnhap_2").click(function(){
        formDangky.removeClass('show_dangky');
        formDangnhap.addClass('show_dangnhap');
    })
    mo.click(function(){
        mo.removeClass('mo_show');
        formDangky.removeClass('show_dangky');
        formDangnhap.removeClass('show_dangnhap');
    });
    //Hiệu ứng scroll chuột
    var nav_coyome = $('#nav_coyome')
    $(window).scroll(function(event){
        var body = $('html, body').scrollTop();
        if(body > 20){
            nav_coyome.addClass('nav_effect');
        }
        else{
            nav_coyome.removeClass('nav_effect');
        }
    })
   
    
})