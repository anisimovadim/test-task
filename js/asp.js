const api = 'https://c2b.aptnn.ru'
/*Все что связано с подписанием*/
//Открытие модалки с асп
function showAspModal (id, stage, clientPhone) {
    if(stage != 2) {
        $('#asp1-modal a').attr('href',id); //Пока костыль, продумать как подставлять id
        $('#asp1 .client-phone').text(clientPhone);
        $('#confirm-phone .client-phone').text(clientPhone);
        $('.asp1, .confirm-phone').hide();
        //$('#asp1-modal .goback').hide();
        //$('.sign-type-select').show();

        $('#asp1-modal').slideDown(200);
        $('body').addClass('modal-open');
        aspInit(id);
    } else {
        $('#asp2 .client-phone').text(clientPhone);
        $('#asp2-modal').slideDown(200);
        asp2Init(id);
        $('#asp2-modal a').attr('href',id); //Пока костыль, продумать как подставлять id
    }
}
//Обработчик кнопок "подписать"
$(document).on('click', '#asp1 .default-sign-type', function(e){
    e.preventDefault();
    let type = $(this).attr('data-type');
    let id = $(this).attr('href');
    confirmPhoneInit(id, type);
    /*
    $('.asp1, .confirm-phone').hide();
    type == 'asp1' ? aspInit(id) : confirmPhoneInit(id);*/
});

//Обработчик полей ввода кодов
$(document).on('input', '.docs-lines .sms-code input', function(){
    $(this).removeClass('notValid');
    let parent = $(this).parent().parent().parent().parent();
    checkAspFields(parent) ? parent.find('button').prop('disabled', false).removeClass('disabled') : parent.find('button').prop('disabled', true).addClass('disabled');
});

//Обработчик ввода идентификатора
$(document).on('input', 'input[name=code]', function(){
    let code = $(this).val();
    let parent = $(this).parent().parent().parent().parent();
    let id_app = parent.find('input[name=id_app]').val();
    let jur = $(this).attr('data-jur');
    code.length == 5 ? getCodesById(id_app,code,jur, parent) : '';
    //checkAspFields() ? $('#asp1 button').prop('disabled', false).removeClass('disabled') : $('#asp1 button').prop('disabled', true).addClass('disabled');
});

//Проверка код подтверждения номера телефона
$(document).on('input', 'input[name=checkPhone]', function(){
    let code = $(this).val();
    let parent = $(this).parent().parent().parent();
    let id_app = parent.find('input[name=id_app]').val();
    code.length == 5 ? $('#confirm-phone button').prop('disabled',false).removeClass('disabled') : $('#confirm-phone button').prop('disabled',true).addClass('disabled');;
    //let jur = $(this).attr('data-jur');
    //code.length == 4 ? checkConfirmCodes(parent) : '';
    //checkAspFields() ? $('#asp1 button').prop('disabled', false).removeClass('disabled') : $('#asp1 button').prop('disabled', true).addClass('disabled');
});

//Отправка кодов на проверку
$(document).on('submit', '#asp1, #asp2', function(e){
    e.preventDefault();
    checkAspCodes($(this));
});

//Подписание вручную 1-й этап
$(document).on('submit', '#confirm-phone', function(e){
    e.preventDefault();
    let id_app = $(this).find('input[name=id_app]').val();
    checkConfirmCodes($(this))
});



//Подписано вручную 1й этап разблокируем кнопку
$(document).on('click','.continue-timeout', function(e) {
    e.preventDefault();
    $('.confirm-phone .doc-line').addClass('d-none');
    $('.confirm-phone .doc-line input').prop('disabled',true).addClass('disabled').val('');
    $('#confirm-phone button').prop('disabled',false).removeClass('disabled');
})

//Подписано вручную 2-й этап
$(document).on('click','.sign-contact-by-hand', function(e){
    e.preventDefault();
    let app_id = $(this).attr('href');
    signByHand(app_id);
});

//раскрывающаяся инвтрукция для ручного подписания асп-2
$('#noAspLink').click(function(e){
    e.preventDefault();
    $('.no-asp-block').slideToggle(200);
});



