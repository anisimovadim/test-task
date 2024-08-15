$(document).ready(function () {
    $('select.sbp_bank_id').chosen({
        disable_search_threshold: 10,
        no_results_text: "Ничего не найдено!",
        placeholder_text_single: 'Выберите из списка',
    });
});

//телефон совпадает с основным
$(document).on('click', '.sbp_like_main_phone', function(e) {
    e.preventDefault();
    let main_phone = $('input[name=phone_mobile]');
    if(main_phone.val() != '' && !main_phone.hasClass('notValid')) {
        $('input[name=sbp_phone]').val(main_phone.val());
        addClassValid($('input[name=sbp_phone]'), true);
    }
});

//Выбор банка
$(document).on('change', 'select[name=sbp_bank_id_a]', function(e){
    let bank_id = $(this).val();
    let form = $(this).attr('data-form');
    let bank_name = $(this).find('option:selected').text();
    //console.log(form);
    if(bank_id && bank_id != '') {
        $(form+' input[name=sbp_bank_text_a]').val(bank_name);
    }
});

//галка нет СБП
$(document).on('change', '#main_form input[name=sbp_available_checkbox]', function(e){
    let checked = $(this).prop('checked');
    if(checked) {
        $('#main_form input[name=sbp_available]').val(0);
    } else {
        $('#main_form input[name=sbp_available]').val(1);
    }
    $('#main_form input[name=sbp_available]').trigger('change');
});

$(document).on('change', '#main_form input[name=sbp_available]', function(){
    let sbp_available = $(this).val() == 1 ? false : true;
    if(sbp_available) {
        $('#main_form input[name=sbp_phone]').addClass('disabled').attr('disabled', true).val('').removeClass('notValid').removeClass('valid').removeAttr('data-need');
        $('#main_form select[name=sbp_bank_id_a] option:first').attr('selected','selected');
        $('#main_form select[name=sbp_bank_id_a]').addClass('disabled').attr('disabled', true).trigger("chosen:updated");
        $('#main_form input[name=sbp_bank_text_a]').val('');
        $('#main_form .sbp_like_main_phone').hide();
    } else {
        $('#main_form input[name=sbp_phone]').removeClass('disabled').attr('disabled', false).attr('data-need',1);
        $('#main_form select[name=sbp_bank_id_a] option:first').removeAttr('selected','selected');
        $('#main_form select[name=sbp_bank_id_a]').removeClass('disabled').attr('disabled', false).trigger("chosen:updated");
        $('#main_form .sbp_like_main_phone').show();
    }
});

//галка перевод по СБП 2 этап
$(document).on('change', 'input[name=sbp_payout_status_checkbox]', function(e){
    let checked = $(this).prop('checked');
    let form = $(this).attr('data-form');
    let idApp = $('#second_form input[name=app_id]').val();
    if(checked) {
        $('input[name=clearing_status_checkbox]').prop('checked', false).trigger('change');
        $('input[name=bank_card_checkbox]').prop('checked', false).trigger('change');
        $(form+' input[name=sbp_available]').val(1);
        $(form+' input[name=sbp_payout_status]').val(1);
        $('#step-2-sbp-fields').removeClass('d-none');
        $('#step-2-bank_card-fields').addClass('d-none');
        $('#r_schet').addClass('d-none');
        $(form+' input[name=sbp_phone]').attr('data-need',1);
        $('#bank_card_number').removeAttr('data-need');
        //getSbpById(idApp);
    } else {
        //$(form+' input[name=sbp_available]').val(0);
        $(form+' input[name=sbp_payout_status]').val(0);
        $('#second_form input[name=sbp_phone]').removeAttr('data-need').removeClass('valid notValid');
        $('#step-2-sbp-fields').addClass('d-none');
    }
});
//галка перевод на р/счет 2 этап
$(document).on('change', 'input[name=clearing_status_checkbox]', function(e){
    let checked = $(this).prop('checked');
    let form = $(this).attr('data-form');
    if(checked) {
        $('input[name=sbp_payout_status_checkbox]').prop('checked', false).trigger('change');
        $('input[name=bank_card_checkbox]').prop('checked', false).trigger('change');

        $(form+' input[name=clearing_status]').val(1);
        $('#r_schet').removeClass('d-none');
        $('#step-2-sbp-fields').addClass('d-none');
        $('#step-2-bank_card-fields').addClass('d-none');
        $('#r_schet input').attr('data-need',1);
        $('input[name=clearing_status]').removeAttr('data-need');
        $('#bank_card_number').removeAttr('data-need');
        $('input[name=clearing_payee_bankbik],input[name=clearing_payee_personalacc],#r_schet input[name=inn]').trigger('change');
        if($('#r_schet input[name=clearing_payee_name]').val() != '') {
            addClassValid($('#r_schet input[name=clearing_payee_name]'), true);
        }
    } else {
        $(form+' input[name=clearing_status]').val(0);
        $('#r_schet').addClass('d-none');
        $('#r_schet input').removeAttr('data-need').removeClass('valid notValid');
    }
});
//галка перевод на карту 2 этап
$(document).on('change', 'input[name=bank_card_checkbox]', function(e){
    let checked = $(this).prop('checked');
    let form = $(this).attr('data-form');
    if(checked) {
        $('input[name=sbp_payout_status_checkbox]').prop('checked', false).trigger('change');
        $('input[name=clearing_status_checkbox]').prop('checked', false).trigger('change');
        $(form+' input[name=bank_card_payout_status]').val(1);
        $('#step-2-bank_card-fields').removeClass('d-none');
        $('#r_schet').addClass('d-none');
        $('#step-2-sbp-fields').addClass('d-none');
        $('#bank_card_number').attr('data-need',1);
        $('input[name=clearing_status]').removeAttr('data-need');
        $(form+' input[name=sbp_phone]').attr('data-need',0);

        if($('#r_schet input[name=clearing_payee_name]').val() != '') {
            addClassValid($('#r_schet input[name=clearing_payee_name]'), true);
        }
    } else {
        $(form+' input[name=bank_card_payout_status]').val(0);
        $('#step-2-bank_card-fields').addClass('d-none');
        $('#bank_card_number').removeAttr('data-need').removeClass('valid notValid').val('');
    }
});

