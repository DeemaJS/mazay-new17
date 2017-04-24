function order (e){	
    e.preventDefault();
    var order = $('#one-goods-order-form');
    $.ajax({
        type: "POST",
        url: "/cart/insert/",
        data: order.serialize(),
        dataType: "json",
        success: function(msg){
            if(msg != 0){
                if(msg.expected == 0){
                    change_cutton(msg.total_single_items, msg.cart_total);
                    $('.open-panel').html(msg.open_panel);
                }
                showModal=msg.show_modal;
                if(!showModal) {
                    $('#model-window .modal-content').html(msg.content);
                    $('#model-window').modal('show');
                }
                else toastr.success('Товар успешно добавлен в корзину')
            }
        }
    });
}

function order2 (e, id,dimension){
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/cart/insert/",
        data: {id:id,dimension:dimension},
        dataType: "json",
        success: function(msg){
            if(msg != 0){
                if(msg.expected == 0){
                    change_cutton(msg.total_single_items, msg.cart_total);
                    $('.open-panel').html(msg.open_panel);
                }
                showModal=msg.show_modal;
                if(!showModal) {
                    $('#model-window .modal-content').html(msg.content);
                    $('#model-window').modal('show');
                }
                else toastr.success('Товар успешно добавлен в корзину')
            }
        }
    });
}

function order3 (e, id, i){
    e.preventDefault();
    var table = $('#cabinet-table-goods');
    var dimension = table.find('#cabinet-tr-goods-'+i+' .cabinet-dimension').val();
    var num = table.find('#cabinet-tr-goods-'+i+' .cabinet-num').val();   
    $.ajax({
        type: "POST",
        url: "/cart/insert/",
        data: {id:id, dimension:dimension, num:num},
        dataType: "json",
        success: function(msg){
            if(msg != 0){
                if(msg.expected == 0){
                    change_cutton(msg.total_single_items, msg.cart_total);
                    $('.open-panel').html(msg.open_panel);
                }
                showModal=msg.show_modal;
                if(!showModal) {
                    $('#model-window .modal-content').html(msg.content);
                    $('#model-window').modal('show');
                }
                else toastr.success('Товар успешно добавлен в корзину')
            }
        }
    });
}

function scl(kol){
    var tovars='';
    if (kol >= 5 && kol < 21) tovars = "товаров";
    else if (kol % 10 == 1) tovars = "товар";
    else if (kol % 10 > 1 && kol % 10 < 5) tovars = "товара";
    else tovars = "товаров"; 
    return tovars; 
}
function change_cutton(kol, many){
    var html = '';
    if(kol * 1 > 0){
        html += '<p class="items">КОРЗИНА <span class="dark-clr">('+kol+')</span></p>';
        html += '<p class="dark-clr hidden-tablet">'+many+' грн</p>'; 
    }else{
        html += '<p>Сейчас в корзине пусто</p>';
    }
    $('#cartContainer .cart .change-cart').html(html);
}
function add_order(e, elem){
    e.preventDefault();
    $(elem).attr('disabled', 'disabled');
    var manager_id = $('#manager_id').val();
    if(!manager_id.length)
    {
        alert('Выберите менеджера!');
        return;
    }
    $.ajax({
        type: "POST",
        url: "/cart/add_order/",
        data: {comment:$('#order-comment').val(),manager_id:manager_id},
        dataType: "json",
        success: function(msg){
            if(msg == 0){
                alert('Ошибка');         
            }else{
                if(msg.error != undefined){
                    alert(msg.error);
                }else{
                    alert('Ваш заказ успешно отправлен. В ближайшее время менеджер свяжется с вами');
                    $('#cart-content').html('<p>Сейчас в корзине пусто</p>');
                    change_cutton(0, 0);
                    return;
                }
            }
            $(elem).removeAttr('disabled');
        }
    });		
}
function order_change(id, i){
    var table = $('#cart-table-goods');
    var dimension = table.find('#cart-tr-goods-'+i+' .cart-dimension').val();
    var old_dimension = table.find('#cart-tr-goods-'+i+' .cart-dimension').attr('data-old');
    var num = table.find('#cart-tr-goods-'+i+' .cart-num').val();
    var block_goods = $('.block-goods-'+id);
    block_goods.find('select').attr('disabled', 'disabled');
    block_goods.find('input').attr('disabled', 'disabled');
    $.ajax({
        type: "POST",
        url: "/cart/update/",
        data: {id:id, dimension:dimension, num:num, old_dimension:old_dimension},
        dataType: "json",
        success: function(msg){
            //console.log(msg);
            if(msg != 0){
                block_goods.each(function(){
                    if(dimension != old_dimension && $(this).find('select').attr('data-old') == dimension){
                        $(this).remove();
                    }
                });
                if (msg.total_single_items > 0){
                    change_cutton(msg.total_single_items, msg.cart_total);
                    table.find('#cart-tr-goods-'+i+' .subtotal').html(msg.total_single);
                    table.find('#cart-tr-goods-'+i+' .total_single_units').html(msg.total_single_units);
                    $('#cart_total_items').html(msg.cart_total);
                    table.find('#cart-tr-goods-'+i+' .cart-dimension').attr('data-old', dimension);
                    table.find('#cart-tr-goods-'+i+' .cart-num').val(msg.qty);
                }
            }
            block_goods.find('select').removeAttr('disabled');
            block_goods.find('input').removeAttr('disabled');
        }
    });        
}

