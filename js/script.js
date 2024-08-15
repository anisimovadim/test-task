var jstime = 'start';
$(document).ready(function(){
   // checkAuth(true);
    //$('input[type=tel]').mask('+79999999999');
    $('.date-type').mask('99.99.9999');
    //Кнопка отправить/готово
   /* $('#main_form input').keydown(function(e) {
        if(e.keyCode == 13){
            e.preventDefault();
            return false;
        }
    });*/

     $('select[name=spending_aim]').change(function(){
        let val = $(this).val() != 'Потребительские нужды' ? true : false;;
        if(val) {
           $('#spending_aim_else').modal('show');
           $('input[name=spending_aim_else]').val($(this).val());
        }
    });
    $('#confirm_spending_aim').click(function(){
        let value = $('input[name=spending_aim_else]').val().trim();
        if (value != ''){
            $('select[name=spending_aim] option:selected').val(value).text('Иное('+value+')');
        }
    });


    $('#main_form').submit(function(e){
        e.preventDefault();
        if(fullValidationStep1()) {
            $('#main_form .sbp-block input').prop('disabled', false);
            $('#main_form .sbp-block select').prop('disabled', false);
            //var data = $('#main_form').serialize();
            const array = $('#main_form').serializeArray(); // Encodes the set of form elements as an array of names and values.
            const json = {};
            $.each(array, function () {
                if(this.name.includes('[]')) {
                    let pureName = this.name.replace('[]','');
                    console.log(json.pureName);
                    if(typeof(json.pureName) != "undefined") {
                        json.pureName.push(this.value);
                    }
                    json[pureName] = [this.value] || "";
                } else {
                    json[this.name] = this.value || "";
                }

            });
            //return json;
            //console.log(json);
            sendData(json);
        } else {
            $('#main-modal').animate({scrollTop:0},300);
        };
    });
    $('#second_form').submit(function(e){
        e.preventDefault();
        var data = $(this).serialize();
        //console.log(data);
        if(fullValidationStep2()) {
            //console.log(data);
            sendData2(data);
        } else {
            $('#second-modal').animate({scrollTop:0},300);
        }
    });
    /*Вызов окна первого этапа*/
    $('.new-app-button').click(function(e){
        e.preventDefault();
        $('#main-modal').slideDown(200);
        $('body').addClass('modal-open');
    });
    /*Закрытие окна первого этапа*/
    $('#main-modal .closer').click(function(e){
        e.preventDefault();
        $('#main-modal').slideUp(200);
        $('body').removeClass('modal-open');
    });
    /*Закрытие окна второго этапа*/
    $('#second-modal .closer').click(function(e){
        e.preventDefault();
        $('#second-modal').removeClass('calc-mode').slideUp(200);
        $('body').removeClass('modal-open');
        MQremove();
        resetForm2();
    });
    /*Закрытие окна с документами*/
    $('#app-docks-modal .closer').click(function(e){
        e.preventDefault();
        $('#app-docks-modal').slideUp(200);
        $('body').removeClass('modal-open');
    });

    /*Закрытие окна с асп*/
    $('#asp1-modal .closer').click(function(e){
        e.preventDefault();
        $('#asp1-modal').slideUp(200);
        $('body').removeClass('modal-open');
    });
    /*Закрытие окна с асп2*/
    $('#asp2-modal .closer').click(function(e){
        e.preventDefault();
        $('#asp2-modal').slideUp(200);
        $('body').removeClass('modal-open');
    });
    $('.sms-modal .closer').click(function(e){
        e.preventDefault();
        $('.sms-modal').slideUp(200);
        $('body').removeClass('modal-open');
    });

    $('#sbp-payout-modal .closer').click(function(e){
        e.preventDefault();
        $('#sbp-payout-modal').slideUp(200);
        $('body').removeClass('modal-open');
        $('.sbp-payout-agreement-block').show();
        $('.sbp-payout-main-block').hide();
        $('#sbp-payout-form input').val('');
    });

    /*Вызов калькулятора*/
    $('.calc-button').click(function(){
        $('.logt-block').hide();
        $('#second-modal').addClass('calc-mode').slideDown(200);
        MQadd();
        $('body').addClass('modal-open');
    });

    /*Вызов меню*/
    $('.menu-icon, .main-menu li a.show-spravka').click(function() {
        $('.main-menu').slideToggle(200);
    });

    /*Проверка авторизации*/
    setInterval(function(){
        checkAuth()
    },60000);
    setInterval(function(){
        checkAuth(true)
    },300000);
});