/*Перевод средств по СБП*/
$(document).on('click', '.get-sbp-payout', function(e){
    e.preventDefault();
    let phone = $(this).attr('data-phone');
    let id_app = $(this).attr('href');
    if(!$(this).hasClass('disabled')) {
        $('#sbp-payout-modal').slideDown(200);
        $('body').addClass('modal-open');
        $('#sbp-payout-form input[name=id_app]').val(id_app);
        $('#sbp-payout-form input[name=sbp_phone]').val(phone);
    }
});

$(document).on('click', '.accept-sbp-agreement', function(e) {
   let id_app = $('input[name=uuid]').val();
   let phone = $('#sbp-payout-form input[name=sbp_phone]').val();
   if(id_app !='') {
       $.ajax({
            type: 'GET',
            url: api+'/api/v1/SbpPay?'+ new Date().getTime(),
            data: {"uuid":id_app},
            beforeSend: function () {
                $('.sbp-payout-agreement-block').prepend('<div class="locker">'+preloader+'</div>');
            },
            success: function (data) {
                $('.sbp-payout-agreement-block .locker').remove();
                //data = jQuery.parseJSON(data);
                var error_code = '';
                if (data.error_code) {
                    error_code = 'Код ошибки: '+data.error_code;
                }
                console.log(data);
                if(data.error == true) {
                    showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
                } else if (data.success == true) {
                    $('#sbp-payout-form .client-phone').text(phone);
                    $('.sbp-payout-agreement-block').hide();
                    $('.sbp-payout-main-block').slideDown(200);
                }
            },
            error: function (xhr, str) {
                $('.sbp-payout-agreement-block .locker').remove();
                showPopup({text:'Возникла ошибка: '+ xhr.responseText});
                return false;
            }
        });
    }
});

$(document).on('input', 'input[name=sbp_pay]', function(){
   let val = $(this).val();
   if(val.length == 4) {
       $('.sbp-payout-button').removeClass('disabled').removeAttr('disabled');
   } else {
       $('.sbp-payout-button').addClass('disabled').attr('disabled', true);
   }
});

$(document).on('click', '.sbp-payout-button', function(e) {
   e.preventDefault();
   checkSBPCodes($('#sbp-payout-form'));
});

function checkSBPCodes(form) {
    let id_app = $('input[name=uuid]').val();
    let data = createArrayCodes(form);
     console.log(data);
    $.ajax({
        type: 'POST',
        url: api+'/api/v1/checkSignPayment?'+ new Date().getTime(),
        data: {'uuid': id_app, 'codes': JSON.stringify(data)},
        beforeSend: function () {
            form.find('button').addClass('disabled').text('Ожидайте');
        },
        success: function (data) {
            form.find('button').removeClass('disabled').text('Отправить');
            let json = data;
            let url = '/';
            //console.log(json);
            if(json.error == true) {
                showPopup({text:json.error_msg});
            } else if (json.success == true) {
                location.reload();
            } else {
                let errors = 0;
                $.each(json, function(key, value){
                    if(value.error || value.status != 3) {
                        addClassValid(form.find('input[name='+key+']'),false);
                        errors++;
                    }
                });
                if(errors > 0) {
                    showPopup({text:'Неверный код подтверждения.'});
                } else {
                    let text = 'Запрос на перевод клиенту выполнен успешно.';

                }
            }
        },
        error: function (xhr, str) {
            form.find('button').removeClass('disabled').text('Подписать');
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}


function getSbpById(id){
    if($('#second_form input[name=sbp_phone]').val() == '' && $('#second_form select[name=sbp_bank_id_a]').val() == '' || $('#second_form input[name=sbp_bank_text_a]').val() == '') {
        $.ajax({
            type: 'POST',
            url: 'main/getSBP1etap?'+ new Date().getTime(),
            data: {"idApp":id},
            beforeSend: function () {
                /*$('#second_form').prepend('<div class="locker">'+preloader+'</div>');*/
            },
            success: function (data) {
                data = jQuery.parseJSON(data);
                /*var error_code = '';
                if (data.error_code) {
                    error_code = 'Код ошибки: '+data.error_code;
                }*/
                console.log(data);
                if(data.error_msg) {
                   // showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
                } else if (data.success == true) {
                    $('#second_form input[name=sbp_bank_text_a]').val(data.sbp_bank_text_a);
                    $('#second_form input[name=sbp_phone]').val(data.sbp_phone);
                    $('#second_form select[name=sbp_bank_id_a] option[value='+data.sbp_bank_id_a+']').prop('selected', true);
                    $('#second_form input[name=sbp_bank_text_a]').val(data.sbp_bank_text_a);
                    $('#second_form select[name=sbp_bank_id_a]').trigger("chosen:updated");
                    if(data.sbp_phone != '') {
                        addClassValid($('#second_form input[name=sbp_phone]'), true);
                    }
                }
            },
            error: function (xhr, str) {
                showPopup({text:'Возникла ошибка: '+ xhr.responseText});
                return false;
            }
        });
    }
}