/*function cart_minus_kol(id){
        $.post( "/cart/change_count/",{action:'minus',id:id}, function(msg) {
                change_cutton(msg.cart_total_items, msg.cart_total);
                cart_change_value(msg, id);
        }, 'json');			
}*/
function cart_del_goods(id, i){
    var dimension = $('#cart-table-goods').find('#cart-tr-goods-'+i+' .cart-dimension').attr('data-old');
    $.post( "/cart/del/",{id:id, dimension:dimension}, function(msg) {
        if(msg != 0){            
            if(msg.cart_total_items > 0){
                change_cutton(msg.cart_total_items, msg.cart_total);
                $('#cart-tr-goods-'+i).animate({
                    opacity: 0
                }, "swing", function() {
                    $('#cart-tr-goods-'+i).remove();
                });                
                //$('#cart-tr-goods-'+id).remove();
                $('#cart_total_items').html(msg.cart_total);
            }else{
                $('#cart-content').html('<p>Сейчас в корзине пусто</p>');
                change_cutton(msg.cart_total_items, msg.cart_total);
            }
        }
    }, 'json');			
}
function cart_del_goods_popup(id, i, dimension){
    $.post( "/cart/del/",{id:id, dimension:dimension}, function(msg) {
        if(msg != 0){
            if(msg.cart_total_items > 0){
                change_cutton(msg.cart_total_items, msg.cart_total);
                $('#div-cart-popup-'+i).animate({
                    opacity: 0
                }, "swing", function() {
                    $('#div-cart-popup-'+i).remove();
                });                
                $('#cart_popup_total').html(msg.cart_total);
            }else{
                $('.open-panel').empty();
                change_cutton(msg.cart_total_items, msg.cart_total);
            }
        }
    }, 'json');			
}
function cart_change_value(msg, id){
        $('#cart_total').html(msg.cart_total);
        $('#cart_total_items').html(msg.cart_total_items);
        $('#cart_subtotal_'+id).html(msg.subtotal);
        $('#cart_goods_kol_'+id).html(msg.count);
}