function MQremove () {
    $('#programm option[value="МаниКло кальк-р"]').attr('hidden', true).prop('disabled', true);
}

function MQadd() {
     $('#programm option[value="МаниКло кальк-р"]').removeAttr('hidden').prop('disabled', false);
}
/*Вызов окна второго этапа*/
$(document).on('click','.go-step-2',function(e) {
    e.preventDefault();
    $('#payment_refine').modal('show');
    /*let app_id = $(this).attr('href');
    let fio = $(this).parent().parent().parent().find('.client-fio').text();
    let sbp_allowed = $(this).attr('data-sbp_allowed');
    let credit_card = $(this).attr('data-credit_card') == 'true' ? true : false;
    getLimit(app_id, fio, sbp_allowed, credit_card);*/
});
$(document).on('submit','#updateOrder', function(){
    const array = $('#updateOrder').serializeArray(); // Encodes the set of form elements as an array of names and values.
    const json = {};
    $.each(array, function () {
            json[this.name] = this.value || "";
    });
    sendUpdate(json);
});

// Отправка обновленных данных
function sendUpdate(data) {
    let json = JSON.stringify(data);
    let uuid = $('input[name=uuid]').val();
    $.ajax({
        type: 'POST',
        url: api+'/api/v1/updateOrder?'+ new Date().getTime(),
        data: {'uuid': uuid, 'data': json},
        beforeSend: function () {
            $('#updateOrder').prepend('<div class="locker">'+preloader+'</div>');
        },
        success: function (data) {
            //data = jQuery.parseJSON(data);
            var error_code = '';
            if (data.success == true) {
                location.reload();
            }
            if (data.error_code) {
                error_code = 'Код ошибки: '+data.error_code;
                showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
                $('.locker').remove();
            }
            console.log(data);
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: '+ xhr.responseText});
            return false;
        }
    });
}

/*Блокировка календаря*/
/*$(document).on('click, focus','input[type=date]', function(e) {
    e.preventDefault();
})*/


/*Подписание договора*/
/*$(document).on('click','.sign-app',function(e) {
    e.preventDefault();
    let app_id = $(this).attr('href');
    let type = $(this).attr('data-type');
    signDoc(app_id, type);
});*/

/*закрытие popup*/
$(document).on('click','#popup .closer, #popup .closepopup',function(e) {
    e.preventDefault();
    closePopup();
});

/*$(document).on('click','.show-geolist',function(e) {
    e.preventDefault();
    showGeolist();
});*/

/*Обработка селекта Должностное лицо*/
$(document).on('change', '[name=place_holder]', function () {
    var val = $(this).val();
    if (val == 'Y') {
        $('.place_holder_position').show();
        //$('.place_holder_position').val('');
    } else {
        $('.place_holder_position').hide();
        $('[name=place_holder_position]').removeClass('valid').val('');
    }
});

/*Скачивание ПФ для льготного*/
$(document).on('click', '.download-lgot-pdf', function (e) {
    e.preventDefault();
    $('#temp_form').submit();
});