//Инициализация АСП (отправка смс и генерация полей для подписи)
function aspInit(id) {
    $.ajax({
        type: 'POST',
        url: 'asptransport/sendSms?'+ new Date().getTime(),
        data: {id_app: id},
        beforeSend: function () {
            $('#asp1-modal .title').after('<div class="loading" data-loader="circle-side"></div>');
        },
        success: function (data) {
            $('#asp1-modal .loading').remove();
            let json = $.parseJSON(data);
            console.log(json);
            $('#asp1 input[name=id_app]').val(id);
            $('#asp1 .docs-lines').html(buildListAsp(json,id));
            $('.asp1').slideDown(200);
            $('#asp1-modal .goback').show();
            $('.sign-type-select').slideUp(200);
            $('.client-phone')
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}
//Подтверждение номера без АСП
function phoneConfirm(id, type) {
    $.ajax({
        type: 'POST',
        url: 'asptransport/sendSms?'+ new Date().getTime(),
        data: {id_app: id, type: type},
        beforeSend: function () {
        },
        success: function (data) {
            let json = $.parseJSON(data);
            console.log(json);
            /*$('#asp1 input[name=id_app]').val(id);
            $('#asp1 .docs-lines').html(buildListAsp(json,id));
            $('.asp1').slideDown(200);
            $('#asp1-modal .goback').show();
            $('.sign-type-select').slideUp(200);*/
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

//Инициализация АСП-2 (отправка смс и генерация полей для подписи)
function asp2Init(id) {
    $.ajax({
        type: 'GET',
        url: api+'/api/v1/signDocs?'+ new Date().getTime(),
        data: {uuid: id},
        beforeSend: function () {
            $('.asp2').removeClass('no-asp').hide();
            $('#asp2-modal .title').after('<div class="loading" data-loader="circle-side"></div>');
        },
        success: function (data) {
            //let json = $.parseJSON(data);
            let json = data;
            if(json.sms_no_send) {
                $('.asp2').addClass('no-asp');
            }
            $('#asp2-modal .loading').remove();
            $('.asp2').slideDown(200);
            console.log(json);
            $('#asp2 input[name=id_app]').val(id);
            $('#asp2 .docs-wrapper').html(buildListAsp2(json.type,id));
            $('body').addClass('modal-open');
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

//бумажное подписание
function confirmPhoneInit(id, type) {
    $('.continue-timeout').hide();
    $('#confirm-phone input[name=id_app]').val(id);
    $('.asp1').slideUp(200);
    $('.confirm-phone .docs-lines').html('<div class="doc-line"><a href="#" data-type="checkPhone" class="get-pdf">Код подтверждения: </a><input name="checkPhone" type="text" maxlength="4"></div>');
    $('.confirm-phone').slideDown(200);
    setTimeout(function(){
        $('.continue-timeout').show(200);
    },30000);
    phoneConfirm(id, type);
   // $('#asp1-modal .goback').show();
    //$('.sign-type-select').slideUp(200);
}

//Генерация списка полей для подписи 1-й этап
function buildListAsp(json,id) {
    console.log(json);
    let html = '';
    let annul = false;
    $.each(json,function(key, value) {
        let type;
        switch(value.type) {
        case 'Lsp_PD':
            type = 'LSP';
        break;
        case 'bkr':
            type = 'BKR';
        break;
        case 'bki':
            type = 'OPD';
        break;
        case 'cancelApp':
            type = 'Код подтверждения';
            annul = true;
        break;
        default: type = value.type;
    }
    if(type == 'LSP') {
        html = '<div class="doc-line sms-code"><a href="'+id+'" data-type="'+value.type+'" class="get-pdf">'+type+':</a><input type="text" name="'+value.type+'" maxlength="4"></div>'+html;
    } else {
        html += '<div class="doc-line sms-code"><a href="'+id+'" data-type="'+value.type+'" class="get-pdf">'+type+':</a><input type="text" name="'+value.type+'" maxlength="4"></div>';
    }
    });
    if(!annul) {
        html += '<div class="doc-line"><span>ID:</span><input type="text" data-jur="МКК" name="code" maxlength="5"></div>';
    }
    return html;
}

//Генерация списка полей для подписи 2-й этап
function buildListAsp2(json,id) {
    let html = '';
    let html_mkk = '';
    let html_agk = '';
    let html_kag = '';
    $.each(json,function(key, value) {
        let type;
        let jur;
        switch(value) {
        case 'sms_mkk':
            type = 'SMS';
            jur = 'МКК';
        break;
        case 'rat_mkk':
            type = 'RAT';
            jur = 'МКК';
        break;
        case 'iugp_mkk':
            type = 'IGP';
            jur = 'МКК';
        break;
        case 'pnp_mkk':
            type = 'PNP';
            jur = 'МКК';
        break;
        case 'ins_mkk':
            type = 'INS';
            jur = 'МКК';
        break;
        case 'app_mkk': //?
            type = 'ZNZ';
            jur = 'МКК';
        break;
        case 'app_agk':
            type = 'AAP';
            jur = 'АГК';
        break;
        case 'asp_pd_agk':
            type = 'TCA';
            jur = 'АГК';
        break;
        case 'asp_pd_kag':
            type = 'TCK';
            jur = 'КАГ';
        break;
        case 'contract_kag':
            type = 'KCT';
            jur = 'КАГ';
        break;
        default: type = value.type;
    }
    if (jur == 'МКК') {
        html_mkk += '<div class="doc-line sms-code"><a href="'+id+'" data-type="'+value+'" class="get-pdf">'+type+':</a><input type="text" name="'+value+'" maxlength="4"></div>';
    }
    if (jur == 'АГК') {
        html_agk += '<div class="doc-line sms-code"><a href="'+id+'" data-type="'+value+'" class="get-pdf">'+type+':</a><input type="text" name="'+value+'" maxlength="4"></div>';
    }
    if (jur == 'КАГ') {
        html_kag += '<div class="doc-line sms-code"><a href="'+id+'" data-type="'+value+'" class="get-pdf">'+type+':</a><input type="text" name="'+value+'" maxlength="4"></div>';
    }
    });
    if (html_mkk != '') {
        html_mkk += '<div class="doc-line id-line"><span>ID:</span><input data-jur="МКК" type="text" name="code" maxlength="6"></div>';
        html_mkk = '<div class="docs-title">Документы МКК:</div><div class="docs-lines" id="docs_mkk">'+html_mkk+'</div>';
    }
    if (html_agk != '') {
        html_agk += '<div class="doc-line id-line"><span>ID:</span><input data-jur="АГК" type="text" name="code" maxlength="6"></div>';
        html_agk = '<div class="docs-title">Документы АГК:</div><div class="docs-lines" id="docs_mkk">'+html_agk+'</div>';
    }
    if (html_kag != '') {
        html_kag += '<div class="doc-line id-line"><span>ID:</span><input data-jur="БАВ" type="text" name="code" maxlength="6"></div>';
        html_kag = '<div class="docs-title">Документы БАВ:</div><div class="docs-lines" id="docs_mkk">'+html_kag+'</div>';
    }
    html = html_agk+html_kag+html_mkk;

    return html;
}

//Проверка заполненности кодов
function checkAspFields(wrapper) {
    let total_codes = 0;
    let total_fields = 0;
    wrapper.find('.docs-lines .sms-code input').each(function(){
        total_fields++;
        let code = $(this).val();
        code.length == 4 ? total_codes++ : '';
    });
    console.log(total_codes,total_fields);
    if (total_codes == total_fields && total_codes != 0) {
        return true;
    } else {
        return false;
    }
}

function createArrayCodes(form) {
    let data = [];
     form.find('input[type=text]').each(function(){
         let arr = {};
         let key = $(this).attr('name');
         let val = $(this).val();
         //key != 'code' ? arr = {'type':key,'code':val} : '';
         if(key != 'code') {
            arr = {[key]:val};
            data.push(arr);
         }

     });
     return data;
}
function checkAspCodes(form,annul) {
    let id_app = form.find('input[name=id_app]').val();
    let data = JSON.stringify(createArrayCodes(form));
    // console.log(data);
    let api_url = api+'/api/v1/checkSignByCodes?'+ new Date().getTime();
    if (form.attr('id') == 'asp1') {
        api_url = api+'/api/v1/checkSignByCodes?'+ new Date().getTime();
    } else {
        api_url = api+'/api/v1/checkSignContract?'+ new Date().getTime()
    }

    //checkSignContract
    $.ajax({
        type: 'POST',
        url: api_url,
        data: {'uuid': id_app, 'codes': data},
        beforeSend: function () {
            form.find('button').addClass('disabled').text('Ожидайте');
        },
        success: function (data) {
            form.find('button').removeClass('disabled').text('Подписать');
            let json = data;
            let url = '/';
            //console.log(json);
            if(json.error == true) {
                showPopup({text:json.error_msg});
            } else if (json.success == true) {
                if(json.link) {
                    //console.log(json);
                    window.location.href = json.link;
                } else {
                    location.reload();
                }
            }   else {
                let errors = 0;
                $.each(json, function(key, value){
                    if(value.error || value.status != 3) {
                        addClassValid(form.find('input[name='+key+']'),false);
                        errors++;
                    }
                });
                if(errors > 0) {
                    showPopup({text:'Неверный код подтверждения.'});
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


function checkConfirmCodes(form) {
    let id_app = form.find('input[name=id_app]').val();
    let data = [];
    let disabledCode = false; //Подписание с подтверждением номера или без
     form.find('input[type=text]').each(function(){
         let arr = {};
         let key = $(this).attr('name');
         let val = $(this).val();
         $(this).hasClass('disabled') ? disabledCode = true : disabledCode = false;
         key != 'code' ? arr = {'type':key,'code':val} : '';
         data.push(arr);
     });
     console.log(data);
    $.ajax({
        type: 'POST',
        url: api+'/api/v1/checkSignByCodes?'+ new Date().getTime(),
        data: {'uuid': id_app, 'data': data},
        beforeSend: function () {
            form.find('button').addClass('disabled').text('Ожидайте');
        },
        success: function (data) {
            form.find('button').removeClass('disabled').text('Подписать');
            let json = $.parseJSON(data);
            let url = '/';
            //console.log(json);
            if(json.error == true) {
                showPopup({text:json.error_msg});
            } else {
                let errors = 0;
                $.each(json, function(key, value){
                    if(value.error || value.status != 3) {
                        addClassValid(form.find('input[name='+key+']'),false);
                        errors++;
                    } else {
                        addClassValid(form.find('input[name='+key+']'),true);
                    }
                });
                if(errors > 0 && !disabledCode) {
                    //$('#confirm-phone button').prop('disabled',true).addClass('disabled');
                    showPopup({text:'Неверный код подтверждения.'});
                } else {
                    AspFree(id_app);
                    //$('#confirm-phone button').prop('disabled',false).removeClass('disabled');
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

function getCodesById (id_app,code,jur,parent) {
    $.ajax({
        type: 'POST',
        url: api+'/api/v1/checkSignByProtect?'+ new Date().getTime(),
        data: {'uuid': id_app, 'id': code},
        beforeSend: function () {
        },
        success: function (data) {
            let json = data;
            $.each(json,function(key, value) {
                $('input[name='+value.type+']').val(value.code).trigger('input');
            });
            checkAspFields(parent);
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

function signByHand (id_app) {
    $.ajax({
        type: 'POST',
        url: 'main/heandWrite?'+ new Date().getTime(),
        data: {'id_app': id_app},
        beforeSend: function () {
        },
        success: function (data) {
            let json = $.parseJSON(data);
            let url = '/';
            if(json.succes == true) {
                showPopup(
                        {
                    title:'',
                    text:'Договор подписан вручную.',
                    links: [{
                        link_text:'OK',
                        link_class:'reloadapp',
                        link:  url,
                    }]
                    });
            } else {
                showPopup(
                        {
                    title:'',
                    text:'Произошла ошибка пробробуйте еще раз.',
                    });
            }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}


function AspFree (id_app) {
    $.ajax({
        type: 'POST',
        url: 'main/writeApp1etap?'+ new Date().getTime(),
        data: {'id_app': id_app},
        beforeSend: function () {
        },
        success: function (data) {
            let json = $.parseJSON(data);
            let url = '/';
            if(json.succes == true) {
                showPopup(
                        {
                    title:'',
                    text:'Заявка подписана вручную.',
                    links: [{
                        link_text:'OK',
                        link_class:'reloadapp',
                        link:  url,
                    }]
                    });
            } else {
                showPopup(
                        {
                    title:'',
                    text:'Произошла ошибка пробробуйте еще раз.',
                    });
            }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}