function send_commentform(s){
    var cf = $('#commentform');
    cf.find('.btn').attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/static_pages/message/",
        data: cf.serialize()+'&s='+s,
        dataType: "json",
        success: function(msg){
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            cf.find('.has-error').removeClass('has-error');
            cf.find('.help-block').remove(); 
            if(msg == '1'){
                cf.find('.btn').removeAttr('disabled');
                alert('Сообщение успешно отправлено');
                cf.trigger( 'reset' );
                return;
            }
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    cf.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        cf.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                cf.find('.btn').removeAttr('disabled');
                return;
            }
        }
    });
}
function form_callback(){
    $.post('/static_pages/form_callback/',{},function (msg) {
        if(msg != 0){
            $('#model-window-block').html(msg.content);
            $('#callModal').modal('show');
        }
    },'json');      
}
function send_callback(){
    var cf = $('#callback');
    cf.find('.btn').attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/static_pages/callback/",
        data: cf.serialize(),
        dataType: "json",
        success: function(msg){
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            cf.find('.has-error').removeClass('has-error');
            cf.find('.help-block').remove(); 
            if(msg == '1'){
                cf.find('.btn').removeAttr('disabled');
                alert('Сообщение успешно отправлено');
                cf.trigger( 'reset' );
                $('#callModal').modal('hide');
                return;
            }
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    cf.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        cf.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                cf.find('.btn').removeAttr('disabled');
                return;
            }
        }
    });
}
$('#isotopeSorting').on('change', function(elem){
    $.post('/catalog/order_by/',{'order_by':$(this).val()},function (msg) {
        window.location.reload();
    },'html');
});

function register(e, elem){
    e.preventDefault();
    var fr = $('#form-registration');
    var btn = $(elem);
    btn.attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/reg/register/",
        data: fr.serialize(),
        dataType: "json",
        success: function(msg){
            //console.log(msg);
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            fr.find('.has-error').removeClass('has-error');
            fr.find('.help-block').remove();            
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    fr.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        fr.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                btn.removeAttr('disabled');
                return;
            }
            window.location.reload();
            btn.removeAttr('disabled');
        }
    });
}
 function authorization(e, elem){
    e.preventDefault();
    var fr = $('#form-authorization');
    var btn = $(elem);
    btn.attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/reg/authorization/",
        data: fr.serialize(),
        dataType: "json",
        success: function(msg){
            //console.log(msg);
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            fr.find('.has-error').removeClass('has-error');
            fr.find('.help-block').remove();            
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    fr.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        fr.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                btn.removeAttr('disabled');
                return;
            }
            window.location.reload();
            btn.removeAttr('disabled');
        }
    });
}
function send_recovery(e, elem){
    e.preventDefault();
    var fr = $('#form-recovery');
    var btn = $(elem);
    btn.attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/reg/send_recovery/",
        data: fr.serialize(),
        dataType: "json",
        success: function(msg){
            //console.log(msg);
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            fr.find('.has-error').removeClass('has-error');
            fr.find('.help-block').remove();            
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    fr.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        fr.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                btn.removeAttr('disabled');
                return;
            }
            $('#recoveryModal .modal-body').html('Ссылка для восстановления пароля была отправлена на указанный почтовый ящик');
        }
    });
}
function recovery(e, elem){
    e.preventDefault();
    var fr = $('#form-new-pass-recovery');
    var btn = $(elem);
    btn.attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/reg/new_pass_revovery/",
        data: fr.serialize(),
        dataType: "json",
        success: function(msg){
            //console.log(msg);
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            fr.find('.has-error').removeClass('has-error');
            fr.find('.help-block').remove();            
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    fr.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        fr.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                btn.removeAttr('disabled');
                return;
            }
            btn.removeAttr('disabled');
        }
    });
}

function logout(e){
    $.ajax({
        type: "POST",
        url: "/reg/logout/",
        success: function(msg){
            if(msg == '1'){
                window.location.reload();
                return;
            }
        }
    });
}
function cabinet_calc_col(i, price){
    var table = $('#cabinet-table-goods');
    var dimension = table.find('#cabinet-tr-goods-'+i+' .cabinet-dimension option:selected').attr('data-count');
    var num = table.find('#cabinet-tr-goods-'+i+' .cabinet-num').val();  
    dimension = parseInt(dimension);
    num = parseInt(num);
    table.find('#cabinet-tr-goods-'+i+' .cabinet_subtotal').html(Math.round(dimension * num * price).toFixed(2));
    table.find('#cabinet-tr-goods-'+i+' .cabinet_amount_dimension').html(dimension * num);
}