function getLimit(id, fio, sbp_allowed, credit_card) {
    $.ajax({
        type: 'POST',
        url: 'user/getLimits?'+ new Date().getTime(),
        data: {"id":id},
        beforeSend: function () {
            //Чистим поля сбп
            clearFieldsSetp2();
            $('#second_form').prepend('<div class="locker">'+preloader+'</div>');
        },
        success: function (data) {
            $('.locker').remove();
            data = jQuery.parseJSON(data);
            var error_code = '';
            if (data.error_code) {
                error_code = 'Код ошибки: '+data.error_code;
            }
            console.log(data);
            if(data.sucsess == true) {
                $('input[name=current_limit]').val(data.limit);
                $('.current_limit span').text((data.limit).replace(/^\s*(\d+)(\d{3})\s*([а-я\.]+)?\s*$/, '$1 $2 $3'));
                $('input[name=app_id]').val(id);
                $('.logt-block').hide();
                //$('#r_schet input').removeClass('valid notValid');
                $('input[name=sbp_payout_status_checkbox], input[name=clearing_status_checkbox]').prop('checked',false).trigger('change');
                $('#r_schet input[name=clearing_payee_name]').val(fio).addClass('valid');
                console.log(sbp_allowed);
                //Разрешен ли сбп
                if(sbp_allowed == true || sbp_allowed == 'true') {
                    $('#second-modal').removeClass('sbp_forbidden');
                    $('#sbp_payout_status').prop('checked', true).trigger('change');
                } else {
                     $('#second-modal').addClass('sbp_forbidden');
                     $('#sbp_payout_status').prop('checked', false).trigger('change');
                }
                //разрешен ли перевод на карту
                if(credit_card) {
                    $('.bank_card_block').show();
                } else {
                    $('.bank_card_block').hide();
                }

                $('#second-modal').slideDown(200);
                $('body').addClass('modal-open');
            } else {
                showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
            }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: '+ xhr.responseText});
            return false;
        }
    });
}

function clearFieldsSetp2() {
    //Поля СБП
    $('#second-modal').removeClass('sbp_forbidden');
    $('#sbp_payout_status').prop('checked', false);
    $('#second_form input[name=sbp_phone]').val('').removeAttr('data-need').removeClass('valid notValid');
    $('#second_form input[name=sbp_bank_text_a]').val('');
    $('#second_form input[name=sbp_available]').val(0);
    $('#second_form input[name=sbp_payout_status]').val(0);
    $('#second_form select[name=sbp_bank_id_a]').val('').trigger("chosen:updated");
    $('#step-2-sbp-fields').addClass('d-none');
    //Поля р/счет
    $('#r_schet input').val('');
}

function sendData2 (data) {
    $.ajax({
        type: 'POST',
        url: 'main/sendJsonEtap2?'+ new Date().getTime(),
        data: data,
        beforeSend: function () {
            $('#second_form').prepend('<div class="locker">'+preloader+'</div>');
        },
        success: function (data) {
            data = jQuery.parseJSON(data);
            var url = '/';
            var error_code = '';
            if (data.error_code) {
                error_code = 'Код ошибки: '+data.error_code;
            }
            console.log(data);
            if(data.success == true) {
                showPopup(
                        {
                    title:'',
                    text:'Заявка успешно создана.',
                    links: [{
                        link_text:'OK',
                        link_class:'reloadapp',
                        link:  url,
                    }]
                    });
            } else {
                showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
                $('.locker').remove();
            }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: '+ xhr.responseText});
            return false;
        }
    });
}

function sendData (data) {
    let token = $('#csrf').val();
    let json = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        url: api+'/api/v2/store?'+ new Date().getTime(),
        data: {'_token': token, 'data': json},
        beforeSend: function () {
            $('#main_form').prepend('<div class="locker">'+preloader+'</div>');
        },
        success: function (data) {
            //data = jQuery.parseJSON(data);
            var url = '/';
            var error_code = '';
            if (data.error_code) {
                error_code = 'Код ошибки: '+data.error_code;
            }
            console.log(data);
            if(data.uuid) {
                $('.applist-container').empty();
                $('.applist-container').append('<div class="container"><div class="row"><div class="col-12"><div class="sub-title">Формируем документы для подписания...</div></div></div></div>');
                askAppStatus(data.uuid);
            } else {
                showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
                $('.locker').remove();
            }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: '+ xhr.responseText});
            return false;
        }
    });
}


function askAppStatus(uuid) {

    var inerval = setInterval(function() {
        $.ajax({
            type: 'GET',
            url: api+'/api/v1/getStatus?'+ new Date().getTime(),
            data: {"uuid":uuid},
            beforeSend: function () {
               // $('#asp1-modal .title').after('<div class="loading" data-loader="circle-side"></div>');
            },
            success: function (data) {
                //data = jQuery.parseJSON(data);
                var error_code = '';
                var url = '/';
                if (data.error_code) {
                    error_code = 'Код ошибки: '+data.error_code;
                }
                console.log(data);
                if(data.code == 3) {
                    clearInterval(inerval);
                    console.log();
                    let json = data.data;
                    console.log(json);
                    //$('#asp1-modal .loading').remove();
                    $('#asp1 input[name=id_app]').val(uuid);
                    $('#asp1 .docs-lines').html(buildListAsp(json,uuid));
                    $('.asp1').slideDown(200);
                    $('#asp1-modal .goback').show();
                    $('.sign-type-select').slideUp(200);
                    $('#asp1-modal').slideDown(200);
                    $('body').addClass('modal-open');
                }
            },
            error: function (xhr, str) {
                showPopup({text:'Возникла ошибка: '+ xhr.responseText});
                return false;
            }
        });
    }, 3000);

}
function signDoc(id,type) {
    $.ajax({
        type: 'POST',
        url: 'main/writeDock?'+ new Date().getTime(),
        data: {"id":id, "type":type},
        beforeSend: function () {
            /*$('#second_form').prepend('<div class="locker">'+preloader+'</div>');*/
        },
        success: function (data) {
            data = jQuery.parseJSON(data);
            var error_code = '';
            var url = '/';
            if (data.error_code) {
                error_code = 'Код ошибки: '+data.error_code;
            }
            console.log(data);
            if(data.sucess == true) {
                showPopup({text:'Спасибо, документы успешно подписаны',links: [{
                        link_text:'OK',
                        link_class:'reloadapp',
                        link:  url,
                    }]});
            } else {
                showPopup({text:'Возникла ошибка. Описание ошибки: '+data.error_msg+'<br>'+error_code});
            }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: '+ xhr.responseText});
            return false;
        }
    });
}

function checkAuth(update) {
    /*$.ajax({
        type: 'POST',
        url: 'main/get_statusAuth?'+ new Date().getTime(),
        beforeSend: function () {
        },
        success: function (data,textStatus, xhr) {
            console.log(textStatus, xhr.status);
            var url = '/';
            try {
                data = jQuery.parseJSON(data);
                //let status = data.status;
                let js_filetime = data.create_js;
                if(jstime != js_filetime && update) {
                    if(jstime == 'start') {
                        jstime = js_filetime;
                    } else {
                        console.log('Требуется обновление');
                        showPopup({
                            title: 'Страница устарела',
                            text:'Если продолжить без обновления некоторые функции могут быть недоступны',
                            links: [{
                                    link_text:'Обновить',
                                    link_class:'reloadapp',
                                    link:  url,
                                },
                                {
                                    link_text:'Отмена',
                                    link_class:'closepopup',
                                    link: '#',
                                }
                            ]
                        });
                    }
                }
            } catch (e) {
                data = false;
            }
            //data = jQuery.parseJSON(data);

            if(data == false) {
                showPopup({
                    text:'Пожалуйста авторизуйтесь',
                    links: [{
                        link_text:'OK',
                        link_class:'reloadapp',
                        link:  url,
                    }]
            });

            }
        },
        error: function (xhr, str) {
           showPopup({text:'Возникла ошибка: '+ xhr.responseText});
            return false;
        }
    });*/
}