$('#link-form-reg').on('click', function(){
    $.post('/reg/form_registration/',{},function (msg) {
        if(msg != 0){
            $('#model-window-block').html(msg.content);
            $('#registerModal').modal('show');
        }
    },'json');    
});
$('#link-form-auth').on('click', function(){
    show_form_auth();
});
function show_form_auth(){
    $.post('/reg/form_authorization/',{},function (msg) {
        if(msg != 0){
            $('#model-window-block').html(msg.content);
            $('#loginModal').modal('show');
        }
    },'json');      
}
function show_form_recovery(){
    $.post('/reg/form_recovery/',{},function (msg) {
        if(msg != 0){
            $('#model-window-block').html(msg.content);
            $('#recoveryModal').modal('show');
        }
    },'json');      
}
$('.cabinet_menu a').on('click', function(e){
    var elem = $(this);
    var page = elem.attr('data-page');
    if(elem.hasClass('active')){
        e.preventDefault();
        return;
    }
    $.post('/cabinet/'+page+'/',{},function (msg) {
        if(msg == 0){
            alert('Ошибка');
            return;
        }
        if(msg.html != undefined){
            $('#cabinet_content').html(msg.html);
            elem.parent().find('a').removeClass('active');
            elem.addClass('active');
        }    
    },'json');    
});
function expected_goods_remove(elem, id){
    var el = $(elem); 
    $.post( "/cabinet/del_expected_goods/",{id:id}, function(msg) {
        if(msg != 0){            
            el.parent().parent().animate({
                opacity: 0
            }, "swing", function() {
                el.parent().parent().remove();
            });                
        }
    }, 'json');			
}  
function change_user_data(e, elem){
    e.preventDefault();
    var fr = $('#form-cabinet-userdata');
    var btn = $(elem);
    btn.attr('disabled','disabled');
    $.ajax({
        type: "POST",
        url: "/reg/change_userdata/",
        data: fr.serialize(),
        dataType: "json",
        success: function(msg){
            //console.log(msg);
            if(msg == '0'){
                alert('Ошибка');
                return;
            }
            fr.find('.has-error').removeClass('has-error');
            fr.find('.help-block').remove();            
            if(Object.keys(msg.error).length > 0){
                var flag = 0;
                for(var key in msg.error){   
                    fr.find('[name="'+key+'"]').after('<small class="help-block">'+msg.error[key]+'</small>').parent().parent().addClass('has-error');
                    if(flag == 0){
                        fr.find('[name="'+key+'"]').focus();
                        flag = 1;
                    }
                }
                btn.removeAttr('disabled');
                return;
            }
            alert('Данные успешно обновлены');
            fr.find('[name="old_password"]').val('');
            fr.find('[name="password"]').val('');
            fr.find('[name="password2"]').val('');
            btn.removeAttr('disabled');
        }
    });
}

function DontShowModal(obj){
    var show = $(obj).prop('checked');
    $.post('/cabinet/set_show_modal/',{show:show});
}

$(document).ready(function(){
    $('.input_num_products,.price-filter input').keydown(function(event) {

        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||

            (event.keyCode == 65 && event.ctrlKey === true) ||

            (event.keyCode >= 35 && event.keyCode <= 39)) {

                 return;
        }else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });

    $('#submitprice').on('click',function(){
        var min = $('#price-min').val();
        var max = $('#price-max').val();
        if(!min.length && !max.length) return false;

        if(min.length&&max.length&&(+min>+max||+max<+min)){alert("Введите корректную цену!");return false};

        var url = window.location.href.replace(/(\/page-\d*)/g,'');
        url= url.replace(window.location.search,'');
        url+='?min='+min+'&max='+max;

        window.location.href=url;
    });
})