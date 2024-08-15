function phoneValidation() {
}

function emailValidation() {
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function fullYear(data,days,months) {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(data)) {
        var bDay = data.match(/^\d{2}/)[0];
        var bMonth = data.match(/\.\d{2}\./)[0].replace(/\./g, '') - 1;
        var bYear = data.match(/\d{4}$/)[0];
        var today = new Date();
        if(days) {
            today.setDate(today.getDate() + days);
        }
        if(months && months > 0) {
            today.setMonth(today.getMonth() + parseInt(months));
            //today.setDate(date.getDate() - 1);
            //console.log(today);
        }
        if (new Date(bYear, bMonth, bDay)) {
            var r = (today.getFullYear() - bYear - ((today.getMonth() - bMonth || today.getDate() - bDay) < 0));
            //console.log(r+' полных лет')
            return (r);
        } else {
            console.log('Не существует такой даты!');
            return false;
        }
    } else {
        console.log('Ошибка дата не в том формате!')
        return false;
    }
}
        //разность двух дат в годах
function dateDistYear(data1, data2) {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(data1) && /^\d{2}\.\d{2}\.\d{4}$/.test(data2)) {
        var day1 = data1.match(/^\d{2}/)[0];
        var month1 = data1.match(/\.\d{2}\./)[0].replace(/\./g, '') - 1;
        var year1 = data1.match(/\d{4}$/)[0];
        var day2 = data2.match(/^\d{2}/)[0];
        var month2 = data2.match(/\.\d{2}\./)[0].replace(/\./g, '') - 1;
        var year2 = data2.match(/\d{4}$/)[0];
        if (new Date(year1, month1, day1) && new Date(year2, month2, day2)) {
            var r = (year2 - year1 - ((month2 - month1 ||day2  - day2) < 0));
            return (r);

        } else {
            console.log('Не существует такой даты!');
            return false;
        }
    }
    else {
        console.log('Ошибка дата не в том формате!')
        return false;
    }
}
//проверка на ребенка
function isChildren(date){
    if (fullYear(date)<=17 )
    {
        return true;
    }
}

//Проверка на пасспорт
function havePassport(date){
    if (fullYear(date)>=14 )
    {
        return true;
    }
}
//Проверка паспорта на дату выдачи
function passportCheck(bd, pg) {
    var bithday = bd;
    var passGet = pg;
    var bith = fullYear(bithday);
    var passBith = dateDistYear(bithday, passGet);
    if(checkMaxDate(dataFormat(bd)) == false || checkMaxDate(dataFormat(pg)) == false) {
        return false;
    } else {
        if (bith >= 14 && bith <= 20 && (passBith<14 || passBith>20))
        {
            return false;
        }
        else if (bith >= 20 && bith <= 45 && (passBith<20 || passBith>45)) {
            return false;
        }
        else if (bith >= 45 && passBith<45) {
            return false;
        }
        else {
            return true;
        }
    }
}




var preloader = '<div class="preloader" data-loader="circle-side"></div>';
$(document).ready(function(){
    //Вкладка дополнительная информация
    $('.more-info').click(function(e){
        e.preventDefault();
        $(this).toggleClass('active');
        $('.more-info-block').slideToggle(300);
    });
    
    //Анимация окна авторизации
    $('.auth-modal').addClass('visible');
    
    /*закрытие баннера*/
    $('.close_msg').click(function(){
        $('.messege-block').slideUp(200);
    });
    
    //Анимация справок
    $('.show-spravka').click(function(e){
        e.preventDefault();
        showPopup({
            'title': 'Справка о доходах',
            'text': '<div class="files-block">\n\
                    <a href="/files/2-ndfl.pdf" target="_blank" class="file-ico">2 НДФЛ</a>\n\
                    <a href="/files/gosuslugi.pdf" target="_blank" class="file-ico">Справка Госуслуги</a>\n\
                    <a href="/files/faq.pdf" target="_blank" class="file-ico">Инструкция</a>\n\
                    <a href="/files/free_form.pdf" target="_blank" class="file-ico">Наша форма</a>\n\
                    <a href="/files/samozan.pdf" target="_blank" class="file-ico">Самозанятые</a></div>'
        });
    });
    
});

var api = 'https://c2b.aptnn.ru'
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
    var type = $(this).attr('data-type');
    var id = $(this).attr('href');
    confirmPhoneInit(id, type);
    /*
    $('.asp1, .confirm-phone').hide();
    type == 'asp1' ? aspInit(id) : confirmPhoneInit(id);*/
});

//Обработчик полей ввода кодов
$(document).on('input', '.docs-lines .sms-code input', function(){
    $(this).removeClass('notValid');
    var parent = $(this).parent().parent().parent().parent();
    checkAspFields(parent) ? parent.find('button').prop('disabled', false).removeClass('disabled') : parent.find('button').prop('disabled', true).addClass('disabled');
});

//Обработчик ввода идентификатора
$(document).on('input', 'input[name=code]', function(){
    var code = $(this).val();
    var parent = $(this).parent().parent().parent().parent();
    var id_app = parent.find('input[name=id_app]').val();
    var jur = $(this).attr('data-jur');
    code.length == 5 ? getCodesById(id_app,code,jur, parent) : '';
    //checkAspFields() ? $('#asp1 button').prop('disabled', false).removeClass('disabled') : $('#asp1 button').prop('disabled', true).addClass('disabled');
});

//Проверка код подтверждения номера телефона
$(document).on('input', 'input[name=checkPhone]', function(){
    var code = $(this).val();
    var parent = $(this).parent().parent().parent();
    var id_app = parent.find('input[name=id_app]').val();
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
    var id_app = $(this).find('input[name=id_app]').val();
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
    var app_id = $(this).attr('href');
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
            var json = $.parseJSON(data);
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
            var json = $.parseJSON(data);
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
            var json = data;
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
    var html = '';
    var annul = false;
    $.each(json,function(key, value) {
        var type;
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
    var html = '';
    var html_mkk = '';
    var html_agk = '';
    var html_kag = '';
    $.each(json,function(key, value) {
        var type;
        var jur;
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
    var total_codes = 0;
    var total_fields = 0;
    wrapper.find('.docs-lines .sms-code input').each(function(){
        total_fields++;
        var code = $(this).val();
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
    var data = [];
     form.find('input[type=text]').each(function(){
         var arr = {};
         var key = $(this).attr('name');
         var val = $(this).val();
         //key != 'code' ? arr = {'type':key,'code':val} : '';
         if(key != 'code') {
            arr = {};
            arr[key] = val;
            data.push(arr);
         }

     });
     return data;
}
function checkAspCodes(form,annul) {
    var id_app = form.find('input[name=id_app]').val();
    var data = JSON.stringify(createArrayCodes(form));
    // console.log(data);
    var api_url = api+'/api/v1/checkSignByCodes?'+ new Date().getTime();
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
            var json = data;
            var url = '/';
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
                var errors = 0;
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
    var id_app = form.find('input[name=id_app]').val();
    var data = [];
    var disabledCode = false; //Подписание с подтверждением номера или без
     form.find('input[type=text]').each(function(){
         var arr = {};
         var key = $(this).attr('name');
         var val = $(this).val();
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
            var json = $.parseJSON(data);
            var url = '/';
            //console.log(json);
            if(json.error == true) {
                showPopup({text:json.error_msg});
            } else {
                var errors = 0;
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
            var json = data;
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
            var json = $.parseJSON(data);
            var url = '/';
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
            var json = $.parseJSON(data);
            var url = '/';
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

var dadata_token ='0000000000000000000000000000000000';




/* 
Все расчеты
 */
function mainCalc(correct_margin) {
    var goods_summ = parseFloat($('input[name=summ]').val()); // сумма товара
    goods_summ = goods_summ ? goods_summ : 0; //если сумма не указано, то 0
    var rassrochka = $('input[name=partner_installment]').prop('checked'); //галка рассрочка
    var ins_k_summ = 0; //сумма кредитных страховок
    var discount_val = $('#discount').val();  //скидка
    var ins_nk_summ = parseFloat($('[name=summ_sured]').val()); //сумма не кредитных страховок
    var dogovor; // сумма договора
    var programm; // программа
    var overpayment; //переплата
    var chgps; //чгпс
    var margin = correct_margin ? correct_margin : $('#margin').val(); //наценка
    var avans = parseFloat($('select[name=avans]').val()); //аванс
    var months = $('select[name=months]').val(); //количество месяцев
    var proc2client = $('input[name=proc2client]').val(); //Параметр из базы (пока что всегда = 0)
    var xch = (margin / 100) + 1; //наценка в виде дроби для удобства расчета
    var monthly_pay; //ежемесячный платеж
    var p_dis_source = $('#partner_discount').val(); //Скидка от партнера
    var p_dis = $('#partner_discount_temp').val(); //Скидка от партнера
    var isPreferentialProgramm = $('#isPreferentialProgramm').val() > 0;
    var avans_rub = avans && avans != 0 ? parseFloat(((goods_summ * avans) / 100).toFixed(2)) : 0;
    if(!$('#avans_to_partner').attr('readonly')) {
        avans_rub = $('#avans_to_partner').val();
    }
    var sms_summ = $('#sms_inform').prop('checked') ? parseFloat($('#sms_inform').attr('data-price')) : 0; //сумма смс
    $('#sms_summ').val(sms_summ);
    var summa_zaim;
    //Считаем сумма некредитных страховок и переплату по ним
    var instDogovor = parseFloat((ins_nk_summ * xch).toFixed(2));
    var overInst = parseFloat((instDogovor - ins_nk_summ).toFixed(2));
    
    //console.log('rassrochka='+rassrochka,'isPreferentialProgramm='+isPreferentialProgramm);
    
    //рассчеты без рассрочки
    //ins_k_summ = months == 0 ? 0 : parseFloat((goods_summ / 100 * (months * (insCalc()))).toFixed(2)); //расчет суммы некредитных страховок
    if(rassrochka == false || isPreferentialProgramm) {
        p_dis_source != 0 ? $('#partner_discount_pre').show().find('span').text(parseFloat(p_dis_source).toFixed(2)+'%') : $('#partner_discount_pre').hide();
        $('input[name=partner_discount_temp').val(p_dis_source);
       // var summa_zaim = goods_summ + ins_k_summ + ins_nk_summ; //временно, сумма займа = сумма товара + все страховки
        //avans_rub = avans && avans != 0 ? summa_zaim*(avans/100) : 0; //размер аванса в рублях
        summa_zaim = ((goods_summ * (1 - discount_val / 100).toFixed(2)) - avans_rub);
        ins_k_summ = months == 0 ? 0 : parseFloat((summa_zaim / 100 * (months * (insCalc()))).toFixed(2)); //расчет суммы некредитных страховок
        //console.log(goods_summ, discount_val, avans_rub,'Сумма займа='+summa_zaim);
        // Расчет льготных программ
        if (p_dis_source > 0 && rassrochka) {
            
            var partnerDiscountCalc = goods_summ / 100 * p_dis_source;
            summa_zaim = summa_zaim - partnerDiscountCalc ;
           // console.log('Сумма займа='+summa_zaim,partnerDiscountCalc);
        }
        //Подставляем значение для валидации суммы займа без доп. продуктов
        $('input[name=summa_zaim_for_validate').val(summa_zaim);
        
        //К сумме займа прибавляем сумму кредитных страховок и смс
        summa_zaim += ins_k_summ;
        summa_zaim += parseFloat(sms_summ);
        summa_zaim += parseFloat(ins_nk_summ);
 
        dogovor = parseFloat(((summa_zaim-ins_nk_summ) * xch).toFixed(2)) + instDogovor; //расчет суммы договора 
        monthly_pay = months == 0 ? 0 : (((((dogovor) / months) * 100).toFixed(2)) / 100); //расчет ежемесячного платежа если указано кол-во месяцев
        overpayment = (((dogovor - summa_zaim - (goods_summ * discount_val / 100)) * 100).toFixed(2)) / 100; //расчет переплаты
    } else {
        //рассчеты с рассрочкой
        dogovor = (((goods_summ * (1 + proc2client * months) - avans_rub) * 100).toFixed(2)) / 100;
        var zaim = parseFloat((dogovor / xch).toFixed(2));
        if(insCalc() != 0) {
            ins_k_summ = months == 0 ? 0 : parseFloat((zaim / 100 * (months * (insCalc()))).toFixed(2)); //расчет суммы некредитных страховок
        }
        //Подставляем значение для валидации суммы займа без доп. продуктов
        $('input[name=summa_zaim_for_validate').val(zaim);
        
        summa_zaim = zaim + ins_k_summ;        
        p_dis = (((((goods_summ - avans_rub - zaim) / goods_summ) * 10000).toFixed(2)) / 100).toFixed(2);// Процент скидки от партнера
        
        summa_zaim += parseFloat(ins_nk_summ);
        summa_zaim += parseFloat(sms_summ);
        
        dogovor = parseFloat(((summa_zaim-ins_nk_summ) * xch).toFixed(2));
        dogovor += instDogovor;
        
        overpayment = (((dogovor - summa_zaim - (goods_summ * p_dis / 100)) * 100).toFixed(2)) / 100; //расчет переплаты
        overpayment < 0 ? overpayment = 0 : overpayment = overpayment;
        
        monthly_pay = months == 0 ? 0 : (((((dogovor) / months) * 100).toFixed(2)) / 100); //расчет ежемесячного платежа если указано кол-во месяцев
        console.log(p_dis);
        p_dis != 0 ? $('#partner_discount_pre').show().find('span').text(parseFloat(p_dis).toFixed(2)+'%') : $('#partner_discount_pre').hide();
        //console.log('dogovor='+dogovor,'zaim='+zaim,'summa_zaim='+summa_zaim,'goods_summ='+goods_summ,'p_dis='+p_dis);
        $('input[name=partner_discount').val(p_dis);
    }   
            
    /*Подстановка значений*/
    $('[name=monthly_installment]').val(Math.round(monthly_pay));
    $('input[name=summa_zaim]').val(Math.round(summa_zaim));
    $('input[name=overpayment]').val(Math.round(overpayment));
    $('input[name=summa_dogovor]').val(Math.round(dogovor));
    $('input[name=avans_to_partner').val(Math.round(avans_rub));
    //$('input[name=partner_discount').val();
    
    //Итоговые суммы для информации с разделением на разряды
    $('#googs_pre span').text((goods_summ+' руб.').replace(/^\s*(\d+)(\d{3})\s*([а-я\.]+)?\s*$/, '$1 $2 $3'));
    avans_rub != 0 ? $('#avans_pre').show().find('span').text((Math.round(avans_rub)+' руб.').replace(/^\s*(\d+)(\d{3})\s*([а-я\.]+)?\s*$/, '$1 $2 $3')) : $('#avans_pre').hide();
    $('#summ_pre span').text((Math.round(summa_zaim)+' руб.').replace(/^\s*(\d+)(\d{3})\s*([а-я\.]+)?\s*$/, '$1 $2 $3'));
    $('#monthly_installment_pre span').text((Math.round(monthly_pay)+' руб.').replace(/^\s*(\d+)(\d{3})\s*([а-я\.]+)?\s*$/, '$1 $2 $3'));
    $('#partner_prem_pre span').text((calc_partner_rewards().toFixed(2)+' руб.').replace(/^\s*(\d+)(\d{3})\s*([а-я\.]+)?\s*$/, '$1 $2 $3'));
//Отладка параметров
    //console.log('margin='+margin,'goods_summ='+goods_summ,'xch='+xch,'months='+months,'dogovor='+dogovor,'ins_nk_summ='+ins_nk_summ,'insCalc='+insCalc(),'avans='+avans,'p_dis='.p_dis); 
    lgotniyCalc($('select[name=programm] option:selected').text(),goods_summ,avans_rub);
    if(rassrochka == false) { $('#partner_discount_pre').hide()};
    recalc();
    //Проверка лимита и суммы займа
    checkLimitSumm($('input[name=summa_zaim'));
    //console.log();
}
    
function insCalc() {
    var InsLife = $("[name=InsLife]").is(':checked');
    var InsJob = $("[name=InsJob]").is(':checked');
    var InsTraum = $("[name=InsTraum]").is(':checked');
    var InsKomfort = $("[name=InsKomfort]").is(':checked');
    var insSumm = 0;
    if (InsLife == true || InsJob == true || InsTraum == true|| InsKomfort==true) {
        if (InsLife == true) {
            insSumm += parseFloat($('input[name=InsLife]').attr('data-margin'));
        }
        if (InsJob == true) {
            insSumm += parseFloat($('input[name=InsJob]').attr('data-margin'));
        }
        if (InsTraum == true)
        {
            insSumm += parseFloat($('input[name=InsTraum]').attr('data-margin'));
        }
        if (InsKomfort==true)
        {
            insSumm += parseFloat($('input[name=InsKomfort]').attr('data-margin'));
        }
    } else {
        insSumm = 0;
    }
    return insSumm;
}

//Пересчет показателей margin и chgps исходя из лимитов
function recalc () {
    var iterations = parseInt($('#iterations').val());
    var summa_zaim = parseInt($('#summa_zaim').val());
    var current_margin = $('#margin').val();
    var current_chgps = $('#chgps').val();
    if(iterations < 3) {
        $.each(programm_limit, function(index, val) {
            //console.log(val.sum_min,val.sum_max,summa_zaim);
            if(summa_zaim >= parseInt(val.sum_min) && summa_zaim <= parseInt(val.sum_max)) {
                //console.log(summa_zaim);
                //console.log('Текущий margin: '+current_margin+', текущий chgps:'+current_chgps); 
                //console.log('Правильный margin: '+val.margin+', правильный chgps:'+val.chgps);
                if(current_chgps != val.chgps) {
                    $('#chgps').val(val.chgps);
                }
                if(current_margin != val.margin) {
                    $('#iterations').val(iterations+1)
                    $('#margin').val(val.margin);
                    $('#chgps').val(val.chgps);
                    mainCalc();
                }
            } else {
                //console.log('неверный диапазон');
            }
        });
    }
}

function calc_partner_rewards() {
    try {
        var month = parseInt($('#months').val());
    } catch (E)
    {
        console.log(e)
        var month = 0;
    }
    try {
        var summa = parseFloat($('#allSumm').val());
    } catch (E)
    {
        console.log(e)
        var summa = 0;
    }
    try {
        var avans = parseFloat($('#avans_to_partner').val());
    } catch (E)
    {
        console.log(e)
        var avans = 0;
    }
    try {
        var nkIns = parseFloat($('[name=summ_sured]').val());
        if (isNaN(nkIns))
        {
            nkIns = 0;
        }
    } catch (E)
    {
        console.log(e)
        var nkIns = 0;
    }
    try {
        var partner_reward = parseFloat($('#partner_reward').val());
    } catch (E)
    {
        console.log(e)
        var partner_reward = 0;
    }
    try {
        var programm = $('#programm').val();
    } catch (e) {
        console.log(e)
        var programm = '';
    }

    summa -= (avans);
    var summaPartnerRewards = 0;//вознаграждение за займ
    summaPartnerRewards = summa * (partner_reward / 100);
    var insReward = 0;//вознаграждение за страховки
    if (($('#ins_life').is(':checked') || $('#ins_life_plus').is(':checked')
            ||$('#ins_trauma').is(':checked'))
                &&programm.indexOf('Мобилка')!==0) {
        if (summa <= 50000) {
            insReward = summa * month * 0.0018;
        } else if (summa <= 100000) {
            insReward = summa * month * 0.0012;
        } else if (summa <= 200000) {
            insReward = summa * month * 0.0009;
        } else if (summa > 200001) {
            insReward = summa * month * 0.0006;
        }
        //Жизнь+ВНТ *2
        if ($('#ins_life_plus').is(':checked')) {
        insReward *= 2;
        }
        //Жизнь+Травма всегда 0,18%
        if ($('#ins_trauma').is(':checked')) {
            insReward = summa * month * 0.0018;
        }
    }
    
    summaPartnerRewards += insReward;
    var sumSms = 0;
    if ($('#sms_inform').is(':checked')) {
        if (month <= 3) {
            sumSms = 30;
        }
        if (month >= 4) {
            sumSms = month * 10;
        }
    }
    console.log(insReward);
    summaPartnerRewards += sumSms;

    if (isNaN(summaPartnerRewards)) {
        summaPartnerRewards = 0;
    }
    var nkInsRev = 0;
    if ($('#bsplus').is(':checked')) {
        if (insReward > 0) {
            nkInsRev += 2650 * 0.24;
        } else {
            nkInsRev += 2650 * 0.2075;
        }
    }
    if ($('#bs').is(':checked')) {
        if (insReward > 0) {
            nkInsRev += 1900 * 0.24;
        } else {
            nkInsRev += 1900 * 0.2105;
        }
    }
    if ($('#prioritet').is(':checked')) {
        if (insReward > 0) {
            nkInsRev += 950 * 0.21;
        } else {
            nkInsRev += 950 * 0.18;
        }
    }
    if ($('#hit').is(':checked')) {
        if (insReward > 0) {
            nkInsRev += 2000 * 0.21;
        } else {
            nkInsRev += 2000 * 0.18;
        }
    }
    if ($('#hitplus').is(':checked')) {
        if (insReward > 0) {
            nkInsRev += 3000 * 0.21;
        } else {
            nkInsRev += 3000 * 0.18;
        }
    }
    summaPartnerRewards += nkInsRev;
    //страховка от кроновируса
    var covid = 0;
    if ($('#covid_1').is(':checked')) {
        if (insReward > 0)
        {
            covid = 1990 * 0.24;
        } else {
            covid = 1990 * 0.201005025126;
        }
    }
    if ($('#covid_2').is(':checked')) {
        if (insReward > 0)
        {
            covid = 2990 * 0.24;
        } else {
            covid = 2990 * 0.200668896321;
        }
    }
    summaPartnerRewards += covid;

//страховка мгновенная защита
    var moment = 0;
    if ($('#moment_protect_1').is(':checked')) {
        if (insReward > 0)
        {
            moment = 1050 * 0.21;
        } else {
            moment = 1050 * 0.18;
       }
    }
    if ($('#moment_protect_2').is(':checked')) {
        if (insReward > 0)
        {
            moment = 1600 * 0.21;
        } else {
            moment = 1600 * 0.18;
        }
    }
    summaPartnerRewards += moment;
    
    //СБЕР страхование
    var sber = 0;
    console.log(insReward);
    var sber_percent = insReward > 0 ? 0.21 : 0.18;
    if ($('#sber_nc_1').is(':checked')) {
        var price_sber_nc_1 = parseFloat($('#sber_nc_1').attr('data-price'));
        sber = price_sber_nc_1 * sber_percent;
    }
    if ($('#sber_nc_2').is(':checked')) {
        var price_sber_nc_2 = parseFloat($('#sber_nc_2').attr('data-price'));
        sber = price_sber_nc_2 * sber_percent;
    }
    if ($('#sber_nc_3').is(':checked')) {
        var price_sber_nc_3 = parseFloat($('#sber_nc_3').attr('data-price'));
        sber = price_sber_nc_3 * sber_percent;
    }
    if ($('#sber_nc_zdz_1').is(':checked')) {
        var price_sber_nc_zdz_1 = parseFloat($('#sber_nc_zdz_1').attr('data-price'));
        sber = price_sber_nc_zdz_1 * sber_percent;
    }
    if ($('#sber_nc_zdz_2').is(':checked')) {
        var price_sber_nc_zdz_2 = parseFloat($('#sber_nc_zdz_2').attr('data-price'));
        sber = price_sber_nc_zdz_2 * sber_percent;
    }
    
    
    summaPartnerRewards += sber;
    
    //СБЕР-имущество страхование
    var sber_im = 0;
    if ($('#sber_nc_im_1').is(':checked')) {
        var price_sber_nc_im_1 = parseFloat($('#sber_nc_im_1').attr('data-price'));
        sber_im = price_sber_nc_im_1 * sber_percent;
    }
    if ($('#sber_nc_im_2').is(':checked')) {
        var price_sber_nc_im_2 = parseFloat($('#sber_nc_im_2').attr('data-price'));
        sber_im = price_sber_nc_im_2 * sber_percent;
    }
    summaPartnerRewards += sber_im;

    if (programm == '10/10/10 Супер* 0% (0/0 — 0%)')
    {
        summaPartnerRewards = 0;
    }
    return summaPartnerRewards;
}

function resetForm2 () {
    $('input[name=summ]').removeClass('valid').val('').removeClass('notValid');
    $('select[name=months]').empty();
    $('select[name=avans]').empty();
    $('select[name=programm] option').eq(0).prop('selected',true);
    $('input[name=summa_zaim]').val('');
    $('input[name=monthly_installment]').val('');
    $('#ins_block input[type=checkbox]').each(function(){
        $(this).prop('checked', false);
    });
    $('input[name=partner_installment]').prop('checked',false);
    $('.preditog span').text('');
}
var token = dadata_token;
//var token = 'd5b9bcdecc32148dc7fc9b1816539fc2fbc76ea0';;
//console.log(process.env.DATATA_TOKEN);
 function gender2str(gender) {
        return gender === "MALE" ? 1 :
               gender === "FEMALE" ? 0 : "";
    }

    /*Реквизиты банка*/

    $("input[name=clearing_payee_bankbik]").suggestions({
        token: token,
        type: "BANK",
        onSelect: function (suggestion) {
            var error = {
                code: 0,
                message: ''
            };
            $("input[name=clearing_payee_bankbik]").removeClass('valid notValid');
            var bic = suggestion.data.bic;
            var bank = suggestion.value;
            var cor = suggestion.data.correspondent_account;
            var inn = suggestion.data.inn;
            var kpp = suggestion.data.kpp;
            var name = $('input[name=last_name]').val()+' '+$('input[name=first_name]').val()+' '+$('input[name=father_name]').val();
            var rs = $('input[name=clearing_payee_personalacc]').val();
/*            if ($.trim(name) == '') {
                showAlert('Не заполнены ФИО во вкладке "Личные данные", заполните данные для продолжения.');
                $("input[name=clearing_payee_bankbik]").val('');
            } else */
            if ((suggestion.data.opf.type != 'BANK' && suggestion.data.opf.type != 'BANK_BRANCH') || suggestion.data.state.status != 'ACTIVE') {
                console.log(suggestion);
                showAlert('В данный момент нет возможности перечислить на такие реквизиты');
                $("input[name=clearing_payee_bankbik]").val('');
            } else {
                $("input[name=clearing_payee_bankbik]").val(bic);
                $("input[name=clearing_payee_bankname]").val(bank);
                $("input[name=clearing_payee_inn]").val(inn);
                $("input[name=clearing_payee_kpp]").val(kpp);
                $("input[name=clearing_payee_bankcorracc]").val(cor);
                addClassValid($("input[name=clearing_payee_bankbik]"), true);
                addClassValid($("input[name=clearing_payee_bankname]"), true);
                addClassValid($("input[name=clearing_payee_inn]"), true);
                addClassValid($("input[name=clearing_payee_kpp]"), true);
                addClassValid($("input[name=clearing_payee_bankcorracc]"), true);
               // $("input[name=clearing_payee_name]").val(name);
                console.log(suggestion);
            }
            if(validateRs(rs,bic,error) == true) {
                addClassValid($('input[name=clearing_payee_personalacc]'),true);
            } else {
                addClassValid($('input[name=clearing_payee_personalacc]'),false);
            }
        }
    });
    //Проверка Р/С по блуру
   /** $("input[name=clearing_payee_personalacc]").blur(function(){
        var rs = $(this).val();
        var bic = $('input[name=clearing_payee_bankbik]').val();
        if(validateRs(rs,bic) == true) {
            addClassValid($('input[name=clearing_payee_personalacc]'),true);
        } else {
            addClassValid($('input[name=clearing_payee_personalacc]'),false);
        }
    });/

    /*Поле ФИО*/
    $("#fio").suggestions({
        token: token,
        type: "NAME",
        hint:'Выбирите один из вариантов',
        onSelectNothing: function(suggestion) {
            console.log(suggestion, 'Имя: '+$('input[name=first_name]').val()+',фамилия : '+ $('input[name=last_name]').val()+', Отчество: '+$('input[name=father_name]').val());
            fioAlert(suggestion,$('input[name=last_name]').val(),$('input[name=first_name]').val(),$('input[name=father_name]').val());
        },
        /*onInvalidateSelection: function(suggestion) {
            //console.log(suggestion, $('input[name=first_name]').val(), $('input[name=last_name]').val(),$('input[name=father_name]').val());
            fioAlert(suggestion,$('input[name=last_name]').val(),$('input[name=first_name]').val(),$('input[name=father_name]').val());
        },*/
        onSelect: function (suggestion) {
            console.log(suggestion);
            $('input[name=sex]').val(gender2str(suggestion.data.gender));
            if(suggestion.data.name != null && suggestion.data.surname != null /*&& suggestion.data.patronymic != null*/) {
                $('input[name=first_name]').val(suggestion.data.name);
                $('input[name=last_name]').val(suggestion.data.surname);
                if(suggestion.data.patronymic != null) {
                    $('input[name=father_name]').val(suggestion.data.patronymic);
                    $('input[name=noOtchesvo]').val('0');
                } else {
                    $('input[name=father_name]').val('');
                    $('input[name=noOtchesvo]').val('1');
                }
                $("#fio").addClass('valid').removeClass('notValid');
            } else {
                $("#fio").removeClass('valid').addClass('notValid');
            }
            setSourceIncome();
        },
    });

    /*Код подразделения*/
    $("#pass_code").suggestions({
        token: token,
        type: "fms_unit",
        onSuggestionsFetch:function (suggestions) {
            if(suggestions.length == 0) {
                console.log('Нет кода');
                $("#pass_code").addClass('semi-valid');
                $('.pass_whom_block').show().attr('data-need',1);
            } else {

            }
        },
        onSelect: function (suggestion) {
            if(suggestion.data.code != '' && suggestion.data.name != '') {
                $("#pass_code").removeClass('notValid').addClass('valid').val(suggestion.data.code);
                $('input[name=pass_whom]').val(suggestion.data.name).removeAttr('data-need');
                $("#pass_code").removeClass('semi-valid');
                $('.pass_whom_block').hide();
            } else {
                //$("#pass_code").removeClass('valid').addClass('notValid');
            }

            console.log(suggestion);
        }
    });

    //Адрес объекта страхования
     $('input[name=insured_address]').suggestions ({
        token: token,
        type: 'ADDRESS',
        onSelect: function (suggestion) {
        }
     });

    /*Адрес регистрации*/
    $('[name=one_string_adres_registration]').suggestions ({
        token: token,
        type: 'ADDRESS',
        hint: false,
        onSuggestionsFetch:function (suggestions) {
            if(suggestions.length == 0) {
                console.log('Нет адреса');
                $('[name=one_string_adres_registration]').addClass('semi-valid');
                $('[name=adress_registration_incorrect]').val(1);
            } else {

            }
        },
        onSelect: function (suggestion) {
            var source_input = $('[name=one_string_adres_registration]');
            source_input.removeClass('semi-valid');
            $('[name=adress_registration_incorrect]').val(0);
            //source_input.val(suggestion.value).addClass('valid');
             console.log(suggestion.data);
                /*коды фиас и окато*/
                $('[name=fias_id_registration]').val(suggestion.data.fias_id);
                $('[name=okato_registration]').val(suggestion.data.okato);

                //Обработка региона
                $('[name=obl_registration]').val(suggestion.data.region_with_type);

                //Код региона
                try {
                    $('[name=region_registration]').val(suggestion.data.kladr_id.substr(0,2));
                } catch (e) {
                    $('[name=region_registration]').val('');
                }
                $('[name=adress_code_registration]').val(suggestion.data.kladr_id);

                //Обработка города
                var city_with_type = suggestion.data.city + ' ' + suggestion.data.city_type;
                if (suggestion.data.city_with_type == null) {
                    $('[name=locality_registration]').val('');
                    if(suggestion.data.settlement_with_type == null) {
                        $('[name=countryside_registration]').val('');
                        addClassValid(source_input, false); //без населенного пункта поле не валидно
                        $('.clone_reg').hide();
                    } else {
                        $('[name=countryside_registration]').val(suggestion.data.settlement_with_type);
                        addClassValid(source_input, true);
                        $('.clone_reg').show();
                    }
                } else {
                    $('[name=locality_registration]').val(city_with_type);
                    if(suggestion.data.settlement_with_type != null) {
                        $('[name=countryside_registration]').val(suggestion.data.settlement_with_type);
                    }
                    addClassValid(source_input, true);
                    $('.clone_reg').show();
                }

                //Обработка района
                $('[name=ray_registration]').val(suggestion.data.area_with_type);
                //Почтовый индекс
                $('[name=postalcode_registration]').val(suggestion.data.postal_code);

                //обработка улицы + галка нет улицы
                if (suggestion.data.street != null) {
                    var street_with_type = suggestion.data.street + ' ' + suggestion.data.street_type;
                    $('[name=street_registration]').val(street_with_type);
                    $('#registration_street_off').prop('checked',false);
                } else {
                     $('[name=street_registration]').val('');
                     $('#registration_street_off').prop('checked',true);
                }

                //обработка дома + галка нет дома
                if (suggestion.data.house == null || suggestion.data.house == undefined) {
                    $('[name=home_registration]').val('');
                    $('#registration_home_off').prop('checked',true);
                } else {
                    $('[name=home_registration]').val(suggestion.data.house);
                    $('#registration_home_off').prop('checked',false);
                }

                //обработка квартиры + галка нет квартиры
                if (suggestion.data.flat == null || suggestion.data.flat == undefined) {
                    $('[name=apartment_registration]').val('');
                    $('#registration_apartment_off').prop('checked',true);
                } else {
                    $('[name=apartment_registration]').val(suggestion.data.flat);
                    $('#registration_apartment_off').prop('checked',false);
                }


            }
    });

    /*Адрес проживания*/
    $('[name=one_string_adres_living]').suggestions ({
        token: token,
        type: 'ADDRESS',
        hint: false,
        onSuggestionsFetch:function (suggestions) {
            if(suggestions.length == 0) {
                console.log('Нет адреса');
                $('[name=one_string_adres_living]').addClass('semi-valid');
                $('[name=adress_living_incorrect]').val(1);
            } else {

            }
        },
        onSelect: function (suggestion) {
            var source_input = $('[name=one_string_adres_living]');
            //source_input.val(suggestion.value).addClass('valid');
            source_input.removeClass('semi-valid');
            $('[name=adress_living_incorrect]').val(0);
             console.log(suggestion.data);
                /*коды фиас и окато*/
                $('[name=fias_id_living]').val(suggestion.data.fias_id);
                $('[name=okato_living]').val(suggestion.data.okato);

                //Обработка региона
                $('[name=obl_living]').val(suggestion.data.region_with_type);

                //Код региона
                try {
                    $('[name=region_living]').val(suggestion.data.kladr_id.substr(0,2));
                } catch (e) {
                    $('[name=region_living]').val('');
                }
                $('[name=adress_code_living]').val(suggestion.data.kladr_id);

                //Обработка города
                var city_with_type = suggestion.data.city + ' ' + suggestion.data.city_type;
                if (suggestion.data.city_with_type == null) {
                    $('[name=locality_living]').val('');
                    if(suggestion.data.settlement_with_type == null) {
                        $('[name=countryside_living]').val('');
                        addClassValid(source_input, false); //без населенного пункта поле не валидно
                    } else {
                        $('[name=countryside_living]').val(suggestion.data.settlement_with_type);
                        addClassValid(source_input, true);
                    }
                } else {
                    if(suggestion.data.settlement_with_type != null) {
                        $('[name=countryside_living]').val(suggestion.data.settlement_with_type);
                    }
                    $('[name=locality_living]').val(city_with_type);
                    addClassValid(source_input, true);
                }

                //Обработка района
                $('[name=ray_living]').val(suggestion.data.area_with_type);
                //Почтовый индекс
                $('[name=postalcode_living]').val(suggestion.data.postal_code);

                //обработка улицы + галка нет улицы
                if (suggestion.data.street != null) {
                    var street_with_type = suggestion.data.street + ' ' + suggestion.data.street_type;
                    $('[name=street_living]').val(street_with_type);
                    $('#living_street_off').prop('checked',false);
                } else {
                     $('[name=street_living]').val('');
                     $('#living_street_off').prop('checked',true);
                }

                //обработка дома + галка нет дома
                if (suggestion.data.house == null || suggestion.data.house == undefined) {
                    $('[name=home_living]').val('');
                    $('#living_home_off').prop('checked',true);
                } else {
                    $('[name=home_living]').val(suggestion.data.house);
                    $('#living_home_off').prop('checked',false);
                }

                //обработка квартиры + галка нет квартиры
                if (suggestion.data.flat == null || suggestion.data.flat == undefined) {
                    $('[name=apartment_living]').val('');
                    $('#living_apartment_off').prop('checked',true);
                } else {
                    $('[name=apartment_living]').val(suggestion.data.flat);
                    $('#living_apartment_off').prop('checked',false);
                }
            }
    });

    //Кнопка совпадает с регистрацией
    $('.clone_reg').click(function(e){
        e.preventDefault();
        $('[name=one_string_adres_living]').val($('[name=one_string_adres_registration]').val());
        addClassValid($('[name=one_string_adres_living]'), true);
        if($('[name=one_string_adres_registration]').hasClass('semi-valid')) {
            $('[name=one_string_adres_living]').addClass('semi-valid');
        } else {
            $('[name=one_string_adres_living]').removeClass('semi-valid');
        }
        $('.registration-fields input').each(function(){
            var target = $(this).attr('name').replace('registration', 'living');
            var val = $(this).val();
            $('.living-fields input[name='+target+']').val(val);
            if($(this).attr('type') == 'checkbox') {
                var checked = $(this).prop('checked');
                console.log(target,checked);
                $('.living-fields input[name='+target+']').prop('checked',checked);
            }
        });
    });

    function fioAlert(sugg,last_name,first_name,father_name) {
        var text = '';
        if (sugg == '') {
            showPopup({
                text: 'Вы не ввели ФИО!'
            });
        } else {
            if(last_name == '' && first_name == '' && father_name == '') {
                text = '<p>Не удалось определить ФИО. Пожалуйста заполните форму ниже:</p>\n\
                            <label>Фамилия</label><input type="text" name="manual_last_name" maxlength="25" placeholder="Фамилия">\n\
                            <label>Имя</label><input type="text" name="manual_first_name" maxlength="25" placeholder="Имя">\n\
                            <label>Отчество</label><input type="text" name="manual_father_name" maxlength="25" placeholder="Отчество">'
            } else {
                text = '<p>Не удалось определить ФИО. Пожалуйста заполните форму ниже:</p>\n\
                            <label>Фамилия</label><input type="text" name="manual_last_name" placeholder="Фамилия" maxlength="25" value="'+last_name+'">\n\
                            <label>Имя</label><input type="text" name="manual_first_name" placeholder="Имя" maxlength="25" value="'+first_name+'">\n\
                            <label>Отчество</label><input type="text" name="manual_father_name" placeholder="Отчество" maxlength="25" value="'+father_name+'">'
            }

            showPopup({
                    title: 'Внимание!',
                    text: text,
                    links: [{
                        link_text:'Подтвердить',
                        link_class:'accept-manual-fio',
                        link: '#',
                    }],
                    classes: 'set-fio' //Классы для модалки если нужно, не обязательный
                });
        }
    }

    $(document).on('click','.accept-manual-fio', function(e){
        e.preventDefault();
        var last_name = $('.set-fio input[name=manual_last_name]').hasClass('notValid') ? '' : $('.set-fio input[name=manual_last_name]').val().trim();
        var first_name = $('.set-fio input[name=manual_first_name]').hasClass('notValid') ? '' : $('.set-fio input[name=manual_first_name]').val().trim();
        var father_name = $('.set-fio input[name=manual_father_name]').hasClass('notValid') ? '' : $('.set-fio input[name=manual_father_name]').val().trim();
        if(last_name != '' && first_name != '') {
            $('input[name=first_name]').val(first_name);
            $('input[name=last_name]').val(last_name);
            if(father_name != '') {
                $('input[name=father_name]').val(father_name);
                $('input[name=noOtchesvo]').val('0');
            } else {
                $('input[name=father_name]').val('');
                $('input[name=noOtchesvo]').val('1');
            }
            $("#fio").addClass('valid').removeClass('notValid');
            $('#fio').val(last_name+' '+first_name+' '+father_name);
            closePopup();
        } else {

        }
    });

/*Валидация даты при вооде*/
/*Проверка полей даты*/
$(document).on('change', '.date-type', function () {
    if(checkCorrectDate($(this).val())) {
        $(this).removeClass('notValid');
    } else {
        addClassValid($(this),false);
    }
    /*let date = $(this).val().split('-');
    let day = '';
    let month = '';
    let year = '';
    let regexp =  new RegExp('^((((0?[1-9].(0?[1-9]|1[0-2]))|([12][0-9].((0?[13-9])|1[0-2]))|(((1[0-9])|(2[0-8])).0?2)|(30.((0?[13-9])|1[0-2]))|(31.((0?[13578])|10|12))).[0-9]{4})|(29.0?2.(([0-9]{2}((0[48])|([2468][048])|([13579][26])))|((([02468][048])|([13579][26]))00))))$');
    var validDate = regexp.test($(this).val());
    if(validDate) {
        $(this).removeClass('notValid');
    } else {
        addClassValid($(this),false);
    }*/
});
function checkCorrectDate (val) {
    var regexp =  new RegExp('^((((0?[1-9].(0?[1-9]|1[0-2]))|([12][0-9].((0?[13-9])|1[0-2]))|(((1[0-9])|(2[0-8])).0?2)|(30.((0?[13-9])|1[0-2]))|(31.((0?[13578])|10|12))).[0-9]{4})|(29.0?2.(([0-9]{2}((0[48])|([2468][048])|([13579][26])))|((([02468][048])|([13579][26]))00))))$');
    var validDate = regexp.test(val);
    return validDate;
}


$(document).ready(function(){
    //Проверка на префикс
    //checkPoint();
    $('#geo-select input[type=radio]').change(function(){
        var prefix = $(this).attr('data-prefix');
        $('#geo-select input[name=prefix]').val(prefix);
    });

    //запись в сессию префикса и id анкеты
    $('#geo-select').submit(function(e){
        e.preventDefault();
        var data = $('#geo-select').serialize();
        var id = $('#geo-select input[name=id]:checked').val();
        var prefix = $('#geo-select input[name=prefix]').val();
        $.ajax({
            type: 'POST',
            url: 'user/set_prefixId?'+ new Date().getTime(),
            data: {'id':id,'prefix': prefix},
            beforeSend: function () {
            },
            success: function (data) {
               data = jQuery.parseJSON(data);
               if(data.success == true) {
                   //console.log(data);
                   window.location = '/';
               } else {
                   console.log(data);
               }

            },
            error: function (xhr, str) {
                showPopup({text:'Возникла ошибка: ' + xhr.responseText});
                return false;
            }
        });
    });

    /*Смена точки обсуживания*/
    $('.change-geo').click(function(e){
        e.preventDefault();
        showPopup ({
            title: 'Внимание',
            text: 'Все данные будут сброшены, Вы уверены, что хотите продолжить?',
            links: [{
                    link_text:'Нет',
                    link_class:'closepopup',
                    link: '#',
                },
                {
                    link_text:'Да',
                    link_class:'show-geolist',
                    link: '#',
                }]
        });
    });
});

$(document).on('click', '.show-geolist', function() {
    showGeoModal();
    closePopup();
});


function showGeoModal () {
    $('#geo-select-modal').slideDown(200);
    $('body').addClass('modal-open');
}

function checkPoint () {
    $.ajax({
        type: 'POST',
        url: 'user/get_prefix?'+ new Date().getTime(),
        beforeSend: function () {
        },
        success: function (data) {
           // data = jQuery.parseJSON(data);
           if(data) {
               //console.log(data);
           } else {
               showGeoModal();
               //console.log(data);
           }

        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

/*загрузка фото паспорта и ресайз картинок для загрузки*/
$(document).on('click', '.pass-button', function () {
    var file1 = $('input[name=pass1_resized]').val() != '' ? $('.file1-info span').text() : 'Выбрать файл';
    var file2 = $('input[name=pass2_resized]').val() != '' ? $('.file2-info span').text() : 'Выбрать файл';
    showPopup({
        'title': 'Прикрепить файл',
        'text': '<span>Паспорт 1-й разворот</span>\n\
                <div class="file-wrap"><input type="file" name="pass_scan_1" id="pass_scan_1"><span>' + file1 + '</span></div>\n\
                <span>Паспорт регистрация</span>\n\
                <div class="file-wrap"><input type="file" name="pass_scan_2" id="pass_scan_2"><span>' + file2 + '</span></div>',
        'links': [{
                'link_text': 'отмена',
                'link_class': 'closepopup',
                'link': '#'
            }]
    });
});

$(document).on('click', '.spravka-button', function () {
    var file1 = $('input[name=spravka1_resized]').val() != '' ? $('.file3-info span').text() : 'Выбрать файл';
    var file2 = $('input[name=spravka2_resized]').val() != '' ? $('.file4-info span').text() : 'Выбрать файл';
    showPopup({
        'title': 'Прикрепить файл',
        'text': '<span>Справка о доходах</span>\n\
                <div class="file-wrap"><input type="file" name="spravka_scan_1" id="spravka_scan_1"><span>' + file1 + '</span></div>\n\
                <span>Справка о доходах</span>\n\
                <div class="file-wrap"><input type="file" name="spravka_scan_2" id="spravka_scan_2"><span>' + file2 + '</span></div>',
        'links': [{
                'link_text': 'отмена',
                'link_class': 'closepopup',
                'link': '#'
            }]
    });
});

$(document).on('click', '.remove_file', function (e) {
    e.preventDefault();
    var fileID = $(this).attr('data-file');
    $('input[name=' + fileID + ']').val('');
    $(this).parent().find('span').text('');
    $(this).parent().hide();
});


$(document).on('change', 'input[name=pass_scan_1]', function () {
    var fullName = $(this).val();
    var fileSize = this.files[0].size / 1078574; //размер файла МБ
    var id = $(this).attr('id');
    var typefile = fullName.split(".").pop().toLowerCase();
    var filename_span = $(this).parent().find('span');
    fullName = fullName.split('\\');
    console.log(fullName);

    var len = fullName.length - 1;
    var fileName = String(fullName[len]);
    var filesToUpload = document.getElementById(id).files;
    var file = filesToUpload[0];
    var jsonObj = {
        files: {

        }
    }
    if (typefile == 'jpg' || typefile == 'jpeg' || typefile == 'png' || typefile == 'gif') {
        'use strict';
        // Initialise resize library
        var resize = new window.resize();
        resize.init();
        resize.photo(file, 1024, 'dataURL', function (resizedFile) {
            $('input[name=pass1_resized]').val(resizedFile);
            //$('#scan1').attr('data-file-type', typefile);
            /*$('#file_type').val(typefile);
             $('#file_name').val(fileName.split(".")[0]);
             $('#file1 + a').text('Файл добавлен').addClass('file_added');*/
            filename_span.text(fileName);
            $('.file1-info').show();
            $('.file1-info span').text(fileName);
            closePopup();
        });
    } else if (typefile == 'pdf') {
        if (fileSize > 2) {
            $(this).val('');
            alert('Допустимый размер файла не более 2 Мб');
        } else {
            var reader = new FileReader();
            reader.onloadend = function () {
                $('input[name=pass1_resized]').val(reader.result);
                //$('#scan1').attr('data-file-type', typefile);
                /*$('#file_type').val(typefile);
                 $('#file_name').val(fileName.split(".")[0]);
                 $('#file1 + a').text('Файл добавлен').addClass('file_added');
                 $('.fn_1').text(fileName);*/
                filename_span.text(fileName);
                $('.file1-info').show();
                $('.file1-info span').text(fileName);
                closePopup();
            }
            reader.readAsDataURL(file);
        }
    } else {
        $(this).val('');
        alert('Недопустимый тип файла. Пожалуйста выберите другой файл. Допустимые типы файлов: jpg, jpeg, png, gif, pdf');
    }
});

$(document).on('change', 'input[name=pass_scan_2]', function () {
    var fullName = $(this).val();
    var fileSize = this.files[0].size / 1078574; //размер файла МБ
    var id = $(this).attr('id');
    var typefile = fullName.split(".").pop().toLowerCase();
    var filename_span = $(this).parent().find('span');
    fullName = fullName.split('\\');
    console.log(fullName);


    var len = fullName.length - 1;
    var fileName = String(fullName[len]);
    var filesToUpload = document.getElementById(id).files;
    var file = filesToUpload[0];
    var jsonObj = {
        files: {

        }
    }
    if (typefile == 'jpg' || typefile == 'jpeg' || typefile == 'png' || typefile == 'gif') {
        'use strict';
        // Initialise resize library
        var resize = new window.resize();
        resize.init();
        resize.photo(file, 1024, 'dataURL', function (resizedFile) {
            $('input[name=pass2_resized]').val(resizedFile);
            filename_span.text(fileName);
            $('.file2-info').show();
            $('.file2-info span').text(fileName);
            closePopup();
        });
    } else if (typefile == 'pdf') {
        if (fileSize > 2) {
            $(this).val('');
            alert('Допустимый размер файла не более 2 Мб');
        } else {
            var reader = new FileReader();
            reader.onloadend = function () {
                $('input[name=pass2_resized]').val(reader.result);
                filename_span.text(fileName);
                $('.file2-info').show();
                $('.file2-info span').text(fileName);
                closePopup();
            }
            reader.readAsDataURL(file);
        }
    } else {
        $(this).val('');
        alert('Недопустимый тип файла. Пожалуйста выберите другой файл. Допустимые типы файлов: jpg, jpeg, png, gif, pdf');
    }
});

$(document).on('change', 'input[name=spravka_scan_1]', function () {
    var fullName = $(this).val();
    var fileSize = this.files[0].size / 1078574; //размер файла МБ
    var id = $(this).attr('id');
    var typefile = fullName.split(".").pop().toLowerCase();
    var filename_span = $(this).parent().find('span');
    fullName = fullName.split('\\');
    console.log(fullName);

    var len = fullName.length - 1;
    var fileName = String(fullName[len]);
    var filesToUpload = document.getElementById(id).files;
    var file = filesToUpload[0];
    var jsonObj = {
        files: {

        }
    }
    if (typefile == 'jpg' || typefile == 'jpeg' || typefile == 'png' || typefile == 'gif') {
        'use strict';
        // Initialise resize library
        var resize = new window.resize();
        resize.init();
        resize.photo(file, 1024, 'dataURL', function (resizedFile) {
            $('input[name=spravka1_resized]').val(resizedFile);
            //$('#scan1').attr('data-file-type', typefile);
            /*$('#file_type').val(typefile);
             $('#file_name').val(fileName.split(".")[0]);
             $('#file1 + a').text('Файл добавлен').addClass('file_added');*/
            filename_span.text(fileName);
            $('.file3-info').show();
            $('.file3-info span').text(fileName);
            closePopup();
        });
    } else if (typefile == 'pdf') {
        if (fileSize > 2) {
            $(this).val('');
            alert('Допустимый размер файла не более 2 Мб');
        } else {
            var reader = new FileReader();
            reader.onloadend = function () {
                $('input[name=spravka1_resized]').val(reader.result);
                //$('#scan1').attr('data-file-type', typefile);
                /*$('#file_type').val(typefile);
                 $('#file_name').val(fileName.split(".")[0]);
                 $('#file1 + a').text('Файл добавлен').addClass('file_added');
                 $('.fn_1').text(fileName);*/
                filename_span.text(fileName);
                $('.file3-info').show();
                $('.file3-info span').text(fileName);
                closePopup();
            }
            reader.readAsDataURL(file);
        }
    } else {
        $(this).val('');
        alert('Недопустимый тип файла. Пожалуйста выберите другой файл. Допустимые типы файлов: jpg, jpeg, png, gif, pdf');
    }
});

$(document).on('change', 'input[name=spravka_scan_2]', function () {
    var fullName = $(this).val();
    var fileSize = this.files[0].size / 1078574; //размер файла МБ
    var id = $(this).attr('id');
    var typefile = fullName.split(".").pop().toLowerCase();
    var filename_span = $(this).parent().find('span');
    fullName = fullName.split('\\');
    console.log(fullName);

    var len = fullName.length - 1;
    var fileName = String(fullName[len]);
    var filesToUpload = document.getElementById(id).files;
    var file = filesToUpload[0];
    var jsonObj = {
        files: {

        }
    }
    if (typefile == 'jpg' || typefile == 'jpeg' || typefile == 'png' || typefile == 'gif') {
        'use strict';
        // Initialise resize library
        var resize = new window.resize();
        resize.init();
        resize.photo(file, 1024, 'dataURL', function (resizedFile) {
            $('input[name=spravka2_resized]').val(resizedFile);
            //$('#scan1').attr('data-file-type', typefile);
            /*$('#file_type').val(typefile);
             $('#file_name').val(fileName.split(".")[0]);
             $('#file1 + a').text('Файл добавлен').addClass('file_added');*/
            filename_span.text(fileName);
            $('.file4-info').show();
            $('.file4-info span').text(fileName);
            closePopup();
        });
    } else if (typefile == 'pdf') {
        if (fileSize > 2) {
            $(this).val('');
            alert('Допустимый размер файла не более 2 Мб');
        } else {
            var reader = new FileReader();
            reader.onloadend = function () {
                $('input[name=spravka2_resized]').val(reader.result);
                //$('#scan1').attr('data-file-type', typefile);
                /*$('#file_type').val(typefile);
                 $('#file_name').val(fileName.split(".")[0]);
                 $('#file1 + a').text('Файл добавлен').addClass('file_added');
                 $('.fn_1').text(fileName);*/
                filename_span.text(fileName);
                $('.file4-info').show();
                $('.file4-info span').text(fileName);
                closePopup();
            }
            reader.readAsDataURL(file);
        }
    } else {
        $(this).val('');
        alert('Недопустимый тип файла. Пожалуйста выберите другой файл. Допустимые типы файлов: jpg, jpeg, png, gif, pdf');
    }
});
 /*$(document).ready(function(){
      $.ajax({
        type: 'POST',
        url: '/main/get_insurance_price?'+ new Date().getTime(),
        beforeSend: function () {
        },
        success: function (result) {
            //console.log(result);
            let res = $.parseJSON(result);
            $.each(res, function(index,value){
                $('.insurance_short input[value='+value.id+']').attr('data-price',value.price);
                //console.log(value.id);
            });

        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    })
 });*/
 $(document).on('change', '#ins_block input[type=checkbox]', function(){
     /*Оставляем только одну галку в одной типе страховке*/
     /*Жизнь и работа*/
     if($(this).attr('id') == 'ins_life') {
        $('#ins_life_plus').prop('checked', false);
        $('#ins_trauma').prop('checked', false);
    }
    if($(this).attr('id') == 'ins_life_plus') {
        $('#ins_life').prop('checked', false);
        $('#ins_trauma').prop('checked', false);
    }
    if($(this).attr('id') == 'ins_trauma') {
        $('#ins_life').prop('checked', false);
        $('#ins_life_plus').prop('checked', false);
    }


     /*БС*/
    if($(this).attr('id') == 'bsplus') {
        $('.insurance_short #bs').prop('checked', false);
    }
    if($(this).attr('id') == 'bs') {
        $('.insurance_short #bsplus').prop('checked', false);
    }
    /*РАТ*/
    if($(this).attr('id') == 'prioritet') {
        $('.insurance_short #hit').prop('checked', false);
        $('.insurance_short #hitplus').prop('checked', false);
    }
    if($(this).attr('id') == 'hit') {
        $('.insurance_short #prioritet').prop('checked', false);
        $('.insurance_short #hitplus').prop('checked', false);
    }
    if($(this).attr('id') == 'hitplus') {
        $('.insurance_short #hit').prop('checked', false);
        $('.insurance_short #prioritet').prop('checked', false);
    }
    /*Коронавирус*/
    if($(this).attr('id') == 'covid_1') {
        $('.insurance_short #covid_2').prop('checked', false);
    }
    if($(this).attr('id') == 'covid_2') {
        $('.insurance_short #covid_1').prop('checked', false);
    }
    /*Мгновенная защита*/
    if($(this).attr('id') == 'moment_protect_1') {
        $('.insurance_short #moment_protect_2').prop('checked', false);
    }
    if($(this).attr('id') == 'moment_protect_2') {
        $('.insurance_short #moment_protect_1').prop('checked', false);
    }
    /*СБЕР*/
    if($(this).attr('id') == 'sber_nc_1') {
        $('.insurance_short #sber_nc_2').prop('checked', false);
        $('.insurance_short #sber_nc_3').prop('checked', false);
    }
    if($(this).attr('id') == 'sber_nc_2') {
        $('.insurance_short #sber_nc_1').prop('checked', false);
        $('.insurance_short #sber_nc_3').prop('checked', false);
    }
    if($(this).attr('id') == 'sber_nc_3') {
        $('.insurance_short #sber_nc_1').prop('checked', false);
        $('.insurance_short #sber_nc_2').prop('checked', false);
    }
    //СБЕР ЗДЗ
    if($(this).attr('id') == 'sber_nc_zdz_1') {
        $('.insurance_short #sber_nc_zdz_2').prop('checked', false);
    }
    if($(this).attr('id') == 'sber_nc_zdz_2') {
        $('.insurance_short #sber_nc_zdz_1').prop('checked', false);
    }
    //СБЕР Имущество
    if($(this).attr('id') == 'sber_nc_im_1') {
        $('.insurance_short #sber_nc_im_2').prop('checked', false);
    }
    if($(this).attr('id') == 'sber_nc_im_2') {
        $('.insurance_short #sber_nc_im_1').prop('checked', false);
    }
    //Проверка возраста
    var id = $('input[name=app_id]').val();
    getClientBirth(id);
 });
  $(document).on('change', '.insurance_short input[type=checkbox]', function(){
      var summ_sured = 0;
      $('.insurance_short input[type=checkbox]').each(function(){
          $(this).prop('checked') ? summ_sured += parseFloat($(this).attr('data-price')) : '';
      });
      $('#summ_sured').val(summ_sured);
      if($('input[name=sber_nc_im_1').prop('checked') || $('input[name=sber_nc_im_2').prop('checked')) {
          $('.insured_address-block').slideDown(200);
      } else {
          $('.insured_address-block').slideUp(200);
          $('input[name=insured_address]').val('');
      }
  });

/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2014 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.0
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b,c=navigator.userAgent,d=/iphone/i.test(c),e=/chrome/i.test(c),f=/android/i.test(c);a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},a.fn.extend({caret:function(a,b){var c;if(0!==this.length&&!this.is(":hidden")){ return"number"==typeof a?(b="number"==typeof b?b:a,this.each(function(){this.setSelectionRange?this.setSelectionRange(a,b):this.createTextRange&&(c=this.createTextRange(),c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select())})):(this[0].setSelectionRange?(a=this[0].selectionStart,b=this[0].selectionEnd):document.selection&&document.selection.createRange&&(c=document.selection.createRange(),a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length),{begin:a,end:b}) }},unmask:function(){return this.trigger("unmask")},mask:function(c,g){var h,i,j,k,l,m,n,o;if(!c&&this.length>0){h=a(this[0]);var p=h.data(a.mask.dataName);return p?p():void 0}return g=a.extend({autoclear:a.mask.autoclear,placeholder:a.mask.placeholder,completed:null},g),i=a.mask.definitions,j=[],k=n=c.length,l=null,a.each(c.split(""),function(a,b){"?"==b?(n--,k=a):i[b]?(j.push(new RegExp(i[b])),null===l&&(l=j.length-1),k>a&&(m=j.length-1)):j.push(null)}),this.trigger("unmask").each(function(){function h(){if(g.completed){for(var a=l;m>=a;a++){ if(j[a]&&C[a]===p(a)){ return; } }g.completed.call(B)}}function p(a){return g.placeholder.charAt(a<g.placeholder.length?a:0)}function q(a){for(;++a<n&&!j[a];){ ; }return a}function r(a){for(;--a>=0&&!j[a];){ ; }return a}function s(a,b){var c,d;if(!(0>a)){for(c=a,d=q(b);n>c;c++){ if(j[c]){if(!(n>d&&j[c].test(C[d]))){ break; }C[c]=C[d],C[d]=p(d),d=q(d)} }z(),B.caret(Math.max(l,a))}}function t(a){var b,c,d,e;for(b=a,c=p(a);n>b;b++){ if(j[b]){if(d=q(b),e=C[b],C[b]=c,!(n>d&&j[d].test(e))){ break; }c=e} }}function u(){var a=B.val(),b=B.caret();if(a.length<o.length){for(A(!0);b.begin>0&&!j[b.begin-1];){ b.begin--; }if(0===b.begin){ for(;b.begin<l&&!j[b.begin];){ b.begin++; } }B.caret(b.begin,b.begin)}else{for(A(!0);b.begin<n&&!j[b.begin];){ b.begin++; }B.caret(b.begin,b.begin)}h()}function v(){A(),B.val()!=E&&B.change()}function w(a){if(!B.prop("readonly")){var b,c,e,f=a.which||a.keyCode;o=B.val(),8===f||46===f||d&&127===f?(b=B.caret(),c=b.begin,e=b.end,e-c===0&&(c=46!==f?r(c):e=q(c-1),e=46===f?q(e):e),y(c,e),s(c,e-1),a.preventDefault()):13===f?v.call(this,a):27===f&&(B.val(E),B.caret(0,A()),a.preventDefault())}}function x(b){if(!B.prop("readonly")){var c,d,e,g=b.which||b.keyCode,i=B.caret();if(!(b.ctrlKey||b.altKey||b.metaKey||32>g)&&g&&13!==g){if(i.end-i.begin!==0&&(y(i.begin,i.end),s(i.begin,i.end-1)),c=q(i.begin-1),n>c&&(d=String.fromCharCode(g),j[c].test(d))){if(t(c),C[c]=d,z(),e=q(c),f){var k=function(){a.proxy(a.fn.caret,B,e)()};setTimeout(k,0)}else { B.caret(e); }i.begin<=m&&h()}b.preventDefault()}}}function y(a,b){var c;for(c=a;b>c&&n>c;c++){ j[c]&&(C[c]=p(c)) }}function z(){B.val(C.join(""))}function A(a){var b,c,d,e=B.val(),f=-1;for(b=0,d=0;n>b;b++){ if(j[b]){for(C[b]=p(b);d++<e.length;){ if(c=e.charAt(d-1),j[b].test(c)){C[b]=c,f=b;break} }if(d>e.length){y(b+1,n);break}}else { C[b]===e.charAt(d)&&d++,k>b&&(f=b); } }return a?z():k>f+1?g.autoclear||C.join("")===D?(B.val()&&B.val(""),y(0,n)):z():(z(),B.val(B.val().substring(0,f+1))),k?b:l}var B=a(this),C=a.map(c.split(""),function(a,b){return"?"!=a?i[a]?p(b):a:void 0}),D=C.join(""),E=B.val();B.data(a.mask.dataName,function(){return a.map(C,function(a,b){return j[b]&&a!=p(b)?a:null}).join("")}),B.one("unmask",function(){B.off(".mask").removeData(a.mask.dataName)}).on("focus.mask",function(){if(!B.prop("readonly")){clearTimeout(b);var a;E=B.val(),a=A(),b=setTimeout(function(){z(),a==c.replace("?","").length?B.caret(0,a):B.caret(a)},10)}}).on("blur.mask",v).on("keydown.mask",w).on("keypress.mask",x).on("input.mask paste.mask",function(){B.prop("readonly")||setTimeout(function(){var a=A(!0);B.caret(a),h()},0)}),e&&f&&B.off("input.mask").on("input.mask",u),A()})}})});
// function validateBik(bik, error) {
// 	var result = false;
// 	if (typeof bik === 'number') {
// 		bik = bik.toString();
// 	} else if (typeof bik !== 'string') {
// 		bik = '';
// 	}
// 	if (!bik.length) {
// 	/*	error.code = 1;
// 		error.message = 'БИК пуст';*/
// 	} else if (/[^0-9]/.test(bik)) {
// 	/*	error.code = 2;
// 		error.message = 'БИК может состоять только из цифр';*/
// 	} else if (bik.length !== 9) {
// 	/*	error.code = 3;
// 		error.message = 'БИК может состоять только из 9 цифр';*/
// 	} else {
// 		result = true;
// 	}
// 	return result;
// }
//
// function validateInn(inn, error) {
// 	var result = false;
// 	if (typeof inn === 'number') {
// 		inn = inn.toString();
// 	} else if (typeof inn !== 'string') {
// 		inn = '';
// 	}
// 	if (!inn.length) {
// 		/*error.code = 1;
// 		error.message = 'ИНН пуст';*/
// 	} else if (/[^0-9]/.test(inn)) {
// 		/*error.code = 2;
// 		error.message = 'ИНН может состоять только из цифр';*/
// 	} else if ([10, 12].indexOf(inn.length) === -1) {
// 		/*error.code = 3;
// 		error.message = 'ИНН может состоять только из 10 или 12 цифр';*/
// 	} else {
// 		var checkDigit = function (inn, coefficients) {
// 			var n = 0;
// 			for (var i in coefficients) {
// 				n += coefficients[i] * inn[i];
// 			}
// 			return parseInt(n % 11 % 10);
// 		};
// 		switch (inn.length) {
// 			case 10:
// 				var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
// 				if (n10 === parseInt(inn[9])) {
// 					result = true;
// 				}
// 				break;
// 			case 12:
// 				var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
// 				var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
// 				if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
// 					result = true;
// 				}
// 				break;
// 		}
// 		if (!result) {
// 			/*error.code = 4;
// 			error.message = 'Неправильное контрольное число';*/
// 		}
// 	}
// 	return result;
// }
//
// function validateKpp(kpp, error) {
// 	var result = false;
// 	if (typeof kpp === 'number') {
// 		kpp = kpp.toString();
// 	} else if (typeof kpp !== 'string') {
// 		kpp = '';
// 	}
// 	if (!kpp.length) {
// 		error.code = 1;
// 		error.message = 'КПП пуст';
// 	} else if (kpp.length !== 9) {
// 		error.code = 2;
// 		error.message = 'КПП может состоять только из 9 знаков (цифр или заглавных букв латинского алфавита от A до Z)';
// 	} else if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
// 		error.code = 3;
// 		error.message = 'Неправильный формат КПП';
// 	} else {
// 		result = true;
// 	}
// 	return result;
// }
//
// function validateKs(ks, bik, error) {
// 	var result = false;
// 	if (validateBik(bik, error)) {
// 		if (typeof ks === 'number') {
// 			ks = ks.toString();
// 		} else if (typeof ks !== 'string') {
// 			ks = '';
// 		}
// 		if (!ks.length) {
// 			error.code = 1;
// 			error.message = 'К/С пуст';
// 		} else if (/[^0-9]/.test(ks)) {
// 			error.code = 2;
// 			error.message = 'К/С может состоять только из цифр';
// 		} else if (ks.length !== 20) {
// 			error.code = 3;
// 			error.message = 'К/С может состоять только из 20 цифр';
// 		} else {
// 			var bikKs = '0' + bik.toString().slice(4, 6) + ks;
// 			var checksum = 0;
// 			var coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
// 			for (var i in coefficients) {
// 				checksum += coefficients[i] * (bikKs[i] % 10);
// 			}
// 			if (checksum % 10 === 0) {
// 				result = true;
// 			} else {
// 				error.code = 4;
// 				error.message = 'Неправильное контрольное число';
// 			}
// 		}
// 	}
// 	return result;
// }
//
// function validateOgrn(ogrn, error) {
// 	var result = false;
// 	if (typeof ogrn === 'number') {
// 		ogrn = ogrn.toString();
// 	} else if (typeof ogrn !== 'string') {
// 		ogrn = '';
// 	}
// 	if (!ogrn.length) {
// 		error.code = 1;
// 		error.message = 'ОГРН пуст';
// 	} else if (/[^0-9]/.test(ogrn)) {
// 		error.code = 2;
// 		error.message = 'ОГРН может состоять только из цифр';
// 	} else if (ogrn.length !== 13) {
// 		error.code = 3;
// 		error.message = 'ОГРН может состоять только из 13 цифр';
// 	} else {
// 		var n13 = parseInt((parseInt(ogrn.slice(0, -1)) % 11).toString().slice(-1));
// 		if (n13 === parseInt(ogrn[12])) {
// 			result = true;
// 		} else {
// 			error.code = 4;
// 			error.message = 'Неправильное контрольное число';
// 		}
// 	}
// 	return result;
// }
//
// function validateOgrnip(ogrnip, error) {
// 	var result = false;
// 	if (typeof ogrnip === 'number') {
// 		ogrnip = ogrnip.toString();
// 	} else if (typeof ogrnip !== 'string') {
// 		ogrnip = '';
// 	}
// 	if (!ogrnip.length) {
// 		error.code = 1;
// 		error.message = 'ОГРНИП пуст';
// 	} else if (/[^0-9]/.test(ogrnip)) {
// 		error.code = 2;
// 		error.message = 'ОГРНИП может состоять только из цифр';
// 	} else if (ogrnip.length !== 15) {
// 		error.code = 3;
// 		error.message = 'ОГРНИП может состоять только из 15 цифр';
// 	} else {
// 		var n15 = parseInt((parseInt(ogrnip.slice(0, -1)) % 13).toString().slice(-1));
// 		if (n15 === parseInt(ogrnip[14])) {
// 			result = true;
// 		} else {
// 			error.code = 4;
// 			error.message = 'Неправильное контрольное число';
// 		}
// 	}
// 	return result;
// }
//
// function validateRs(rs, bik, error) {
// 	var result = false;
// 	if (validateBik(bik, error)) {
// 		if (typeof rs === 'number') {
// 			rs = rs.toString();
// 		} else if (typeof rs !== 'string') {
// 			rs = '';
// 		}
// 		if (!rs.length) {
// 			/*error.code = 1;
// 			error.message = 'Р/С пуст';*/
// 		} else if (/[^0-9]/.test(rs)) {
// 			/*error.code = 2;
// 			error.message = 'Р/С может состоять только из цифр';*/
// 		} else if (rs.length !== 20) {
// 			/*error.code = 3;
// 			error.message = 'Р/С может состоять только из 20 цифр';*/
// 		} else {
// 			var bikRs = bik.toString().slice(-3) + rs;
// 			var checksum = 0;
// 			var coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
// 			for (var i in coefficients) {
// 				checksum += coefficients[i] * (bikRs[i] % 10);
// 			}
// 			if (checksum % 10 === 0) {
// 				result = true;
// 			} else {
// 				/*error.code = 4;
// 				error.message = 'Неправильное контрольное число';*/
// 			}
// 		}
// 	}
// 	return result;
// }
//
// function validateSnils(snils, error) {
// 	var result = false;
// 	if (typeof snils === 'number') {
// 		snils = snils.toString();
// 	} else if (typeof snils !== 'string') {
// 		snils = '';
// 	}
// 	if (!snils.length) {
// 		error.code = 1;
// 		error.message = 'СНИЛС пуст';
// 	} else if (/[^0-9]/.test(snils)) {
// 		error.code = 2;
// 		error.message = 'СНИЛС может состоять только из цифр';
// 	} else if (snils.length !== 11) {
// 		error.code = 3;
// 		error.message = 'СНИЛС может состоять только из 11 цифр';
// 	} else {
// 		var sum = 0;
// 		for (var i = 0; i < 9; i++) {
// 			sum += parseInt(snils[i]) * (9 - i);
// 		}
// 		var checkDigit = 0;
// 		if (sum < 100) {
// 			checkDigit = sum;
// 		} else if (sum > 101) {
// 			checkDigit = parseInt(sum % 101);
// 			if (checkDigit === 100) {
// 				checkDigit = 0;
// 			}
// 		}
// 		if (checkDigit === parseInt(snils.slice(-2))) {
// 			result = true;
// 		} else {
// 			error.code = 4;
// 			error.message = 'Неправильное контрольное число';
// 		}
// 	}
// 	return result;
// }
/*popup settings:
showPopup ({
            title: 'Заголовок модального окна', //не обязательный
            text: 'Текст модального окна', //не обязательный
            //кнопки в модалке - массив объектов, не обязательный (по умолчанию будет кнопка ok, каждый объект создает новую кнопку)
            //классы для ссылок:
            //reloadapp - перезагружает страницу
            //closepopup - закрывает модалку(по умолчанию)
            links: [{
                    link_text:'Нет',
                    link_class:'no',
                    link: '#',
                },
                {
                    link_text:'Да',
                    link_class:'yes',
                    link: '#',
                }],
            classes: 'class1 class2' //Классы для модалки если нужно, не обязательный
        }); 


 */
function showPopup (object) {
    if(!object.title && object.title != '') {
        object.title = 'Внимание';
    }
    if(!object.text && object.text != '') {
        object.text = '';
    }
    if(!object.links) {
        object.links = [{
            link_text: 'ok',
            link_class: 'closepopup',
            link: '#',
        }];
    }
    if(!object.classes) {
        object.classes = '';
    } 
    var links = '';
    var leng = object.links.length;
    //генерим кнопки
    for (var i =0; i<leng;i++) {
        links += '<a href="'+object.links[i].link+'" class="'+object.links[i].link_class+'">'+object.links[i].link_text+'</a>';
    }
    //добавляем класс к попапу
    $('#popup').addClass(object.classes);
    //добавляем заголовок
    $('#popup .popup-title').html(object.title);
    //добавляем текст
    $('#popup .popup-text').html(object.text);
    //добавляем кнопки
    $('#popup .popup-buttons').html(links);
    //показываем фон и модалку
    $('.popup-bg').fadeIn(200);
    $('#popup').slideDown(300);
}

function closePopup() {
    $('#popup').removeClass();
    $('.popup-bg').fadeOut(200);
    $('#popup').slideUp(300);
    //$('#app-docks-modal').slideUp(300);
}
$(document).on('click', '.get-pdf', function(e){
    e.preventDefault();
    var type = $(this).attr('data-type');
    //let id = $('input[name=uuid]').val();
    var id = $(this).attr('href');
    getPDF(id,type);
});

$(document).on('click', '.get-dogovor', function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    getDogovor(id);
});
$(document).on('click', '.get-docs-1', function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $('.docs-1').slideToggle(200);
});


function getPDF (id, type) {
    $.ajax({
        type: 'GET',
        url: api+'/api/v1/getTemplate?'+ new Date().getTime(),
        data: {"techId": id, "type":type},
        beforeSend: function () {
            $('#doc_modal .print_template').html(preloader);
        },
        success: function (data) {
            console.log(data);
            $('#doc_modal .print_template').html(data);
            $('#doc_modal').modal('show');
           /* data = jQuery.parseJSON(data);
            let url = '/main/getPrintPdf';
            if(data.success == true) {
                window.location = url;
            }
            console.log(data);*/
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });

}

function getDogovor (href) {
    $.ajax({
        type: 'GET',
        url: api+'/api/v1/getContractBody?'+ new Date().getTime(),
        data: {"href": href},
        beforeSend: function () {
        },
        success: function (data) {
            var b64 = data.body;
            if(b64 && b64 != '') {
                downloadPDF(b64);
            }
            console.log(data);
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}


function downloadPDF(pdf) {
    var linkSource = "data:application/pdf;base64," + pdf;
    var downloadLink = document.createElement("a");
    var fileName = "Documents.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

/* 
Выбор программ, настройки программ наценки, чгпс и пр.
 */
var programm_limit; //Переменная со всеми лимитами по программе

$(document).on('change', '#programm', function() {
   var programm = $(this).val(); 
   getProgrammSet(programm);
});
$(document).on('change', '#months', function() {
   var months = $(this).val(); 
   var programm = $('#programm').val();
   var summ = $('input[name=summ]').val();
   getProgrammSet(programm,summ,months,'','months');
   var id = $('input[name=app_id]').val();
   getClientBirth(id);
});
$(document).on('change', '#avans', function() {
   var avans = $(this).val(); 
   var months = $('#months').val();
   var programm = $('#programm').val();
   var summ = $('input[name=summ]').val();
   getProgrammSet(programm,summ,months,avans,'avans');
});
$(document).on('change', 'input[name=summ]', function() {
   var summ = digitsOnly($(this)); 
   var programm = $('#programm').val();
   var months = $('#months').val();
   var avans = $('#avans').val();
   if(!programm || summ == 0) {
   } else {
    getProgrammSet(programm,summ,months,avans,'sum');
   }
});

$(document).on('change', '#ins_block input[type=checkbox], #partner_installment, #sms_inform', function() {
    setValues();
    //mainCalc();
});
$(document).on('change,blur', '#avans_to_partner', function() {
    //setValues();
    mainCalc();
});

function getProgrammSet(programm, summ, months, avans, type) {
    console.log(type);
    var accounting_avans = $('input[name=accounting_avans]').val();
    $.ajax({
        type: 'POST',
        url: 'user/getProgramm?'+ new Date().getTime(),
        data: {programm:programm, summ:summ, month:months, avans: avans, accounting_avans: accounting_avans},
        beforeSend: function () {
            //Прелоадер
            $('#second_form').prepend('<div class="blocker">'+preloader+"</div>");
        },
        success: function (data) {
            $('.blocker').remove(); //Убираем прелоадер
            data = jQuery.parseJSON(data);
            console.log(data);
            if(data.error == true) { //Если ошибка
                showPopup({text:data.error_msg});
                $('#programm option').eq(0).prop('selected', true); //сбрасываем программы
            } else {
                //Костыль для всех программ сроком до 3 месяцев
                months <= 3 ? $('input[name=InsJob]').prop('disabled',true) : $('input[name=InsJob]').prop('disabled',false);
                //Параметр для спец программ, где аванс не учавствует в отборе (Ювелирка и т.п.)
                
                //Подстановка наценки и чгпс
                if(!type) {
                    programmSettings(data); //Расстановка галок допов
                    //Установка кол-ва месяцев
                    setMonths(data);
                    //Установка авансовых платежей
                    setAvans(data);
                    setValues(); //Подстановка коэфициентов
                    //setInsVal(data); //Подстановка страховок кредитных
                } else if (type == 'months'){
                    setAvans(data);
                    setValues();//Подстановка коэфициентов
                    //setInsVal(data); //Подстановка страховок кредитных
                } else if(type == 'avans') {
                    setValues();//Подстановка коэфициентов
                } else {
                    setAvans(data);
                    setValues();//Подстановка коэфициентов
                    //setInsVal(data); //Подстановка страховок кредитных
                }
            }
            
        },
        error: function (xhr, str) {
            $('.blocker').remove();//Убираем прелоадер
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

//Установка кол-ва месяцев из данных о программе
function setMonths(obj) {
    var months_string = '';
    var months_array = [];
    $.each(obj.programms, function(index,val) {
        months_array.push(parseInt(val.month));
    });
    //Оставляем уникальные значения и сортируем массив
    months_array = array_uniq(months_array).sort(compareNumeric);
    $.each(months_array, function(index,val) {
        months_string+='<option value="'+val+'">'+val+'</option>';
    });
    $('select[name=months]').html(months_string);
}


function setAvans(obj) {
    var avans_array = [];
    var avans_string;
    console.log(obj);
    //Установка авансовых платежей
    $.each(obj.programms, function(index,val) {
        avans_array.push(parseFloat(val.avans));
    });
    //Оставляем уникальные значения и сортируем массив
    avans_array = array_uniq(avans_array).sort(compareNumeric);
    $.each(avans_array, function(index,val) {
        avans_string+='<option value="'+val+'">'+val+'</option>';
    });
    $('select[name=avans]').html(avans_string);
}

function setValues() {
    var months = $('#months').val(); 
    var programm = $('#programm').val();
    var summ = $('input[name=summ]').val();
    var avans = $('#avans').val();
    var accounting_avans = $('input[name=accounting_avans]').val();
    $.ajax({
        type: 'POST',
        url: 'user/getProgramm?'+ new Date().getTime(),
        data: {programm:programm, summ:summ, month:months, avans:avans, accounting_avans: accounting_avans},
        beforeSend: function () {
            //Прелоадер
            $('#second_form').prepend('<div class="blocker">'+preloader+"</div>");
        },
        success: function (data) {
            $('.blocker').remove(); //Убираем прелоадер
            data = jQuery.parseJSON(data);
            
            console.log(data);
            if(data.error == true) { //Если ошибка
                showPopup({text:data.error_msg});
                $('#programm option').eq(0).prop('selected', true); //сбрасываем программы
            } else {
                //Подстановка наценки и чгпс и др. параметров
                $('#chgps').val(data.programms[0].chgps); //чгпс
                $('#margin').val(data.programms[0].margin); //наценка
                $('#proc2client').val(data.programms[0].proc2client); //процент клиенту(непонятный параметр) 
                $('#partner_discount').val(data.programms[0].partner_discount);  //скидка от партнера
                $('#isPreferentialProgramm').val(data.programms[0].partner_discount); //зашита ли скидка в программе
                $('#discount').val(data.programms[0].discount);  //скидка от партнера
                //Подстановка стоимости смс если стоит галка
                $('#sms_inform').attr('data-price',data.sms);
                //установка премии партнера
                $('input[name=partner_reward]').val(data.programms[0].partner_reward);
                //Установка лимитов
                programm_limit = data.limit_full;
                //Обнуление итераций перерачсета
                $('#iterations').val('0');
                //Спец параметр для расчета Ювелирки
                $('input[name=accounting_avans]').val(data.programms_set.accounting_avans);
                //Установка авансовых платежей
                setAvans(data);
                //Подстановка коэфициентов кредитных страховок
                $.each(data.insurance, function(index,val) {
                    switch (val.insurance) {
                        case 'life_insurance':
                          $('#ins_life').attr('data-margin',val.margin);
                          break;
                        case 'job_insurance':
                          $('#ins_life_plus').attr('data-margin',val.margin);
                          break;
                        case 'trauma_insurance':
                          $('#ins_trauma').attr('data-margin',val.margin);
                          break;
                        case 'komfort_insurance':
                          $('#ins_komfort').attr('data-margin',val.margin);
                          break;
                        default:
                      }
                });
                //$('#ins_life').val(data.insurance());
            }
           mainCalc();
        },
        error: function (xhr, str) {
            $('.blocker').remove();//Убираем прелоадер
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    }); 
}

function resetProgramm() {
    $('#programm option').eq(0).prop('selected', true);
}


function programmSettings(obj) {
    var settings = obj.programms_set;
    //Сбрасываем все допы
    //$('#ins_block input[type=checkbox]').prop('checked',false);
    //Расстановка галок 
    /*$('input[name=InsLife]').prop('checked',checkBoolean(settings.insurance_life_state));
    $('input[name=InsJob]').prop('checked',checkBoolean(settings.insurance_job_state));
    $('input[name=InsTraum]').prop('checked',checkBoolean(settings.insurance_traum_state));
    $('input[name=InsKomfort]').prop('checked',checkBoolean(settings.insurance_komfort_state));
    $('input[name=sms]').prop('checked',checkBoolean(settings.sms_state));*/
    $('input[name=partner_installment]').prop('checked',checkBoolean(settings.installments_state));
    $('#partner_installment_block').show();
    //Кр. страх + смс
    $('input[name=InsLife]').prop('checked',checkBooleanSC($('input[name=InsLife]').attr('data-sc'),checkBoolean(settings.insurance_life_state),checkBoolean(settings.insurance_life_enabled),checkBoolean(settings.insurance_life_visible)));
    $('input[name=InsJob]').prop('checked',checkBooleanSC($('input[name=InsJob]').attr('data-sc'),checkBoolean(settings.insurance_job_state),checkBoolean(settings.insurance_job_enabled),checkBoolean(settings.insurance_job_visible)));
    $('input[name=InsTraum]').prop('checked',checkBooleanSC($('input[name=InsTraum]').attr('data-sc'),checkBoolean(settings.insurance_traum_state),checkBoolean(settings.insurance_traum_enabled),checkBoolean(settings.insurance_traum_visible)));
    $('input[name=InsKomfort]').prop('checked',checkBooleanSC($('input[name=InsKomfort]').attr('data-sc'),checkBoolean(settings.insurance_komfort_state),checkBoolean(settings.insurance_komfort_enabled),checkBoolean(settings.insurance_komfort_visible)));
    $('input[name=sms]').prop('checked',checkBooleanSC($('input[name=sms]').attr('data-sc'),checkBoolean(settings.sms_state),checkBoolean(settings.insurance_sms_enabled),checkBoolean(settings.insurance_sms_visible)));
    //НК страховки
    $('input[name=bsplus_short]').attr('data-sc') === 'true' ? $('input[name=bsplus_short]').prop('checked',true) : $('input[name=bsplus_short]').prop('checked',false);
    $('input[name=bs_short]').attr('data-sc') === 'true' ? $('input[name=bs_short]').prop('checked',true) : $('input[name=bs_short]').prop('checked',false);
    $('input[name=prioritet_short]').attr('data-sc') === 'true' ? $('input[name=prioritet_short]').prop('checked',true) : $('input[name=prioritet_short]').prop('checked',false);
    $('input[name=hit_short]').attr('data-sc') === 'true' ? $('input[name=hit_short]').prop('checked',true) : $('input[name=hit_short]').prop('checked',false);
    $('input[name=hitplus_short]').attr('data-sc') === 'true' ? $('input[name=hitplus_short]').prop('checked',true) : $('input[name=hitplus_short]').prop('checked',false);
    $('input[name=covid]').attr('data-sc') === 'true' ? $('input[name=covid]').prop('checked',true) : $('input[name=covid]').prop('checked',false);
    $('input[name=covid_plus]').attr('data-sc') === 'true' ? $('input[name=covid_plus]').prop('checked',true) : $('input[name=covid_plus]').prop('checked',false);
    $('input[name=moment_protect]').attr('data-sc') === 'true' ? $('input[name=moment_protect]').prop('checked',true) : $('input[name=moment_protect]').prop('checked',false);
    $('input[name=moment_protect_plus]').attr('data-sc') === 'true' ? $('input[name=moment_protect_plus]').prop('checked',true) : $('input[name=moment_protect_plus]').prop('checked',false);
    
    //Расстановка доступности галок
    $('input[name=InsLife]').prop('disabled',!checkBoolean(settings.insurance_life_enabled));
    $('input[name=InsJob]').prop('disabled',!checkBoolean(settings.insurance_job_enabled));
    $('input[name=InsTraum]').prop('disabled',!checkBoolean(settings.insurance_traum_enabled));
    $('input[name=InsKomfort]').prop('disabled',!checkBoolean(settings.insurance_komfort_enabled));
    $('input[name=sms]').prop('disabled',!checkBoolean(settings.sms_enabled));
    //$('input[name=partner_installment]').prop('disabled',!checkBoolean(settings.installments_enabled));
    if(checkBoolean(settings.installments_enabled)) {
        if($('input[name=partner_installment]').attr('data-locked') == 'true') {
            $('input[name=partner_installment]').prop('checked',false);
            $('input[name=partner_installment] + label').removeAttr('for');
            $('#partner_installment_block').hide();
        } else {
            $('input[name=partner_installment] + label').attr('for','partner_installment');
            $('#partner_installment_block').show();
        }
    } else {
        $('input[name=partner_installment] + label').removeAttr('for');
        if($('input[name=partner_installment]').prop('checked')) {
            $('#partner_installment_block').show();
        } else {
            $('#partner_installment_block').hide();
        }
        
    }
    $('input[name=partner_installment]').css('disabled',!checkBoolean(settings.installments_enabled));
    //Расстановка видимости галок
    $('input[name=InsLife] + label').css({'display':(checkBoolean(settings.insurance_life_visible) ? 'block':'none')});
    $('input[name=InsJob] + label').css({'display':(checkBoolean(settings.insurance_job_visible) ? 'block':'none')});
    $('input[name=InsTraum] + label').css({'display':(checkBoolean(settings.insurance_traum_visible) ? 'block':'none')});
    $('input[name=InsKomfort] + label').css({'display':(checkBoolean(settings.insurance_komfort_visible) ? 'block':'none')});
    //Расстановка видимости полей
    $('#avans_block').css({'display':(checkBoolean(settings.avans_visible) ? 'inline-block':'none')});
    $('#partner_discount_block').css({'display':(checkBoolean(settings.partner_discount_visible) ? 'inline-block':'none')});
    $('#avans_to_partner').prop('readonly',!checkBoolean(settings.money_to_supplier_editable));
    //$('#avans_to_partner').prop('readonly',!checkBoolean(settings.money_to_supplier_editable));
    
    //Расстановка доступности полей
    $('#months').prop('readonly',!checkBoolean(settings.months_enabled));
    
    
    //Расстановка ограничений
    $('input[name=max_summ_tovar]').val(settings.max_summ_tovar);
    $('input[name=min_summ_tovar]').val(settings.min_summ_tovar);
    $('input[name=max_summ]').val(settings.max_summ);
    $('input[name=min_summ]').val(settings.min_summ);
    
    //Спец условия аванса
    $('input[name=accounting_avans]').val(settings.accounting_avans);
    console.log(obj.programms_set);
    
    /*Специальные условия из мастера*/
    if(($('input[name=sms]').attr('data-sc') == 'true' && !checkBoolean(settings.sms_state)) || checkBoolean(settings.sms_state)) {
        $('input[name=sms]').prop('checked',true) 
    } else {
        $('input[name=sms]').prop('checked',false);
    }
    
    $('input[name=bsplus_short]').attr('data-sc') == 'true' ? $('input[name=bsplus_short]').prop('checked',true) : $('input[name=bsplus_short]').prop('checked',false);
    /*
discount_visible: "0"
margin_visible: "1"
money_to_supplier_editable: "1"
overpayment_visible: "1"
*/

}

function checkBoolean(x) {
    if(x == '0' || x == 0) {
        return false;
    } else if (x == '1' || x == 1) {
        return true;
    }
}

function checkBooleanSC(sc,state,enabled,visible) { //sc - спец. условие; state - предустановка в программе; enabled - доступность в программе; visible - видимость в программе
    if(state == true || (sc == 'true' && state == true) || (sc == 'true' && state == false && enabled == true && visible == true)) {
        return true;
    } else {
        return false;
    }
}

//сравнение чисел
function compareNumeric(a, b) {
  if (a > b) { return 1; }
  if (a == b) { return 0; }
  if (a < b) { return -1; }
}
//Уникализация массива
function array_uniq(arr) {
    var r = {};
    return arr.filter(function (i){ return r[i]?!1:r[i]=!0; });
}

$(document).on('click','a.get-akt', function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    if(!$(this).hasClass('disabled')) {
        sendRecon(id);
    }
});

function sendRecon(id) {
    $.ajax({
        type: 'POST',
        url: 'main/sendRecon?'+ new Date().getTime(),
        data: {'id_app':id},
        beforeSend: function () {
        },
        success: function (data) {
            var res = $.parseJSON(data);
            console.log(res);
            if (res.sucess == true) {
                getApp();
            } else if (res.error == true) {
                showPopup ({
                    text: res.error_msg, //не обязательный
                    links: [{
                            link_text:'Закрыть',
                            link_class:'closepopup',
                            link: '#',
                        }],
                }); 
            }
            
        }
    });
}
window.resize = (function () {

	'use strict';

	function Resize() {
		//
	}

	Resize.prototype = {

		init: function(outputQuality) {
			this.outputQuality = (outputQuality === 'undefined' ? 0.8 : outputQuality);
		},

		photo: function(file, maxSize, outputType, callback) {

			var _this = this;

			var reader = new FileReader();
			reader.onload = function (readerEvent) {
				_this.resize(readerEvent.target.result, maxSize, outputType, callback);
			}
			reader.readAsDataURL(file);

		},

		resize: function(dataURL, maxSize, outputType, callback) {

			var _this = this;

			var image = new Image();
			image.onload = function (imageEvent) {

				// Resize image
				var canvas = document.createElement('canvas'),
					width = image.width,
					height = image.height;
				if (width > height) {
					if (width > maxSize) {
						height *= maxSize / width;
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width *= maxSize / height;
						height = maxSize;
					}
				}
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').drawImage(image, 0, 0, width, height);

				_this.output(canvas, outputType, callback);

			}
			image.src = dataURL;

		},

		output: function(canvas, outputType, callback) {

			switch (outputType) {

				case 'file':
					canvas.toBlob(function (blob) {
						callback(blob);
					}, 'image/jpeg', 0.8);
					break;

				case 'dataURL':
					callback(canvas.toDataURL('image/jpeg', 0.8));
					break;

			}

		}

	};

	return Resize;

}());

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
    var main_phone = $('input[name=phone_mobile]');
    if(main_phone.val() != '' && !main_phone.hasClass('notValid')) {
        $('input[name=sbp_phone]').val(main_phone.val());
        addClassValid($('input[name=sbp_phone]'), true);
    }
});

//Выбор банка
$(document).on('change', 'select[name=sbp_bank_id_a]', function(e){
    var bank_id = $(this).val();
    var form = $(this).attr('data-form');
    var bank_name = $(this).find('option:selected').text();
    //console.log(form);
    if(bank_id && bank_id != '') {
        $(form+' input[name=sbp_bank_text_a]').val(bank_name);
    }
});

//галка нет СБП
$(document).on('change', '#main_form input[name=sbp_available_checkbox]', function(e){
    var checked = $(this).prop('checked');
    if(checked) {
        $('#main_form input[name=sbp_available]').val(0);
    } else {
        $('#main_form input[name=sbp_available]').val(1);
    }
    $('#main_form input[name=sbp_available]').trigger('change');
});

$(document).on('change', '#main_form input[name=sbp_available]', function(){
    var sbp_available = $(this).val() == 1 ? false : true;
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
    var checked = $(this).prop('checked');
    var form = $(this).attr('data-form');
    var idApp = $('#second_form input[name=app_id]').val();
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
    var checked = $(this).prop('checked');
    var form = $(this).attr('data-form');
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
    var checked = $(this).prop('checked');
    var form = $(this).attr('data-form');
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
    var phone = $(this).attr('data-phone');
    var id_app = $(this).attr('href');
    if(!$(this).hasClass('disabled')) {
        $('#sbp-payout-modal').slideDown(200);
        $('body').addClass('modal-open');
        $('#sbp-payout-form input[name=id_app]').val(id_app);
        $('#sbp-payout-form input[name=sbp_phone]').val(phone);
    }
});

$(document).on('click', '.accept-sbp-agreement', function(e) {
   var id_app = $('input[name=uuid]').val();
   var phone = $('#sbp-payout-form input[name=sbp_phone]').val();
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
   var val = $(this).val();
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
    var id_app = $('input[name=uuid]').val();
    var data = createArrayCodes(form);
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
            var json = data;
            var url = '/';
            //console.log(json);
            if(json.error == true) {
                showPopup({text:json.error_msg});
            } else if (json.success == true) {
                location.reload();
            } else {
                var errors = 0;
                $.each(json, function(key, value){
                    if(value.error || value.status != 3) {
                        addClassValid(form.find('input[name='+key+']'),false);
                        errors++;
                    }
                });
                if(errors > 0) {
                    showPopup({text:'Неверный код подтверждения.'});
                } else {
                    var text = 'Запрос на перевод клиенту выполнен успешно.';

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
        var val = $(this).val() != 'Потребительские нужды' ? true : false;;
        if(val) {
           $('#spending_aim_else').modal('show');
           $('input[name=spending_aim_else]').val($(this).val());
        }
    });
    $('#confirm_spending_aim').click(function(){
        var value = $('input[name=spending_aim_else]').val().trim();
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
            var array = $('#main_form').serializeArray(); // Encodes the set of form elements as an array of names and values.
            var json = {};
            $.each(array, function () {
                if(this.name.includes('[]')) {
                    var pureName = this.name.replace('[]','');
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
    var array = $('#updateOrder').serializeArray(); // Encodes the set of form elements as an array of names and values.
    var json = {};
    $.each(array, function () {
            json[this.name] = this.value || "";
    });
    sendUpdate(json);
});

// Отправка обновленных данных
function sendUpdate(data) {
    var json = JSON.stringify(data);
    var uuid = $('input[name=uuid]').val();
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
    var token = $('#csrf').val();
    var json = JSON.stringify(data);
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
                    var json = data.data;
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

function lgotniyCalc(programm, summ, avans) {
	var margArray = [];
	var percent = 0;
	var cycle = 0;
	console.log(programm);
	if (programm.includes("Льготный")) {
		switch (programm) {
			case 'Льготный 3 мес':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.04;
				margArray[0] = 0.0456;
				margArray[1] = 0.0076;
				margArray[2] = 0.0076;
				margArray[3] = 0.0554;
				margArray[4] = 0.0256;
				margArray[5] = 0.0235;
				margArray[6] = 0.0226;
				margArray[7] = 0.0204;
				margArray[8] = 0.0215;
				margArray[9] = 0.0195;
				margArray[10] = 0.0183;
				margArray[11] = 0.0167;
				break;
			case 'Льготный 5 мес':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.07;
				margArray[0] = 0.0476;
				margArray[1] = 0.0160;
				margArray[2] = 0.0160;
				margArray[3] = 0.0160;
				margArray[4] = 0.0160;
				margArray[5] = 0.0539;
				margArray[6] = 0.0226;
				margArray[7] = 0.0204;
				margArray[8] = 0.0215;
				margArray[9] = 0.0195;
				margArray[10] = 0.0183;
				margArray[11] = 0.0167;
				break;
			case 'Льготный Супер 5':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0342;
				margArray[1] = 0.0315;
				margArray[2] = 0.0196;
				margArray[3] = 0.0145;
				margArray[4] = 0.0114;
				margArray[5] = 0.0416;
				margArray[6] = 0.0357;
				margArray[7] = 0.0317;
				margArray[8] = 0.026;
				margArray[9] = 0.0186;
				margArray[10] = 0.0132;
				margArray[11] = 0.0064;
				break;
			case 'Льготный Супер 6':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0382;
				margArray[1] = 0.0338;
				margArray[2] = 0.025;
				margArray[3] = 0.0198;
				margArray[4] = 0.0141;
				margArray[5] = 0.0121;
				margArray[6] = 0.0395;
				margArray[7] = 0.0349;
				margArray[8] = 0.0291;
				margArray[9] = 0.0188;
				margArray[10] = 0.0132;
				margArray[11] = 0.0061;
				break;
			case 'Льготный Супер 7':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0425;
				margArray[1] = 0.0397;
				margArray[2] = 0.0266;
				margArray[3] = 0.0201;
				margArray[4] = 0.0173;
				margArray[5] = 0.0119;
				margArray[6] = 0.0087;
				margArray[7] = 0.0393;
				margArray[8] = 0.0324;
				margArray[9] = 0.0226;
				margArray[10] = 0.0162;
				margArray[11] = 0.0074;
				break;
			case 'Льготный Супер 8':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1;
				margArray[0] = 0.0399;
				margArray[1] = 0.0357;
				margArray[2] = 0.0264;
				margArray[3] = 0.0245;
				margArray[4] = 0.0174;
				margArray[5] = 0.0155;
				margArray[6] = 0.0089;
				margArray[7] = 0.0071;
				margArray[8] = 0.0433;
				margArray[9] = 0.0323;
				margArray[10] = 0.023;
				margArray[11] = 0.0108;
				break;
			case 'Льготный Платинум 6':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1; //скидка партнера
				if (avans == 0) {
					margArray[0] = 0.0255;
					margArray[1] = 0.023;
					margArray[2] = 0.0185;
					margArray[3] = 0.0179;
					margArray[4] = 0.0147;
					margArray[5] = 0.0116;
					margArray[6] = 0.1028;
					margArray[7] = 0.0874;
					margArray[8] = 0.0691;
					margArray[9] = 0.0448;
					margArray[10] = 0.0332;
					margArray[11] = 0.0157;
				}
				if (avans == 10) {
					margArray[0] = 0.0382;
					margArray[1] = 0.0233;
					margArray[2] = 0.0188;
					margArray[3] = 0.0182;
					margArray[4] = 0.0146;
					margArray[5] = 0.0120;
					margArray[6] = 0.1066;
					margArray[7] = 0.0898;
					margArray[8] = 0.0587;
					margArray[9] = 0.0394;
					margArray[10] = 0.0339;
					margArray[11] = 0.0107;
				}
				if (avans == 20) {
					margArray[0] = 0.0535;
					margArray[1] = 0.0237;
					margArray[2] = 0.0192;
					margArray[3] = 0.0186;
					margArray[4] = 0.0155;
					margArray[5] = 0.0124;
					margArray[6] = 0.0928;
					margArray[7] = 0.0875;
					margArray[8] = 0.0590;
					margArray[9] = 0.0397;
					margArray[10] = 0.0343;
					margArray[11] = 0.0080;
				}


				break;
			case 'Льготный Платинум 10':
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				percent = 0.1418;//скидка партнера
				if (summa_zaim > 29999) {
					if (avans == 0) {
						margArray[0] = 0.0255;
						margArray[1] = 0.0239;
						margArray[2] = 0.0201;
						margArray[3] = 0.0205;
						margArray[4] = 0.0181;
						margArray[5] = 0.0158;
						margArray[6] = 0.0131;
						margArray[7] = 0.0114;
						margArray[8] = 0.0096;
						margArray[9] = 0.0073;
						margArray[10] = 0.082;
						margArray[11] = 0.0774;
						margArray[12] = 0.0766;
						margArray[13] = 0.0729;
						margArray[14] = 0.0515;
						margArray[15] = 0.0368;
						margArray[16] = 0.0253;
						margArray[17] = 0.0128;
					}
					if (avans == 10) {
						margArray[0] = 0.0382;
						margArray[1] = 0.0282;
						margArray[2] = 0.0204;
						margArray[3] = 0.0209;
						margArray[4] = 0.0185;
						margArray[5] = 0.0174;
						margArray[6] = 0.014;
						margArray[7] = 0.0123;
						margArray[8] = 0.0101;
						margArray[9] = 0.0069;
						margArray[10] = 0.0835;
						margArray[11] = 0.0769;
						margArray[12] = 0.0762;
						margArray[13] = 0.0727;
						margArray[14] = 0.0482;
						margArray[15] = 0.0308;
						margArray[16] = 0.0184;
						margArray[17] = 0.007;
					}
					if (avans == 20) {
						margArray[0] = 0.051;
						margArray[1] = 0.0392;
						margArray[2] = 0.021;
						margArray[3] = 0.0215;
						margArray[4] = 0.0192;
						margArray[5] = 0.018;
						margArray[6] = 0.0146;
						margArray[7] = 0.0129;
						margArray[8] = 0.0103;
						margArray[9] = 0.0077;
						margArray[10] = 0.0804;
						margArray[11] = 0.0731;
						margArray[12] = 0.0718;
						margArray[13] = 0.0677;
						margArray[14] = 0.0505;
						margArray[15] = 0.0229;
						margArray[16] = 0.0131;
						margArray[17] = 0.0057;
					}
				} else {
					if (avans == 0) {
						margArray[0] = 0.0255;
						margArray[1] = 0.0239;
						margArray[2] = 0.0201;
						margArray[3] = 0.0206;
						margArray[4] = 0.0183;
						margArray[5] = 0.016;
						margArray[6] = 0.0129;
						margArray[7] = 0.0112;
						margArray[8] = 0.0096;
						margArray[9] = 0.0074;
						margArray[10] = 0.0848;
						margArray[11] = 0.079;
						margArray[12] = 0.0702;
						margArray[13] = 0.0553;
						margArray[14] = 0.0413;
						margArray[15] = 0.0361;
						margArray[16] = 0.0248;
						margArray[17] = 0.0122;
					}
					if (avans == 10) {
						margArray[0] = 0.0382;
						margArray[1] = 0.0283;
						margArray[2] = 0.0205;
						margArray[3] = 0.021;
						margArray[4] = 0.0187;
						margArray[5] = 0.0176;
						margArray[6] = 0.0133;
						margArray[7] = 0.0116;
						margArray[8] = 0.01;
						margArray[9] = 0.0078;
						margArray[10] = 0.0857;
						margArray[11] = 0.0774;
						margArray[12] = 0.0723;
						margArray[13] = 0.054;
						margArray[14] = 0.0393;
						margArray[15] = 0.03;
						margArray[16] = 0.0182;
						margArray[17] = 0.0053;
					}
					if (avans == 20) {
						margArray[0] = 0.051;
						margArray[1] = 0.0393;
						margArray[2] = 0.0211;
						margArray[3] = 0.0217;
						margArray[4] = 0.0193;
						margArray[5] = 0.0183;
						margArray[6] = 0.0138;
						margArray[7] = 0.0122;
						margArray[8] = 0.0106;
						margArray[9] = 0.0083;
						margArray[10] = 0.0847;
						margArray[11] = 0.0757;
						margArray[12] = 0.070;
						margArray[13] = 0.0502;
						margArray[14] = 0.0338;
						margArray[15] = 0.0227;
						margArray[16] = 0.013;
						margArray[17] = 0.0035;
					}
				}
				break;
			case "Льготный с 4 равными платежами":
				percent = 0.04;//скидка партнера
				cycle = 3;
				margArray[0] = 0.0476;
				margArray[1] = 0.0063;
				margArray[2] = 0.0025;
				margArray[3] = 0.1176;
				margArray[4] = 0.1076;
				margArray[5] = 0.0768;
				margArray[6] = 0.0363;
				margArray[7] = 0.0278;
				margArray[8] = 0.023;
				margArray[9] = 0.0061;
				margArray[10] = 0.003;
				margArray[11] = 0.001;
				break;


			case "Льготный с 6 равными платежами":
				percent = 0.07;
				cycle = 5;
				margArray[0] = 0.0651;
				margArray[1] = 0.0135;
				margArray[2] = 0.0051;
				margArray[3] = 0.0048;
				margArray[4] = 0.0033;
				margArray[5] = 0.1245;
				margArray[6] = 0.1123;
				margArray[7] = 0.109;
				margArray[8] = 0.0712;
				margArray[9] = 0.0067;
				margArray[10] = 0.004;
				margArray[11] = 0.0018;
				break;
			default :
				percent = 0.04;
				cycle = /\d+/.exec(programm);
				cycle = Number(cycle[0]);
				margArray[0] = 0.0213;
				margArray[1] = 0.0107;
				margArray[2] = 0.0092;
				margArray[3] = 0.0076;
				margArray[4] = 0.0060;
				margArray[5] = 0.0060;
				margArray[6] = 0.01070;
				margArray[7] = 0.0408;
				margArray[8] = 0.0215;
				margArray[9] = 0.0195;
				margArray[10] = 0.0183;
				margArray[11] = 0.0167;
				break;
		}
		var total_sum = summ - avans - (summ*percent);
		//let summa_zaima = 0;
		var total_overpayment = 0;
		for(i=0;i<margArray.length;i++){
			total_overpayment += Math.round(total_sum * margArray[i]);
		}
		var monthly_payment = $('#monthly_installment').val();
		//let monthly_payment = Math.ceil((total_sum + total_overpayment ) / 12);
		if (programm.includes('Льготный с 4 равными платежами') ||
			programm.includes('Льготный с 6 равными платежами') )
		{
			console.log(total_sum, cycle);
			monthly_payment = Math.round((summ - avans) / cycle); //($summ - $avans_to_partner)/$cycle;
		}
		var date = new Date;
		var final_date = new Date(date.setMonth(date.getMonth()+cycle));
		var result = {
			total: summ - avans,
			monthly: monthly_payment,
			months: cycle,
			final: (summ - avans) - (monthly_payment * (cycle-1)),
			date: final_date.toLocaleDateString(),
		}
		console.log((total_sum + total_overpayment ) / 12);
		$('.logt-date span').text(result.date);
		$('.monthly-payment span').text(result.monthly + ' руб.');
		$('.final-payment span').text(result.final + ' руб.');
		$('.total-payment span').text(result.total + ' руб.');
		$('.logt-block').show();
		//return result;
	} else {
		$('.logt-block').hide();
		//return false;
	}
	var months = $('select[name=months]').val();
	fillTempForm(programm,months,summ,avans);
}
function fillTempForm(programm,months,summ,avans_to_partner) {
	//let months = $('select[name=months]').val();
	/*let programm = $('select[name=programm] option:selected').text()
	let summ = parseFloat($('input[name=summ]').val()); // сумма товара
	summ = summ ? summ : 0; //если сумма не указано, то 0
	var avans = parseFloat($('select[name=avans]').val()); //аванс
	let avans_to_partner = avans && avans != 0 ? parseFloat(((summ * avans) / 100).toFixed(2)) : 0;*/
	var login = $('input[name=login]').val();
	var overpayment = $('input[name=overpayment]').val();
	var summa_dogovor = $('input[name=summa_dogovor]').val();
	var summa_zaim = $('input[name=summa_zaim]').val();
	var monthly_payment = $('#monthly_installment').val();
	$('#temp_form').empty();
	$('#temp_form').append(createHiddenInput('programm',programm));
	$('#temp_form').append(createHiddenInput('months',months));
	$('#temp_form').append(createHiddenInput('summ',summ));
	$('#temp_form').append(createHiddenInput('avans_to_partner',avans_to_partner));
	$('#temp_form').append(createHiddenInput('monthly_installment',monthly_payment));
	$('#temp_form').append(createHiddenInput('login',login));
	$('#temp_form').append(createHiddenInput('overpayment',overpayment));
	$('#temp_form').append(createHiddenInput('summa_dogovor',summa_dogovor));
	$('#temp_form').append(createHiddenInput('summa_zaim',summa_zaim));
	$('#temp_form').attr('action', '/main/printPdfLgot');
	//$('#temp_form').submit();
}

function createHiddenInput(name, val) {
	return '<input type="hidden" name="'+name+'" value="'+val+'">';
}

/*$(document).ready(function(){
    let uuid = $('input[name=uuid]').val();
    if (uuid) {
        getApp(uuid);
        setInterval(function(){
            getApp(uuid);
        },30000);
    }

});*/

$(document).on('click', '.app-status', function(e){
    e.preventDefault();
    $('#app-docks-modal .annul-block').html('');
    var id = $(this).attr('data-id');
    var ref = $(this).attr('data-ref');
    var status = $(this).text();
    var comment = $(this).attr('data-comment');
    comment = b64_to_utf8(comment);
    var limit = $(this).attr('data-limit');
    var status_num = $(this).attr('data-statusnum');
    var app_date = $(this).attr('data-appdate');
    var today_date = $('#today').val();
    if(status_num != 208) {
        $('#app-docks-modal .status-info span').text(status);
        $('#app-docks-modal .limit-info span').text(limit);
        $('#app-docks-modal .comment-info span').html(comment);
        $('#app-docks-modal .get-pdf').attr('href',id);
        if(ref != 0) {
            $('#app-docks-modal .doc-string .dogovor').html('<a href="'+ref+'" class="get-dogovor">Договор</a>');
        }
        if(status_num == 204 && app_date == today_date) {
            $('#app-docks-modal .annul-block').html('<p>Клиент отказался от подписания договора займа? Нажмите <a data-status="'+status_num+'" class="annul" href="'+id+'">аннулировать договор</a></p>');
        } else if(status_num == 207) {
            //$('#app-docks-modal .annul-block').html('<p>Для аннуляции подписанного договора нажмите <a data-status="'+status_num+'" class="annul" href="'+id+'">аннулировать договор</a></p>');
            $('#app-docks-modal .annul-block').html('<p>Для аннуляции подписанного договора направьте заявление в операционный отдел</p>');
        }
        $('#app-docks-modal').slideDown(200);
        $('body').addClass('modal-open');
    }
});
$(document).on('click', '.pay-app', function(e){
    e.preventDefault();
});


$(document).on('click', '.annul', function(e){
    e.preventDefault();
    var status = $(this).attr('data-status');
    var id = $(this).attr('href');
    var warning_text = 'После аннуляции, подписание договора будет не доступно. Вы уверены, что хотите аннулировать договор?';
    var popup_class = 'annul_app';
    switch (status){
        case '204':
            warning_text = 'После аннуляции, подписание договора будет не доступно. Вы уверены, что хотите аннулировать договор?';
            popup_class = 'annul_app';
            break;
        case '207':
            warning_text = 'После аннуляции, подписание договора будет не доступно. Вы уверены, что хотите аннулировать договор?';
            popup_class = 'annul_app_207';
            break;
        default:
            warning_text = 'После аннуляции, подписание договора будет не доступно. Вы уверены, что хотите аннулировать договор?';
            popup_class = 'annul_app';
            break;
        }
    showPopup({
            title: 'Внимание', //не обязательный
            text: warning_text, //не обязательный
            links: [{
                    link_text:'Нет',
                    link_class:'closepopup',
                    link: '#',
                },
                {
                    link_text:'Да',
                    link_class:popup_class,
                    link: id,
                }],
        });
});


$(document).on('click', '.annul_app', function(e){
    e.preventDefault();
    closePopup();
    var id_app = $(this).attr('href');
    cancelAppConfirm(id_app);
});
$(document).on('click', '.annul_app_207', function(e){
    e.preventDefault();
    closePopup();
    var id_app = $(this).attr('href');
    cancelAppInit(id_app);
});
$(document).on('submit', '#cancelApp', function(e){
    e.preventDefault();
    checkAspCodes($('#cancelApp'),true);
});

$(document).on('click','.sign-app', function(e){
    e.preventDefault();
    //let id = $(this).attr('href');
    var id = $('input[name=uuid]').val();
    var stage = $(this).attr('data-stage');
    var clientPhone = $(this).attr('data-phone');
    showAspModal(id, stage, clientPhone);
});

function cancelAppInit(id_app) {
    $.ajax({
        type: 'POST',
        url: 'main/cancellMess?'+ new Date().getTime(),
        data: {'id_app':id_app},
        beforeSend: function () {
            $('#app-docks-modal').slideUp(200);
            $('body').removeClass('modal-open');
            setTimeout(function(){
               $('body').addClass('modal-open');
               $('#cancelApp-modal').slideDown(200);
               $('#cancelApp-modal input[name=id_app]').val(id_app);
               $('#cancelApp-modal .title').after('<div class="loading" data-loader="circle-side"></div>');
            }, 200);
        },
        success: function (data) {
           data = jQuery.parseJSON(data);
           if(data.success == true || data.success == 'true') {
               $('#cancelApp-modal .loading').remove();
               var json = [{"type":"cancelApp"}];
               $('#cancelApp-modal .docs-lines').html(buildListAsp(json,id_app));
           } else {
               console.log(data);
               showPopup({text:'Возникла ошибка: ' + data.error_msg});
           }
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}
//Аннуляция не подписанного договора
function cancelAppConfirm (id_app) {
    var url = '/';
    $.ajax({
        type: 'POST',
        url: 'main/cancellationApp?'+ new Date().getTime(),
        data: {'id_app':id_app},
        beforeSend: function () {
        },
        success: function (data) {
           data = jQuery.parseJSON(data);
           if(data.succes == true) {
               showPopup(
                    {
                title:'',
                text:'Договор успешно аннулирован.',
                links: [{
                    link_text:'OK',
                    link_class:'reloadapp',
                    link:  url,
                }]
                });
           } else {
               console.log(data);
               showPopup({text:'Возникла ошибка: ' + data.error_msg});
           }

        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

function getApp (uuid) {
    $.ajax({
        type: 'POST',
        url: api+'/api/v1/checkStatus?'+ new Date().getTime(),
        data: {uuid: uuid},
        beforeSend: function () {
            $('.applist-container').empty();
            $('.applist-container').prepend(preloader);
        },
        success: function (res) {
            console.log(res);
            $('.preloader').remove();
            data = res.data;
            var app_count = data.length;
            if(app_count != 0) {
                var app = '';
                $.each(data, function(key, value) {
                    console.log(key, value);
                    var button = ''; //кнопка "оформить","отправить", "подписать" и т.д.
                    var akt_button = ''; //кнопка акта сверки
                    var recon_available = false; //Есть или нет договор для акта сверки
                    recon_available = value.contract == 0 ? false : true;
                    var ref = value.Ref ? value.Ref : 0; //Есть ли прикрепленный файл
                    var frontStatus = value.front_status; //статус для отображения
                    var bki = value.bki == 0 ? false : true; //не исп.
                    var dogovor = value.dogovor == 0 ? false : true; //не исп.
                    var comment = value.DescriptionTemplate ? value.DescriptionTemplate : ''; //комментарий верификатора
                    var limit = value.approved_limit ? value.approved_limit : ''; //Доступный лимит
                    var limit_in_status = limit.slice(0,-3); //размер лимита в статусе
                    var signed = '';
                    var clientPhone = value.phone != '' && value.phone != null ? value.phone : 'клиента'; //номер телефона клиента
                    var sbpPhone = value.sbp_phone != '' && value.sbp_phone != null ? value.sbp_phone : 'клиента'; //номер телефона клиента
                    console.log(value);
                    var app_date_create = value.date_created ? value.date_created.split(' ')[0] : '';
                    var type_write = 0;
                    var sbp_payout = value.sbp_payout_status ? true : false;
                    var fio = String(value.fio);
                    var client_fio = fio.replace( /(<([^>]+)>)/ig, '').trim() == '' ? 'Недопустимое значение ФИО' : fio.replace( /(<([^>]+)>)/ig, '');
                    var mq_text = ''; //Заявки с шаблоном маникло - выделяем в тексте
                    var mq_calss = ''; //отдельный класс для маникло
                    var sbp_allowed = value.is_allowed_pefix == true ? true : false;

                    switch(value.type_write) {
                        case '0':
                            type_write = 0;
                        break;
                        case '1':
                            type_write = 'договор подписан АСП';
                        break;
                        case '2':
                            type_write = 'договор подписан вручную';
                        break;
                        case '3':
                            type_write = 'договор аннулирован';
                        break;
                }
                    try {
                        frontStatus = frontStatus.replace('{{limit}}', limit_in_status);
                    } catch (err) {
                    }
                    //console.log(dogovor);
                    /*if (ref != 0) {
                        frontStatus = 'Договор';
                    }*/
                    if(value.status == 107) { //временный костыль для теста будет статус 107
                        //frontStatus = 'Ожидает подписания';
                        button = '<a href="'+value.anket_id+'" data-phone="'+clientPhone+'" data-stage="1" class="sign-app">Подписать</a>';
                    }
                    if(value.status == 104 || value.status == 108) { //одобрен лимит (спец. условия)
                        button = '<a href="'+value.anket_id+'" data-sbp_allowed="'+sbp_allowed+'" class="go-step-2">Оформить</a>';
                        /*if(ref != 0 && dogovor == false){
                            button = '<a href="'+value.anket_id+'" data-type="dogovor" class="sign-app">Подписать</a>';
                        } else if (dogovor){
                            frontStatus = 'Подписано';
                            button = '<a href="'+value.anket_id+'" class="pay-app">Оплатить</a>';
                        }*/
                    }
                    if(value.status == 108 && isMoneyQlo(b64_to_utf8(comment))) {
                        mq_text = '-MQ- ';
                        mq_calss = 'mq';
                    }
                    if(value.status == 204 && ref != 0) { //одобрен второй этап и есть договор
                        if(recon_available) {
                            frontStatus = 'подпишите договор';
                            button = '<a href="'+value.anket_id+'" data-phone="'+clientPhone+'" data-stage="2" class="sign-app">Подписать</a>';
                        } else {
                            //frontStatus = 'подготовка договора';
                        }
                        signed = 'not-signed';

                        if(sbp_payout) {
                            if(sbp_allowed) {
                                akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+sbpPhone+'" data-stage="2" class="get-sbp-payout disabled">Клиенту СБП</a>';
                            } else {
                                akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+sbpPhone+'" data-stage="2" class="get-sbp-payout exclam disabled">Клиенту СБП</a>';
                            }
                        } else {
                            akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+clientPhone+'" data-stage="2" class="get-akt disabled">На оплату</a>';
                        }

                    }
                    if(value.status == 207) { //одобрен второй этап
                        signed = 'signed';
                        frontStatus = 'договор подписан';
                        if(type_write != 0) {
                            frontStatus = type_write;
                        }
                        if(value.type_write == '1' && sbp_payout && recon_available) {
                            if(sbp_allowed) {
                                akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+sbpPhone+'" data-stage="2" class="get-sbp-payout">Клиенту СБП</a>';
                            } else {
                                akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+sbpPhone+'" data-stage="2" class="get-sbp-payout exclam">Клиенту СБП</a>';
                            }
                        } else if(sbp_payout == false && recon_available == true) {
                            akt_button = '<a href="'+value.anket_id+'" data-phone="'+clientPhone+'" data-stage="2" class="get-akt">На оплату</a>';
                        } else if (sbp_payout && recon_available == false) {
                            if(sbp_allowed) {
                                akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+sbpPhone+'" data-stage="2" class="get-sbp-payout disabled">Клиенту СБП</a>';
                            } else {
                                akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+sbpPhone+'" data-stage="2" class="get-sbp-payout exclam disabled">Клиенту СБП</a>';
                            }
                        } else {
                            akt_button = '<a href="'+value.anket_id+'" title="Доступно после подписания договора" data-phone="'+clientPhone+'" data-stage="2" class="get-akt disabled">На оплату</a>';
                        }
                        //
                    }
                    if(value.status == 206) { //Если требуются уточнения
                         button = '<a href="'+value.anket_id+'" data-sbp_allowed="'+sbp_allowed+'" data-phone="'+clientPhone+'" class="go-step-2">Уточнить</a>';
                    }
                    if(value.status == 209) { //Если требуются уточнения перевод на карту
                         button = '<a href="'+value.anket_id+'" data-credit_card="true" data-sbp_allowed="'+sbp_allowed+'" data-phone="'+clientPhone+'" class="go-step-2">Уточнить</a>';
                    }
                    if(value.status == 303) { //Постановка на оплату СБП
                         button = '';
                    }
                    app += '<div class="app-info '+signed+'" id="'+value.anket_id+'">\n\
                            <div class="app-left-block"><div class="app-string">\n\
                                <div class="app-number">'+value.anket_id+'</div><div class="dot"></div>\n\
                                <div class="app-date">'+value.date_created+'</div>\n\
                            </div>\n\
                            <div class="client-fio">'+client_fio+'</div></div>\n\
                            <div class="app-right-block">\n\
                            <div data-ref="'+ref+'" data-appdate="'+app_date_create+'" data-comment="'+comment+'" data-statusnum="'+value.status+'" data-limit="'+limit+'" data-id="'+value.anket_id+'" class="'+mq_calss+' app-status status-'+value.status+'">'+mq_text+frontStatus+'</div>\n\
                            <div class="app-button">'+button+akt_button+'</div>\n\
                            </div></div>';
                  });
                $('.applist-container').append(app);
            } else {
                $('.applist-container').html('<span>Список заявок пуст.</span>');
            }
           // console.log(data);
        },
        error: function (xhr, str) {
            showPopup({text:'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}
function b64_to_utf8(str) {
    try {
        return decodeURIComponent(escape(window.atob(str)));
    } catch (err) {
        return str;
    }
}

function isMoneyQlo(string) {
    var match = 'Маникло';
    return string.indexOf(match) >= 0 ? true : false;
}

// //Проверка моб. телефона
// /*Проверка серии паспорта*/
// $(document).on('blur', '.serial_pass', function () {
//     checkPassSeria($(this));
// });
// /*Проверка номера паспорта*/
// $(document).on('blur', '.numm_pass', function () {
//     checkPassNumber($(this));
// });
// /*Проверка код подразделения*/
// $(document).on('blur', '#pass_code', function () {
//     checkPassCode($(this));
// });
// $(document).on('keyup', '#pass_code', function () {
//     $('[name=pass_whom]').val('');
// });
// /*Проверка даты рождения*/
// $(document).on('blur, change', '#bithday', function () {
//     //let date = dataFormat($(this).val());
//     if (dateValidate($(this).val())) {
//         let date = $(this).val();
//         if (fullYear(date) < 20 || fullYear(date) > 75) {
//             addClassValid($(this), false);
//         } else {
//             addClassValid($(this), true);
//             $("input[name=birthday]").val(dataFormat(date));
//         }
//         setSourceIncome();
//     } else {
//         addClassValid($(this), false);
//     }
// });
// /*Проверка место рождения*/
// $(document).on('keyup, blur', '.pass_birth_where, input[name=pass_whom]', function () {
//     $(this).removeClass('notValid');
//     var nameLngth = $(this).val().length;
//     var nameV = $(this).val();
//     if (nameLngth < 2) {
//         addClassValid($(this), false);
//     } else if (/[^0-9а-яА-ЯёЁ\ /.,|\\"!-]/.test(nameV)) {
//         addClassValid($(this), false);
//     } else {
//         addClassValid($(this), true);
//     }
// });
//
// /*Проверка даты паспорта*/
// $(document).on('blur, change', '#bithday, #data_pass', function () {
//     let birth = $('#bithday').val();
//     let pass_date = $('#data_pass').val();
//     if (birth != '' && pass_date != '' && checkCorrectDate(birth) && checkCorrectDate(pass_date)) {
//         addClassValid($('#data_pass'), passportCheck(birth, pass_date));
//         $("input[name=pass_date]").val(dataFormat(pass_date));
//     }
// });
//
// /*Проверка суммы*/
// $(document).on('blur, change', 'input[name=summ]', function () {
//     digitsOnly($(this));
//     checkSumm($(this));
// });
// //Аванс партнеру только цыфры
// $(document).on('keyup', '#avans_to_partner', function () {
//     digitsOnly($(this));
//     mainCalc();
// });
// /*Проверка дохода*/
// $(document).on('blur, change', 'input[name=job_salary]', function () {
//     digitsOnly($(this));
//     checkJob_salary($(this));
// });
//
// $(document).on('change', 'input[name=low_job_salary_accept], input[name=over_job_salary_accept]', function () {
//     digitsOnly($('input[name=job_salary]'));
//     checkJob_salary($('input[name=job_salary]'));
// });
//
//
// //Проверка аванса при спец. условиях (Ювелирка)
// $(document).on('input, blur', '#avans_to_partner', function () {
//     let sum = $('#allSumm').val();
//     let avans = $(this).val();
//     if (($('#specialOption').val() == 1 || $('#specialOption').val() == '1') && !$(this).attr('readonly')) {
//         addClassValid($('#avans_to_partner'), checkMinAvans(sum, avans))
//     }
//     ;
// });
//
// //Лимит 150+
// $(document).on('change', 'input[name=limit]', function () {
//     if ($(this).attr('id') == 'limit_150_plus') {
//         console.log();
//         showPopup({
//             title: 'Уточите размер лимита', //не обязательный
//             text: '<p class="text-center">Введите сумму более <br>150 000 рублей</p><input type="text" id="sum_max_limit" class="sum_limit_more_150" placeholder="Сумма руб.">', //не обязательный
//             //кнопки в модалке - массив объектов, не обязательный (по умолчанию будет кнопка ok, каждый объект создает новую кнопку)
//             //классы для ссылок:
//             //reloadapp - перезагружает страницу
//             //closepopup - закрывает модалку(по умолчанию)
//             links: [{
//                     link_text: 'Отмена',
//                     link_class: 'clear_max_limit',
//                     link: '#',
//                 },
//                 {
//                     link_text: 'Подтвердить',
//                     link_class: 'set_max_limit',
//                     link: '#',
//                 }],
//         });
//     } else {
//         resetMaxLimit();
//     }
// });
// $(document).on('click', '.set_max_limit', function () {
//     digitsOnly($('#sum_max_limit'));
//     let sum = $('#sum_max_limit').val();
//     if (sum <= 150000 || sum > 500000) {
//         addClassValid($('#sum_max_limit'), false);
//     } else {
//         setMaxLimit(sum);
//         closePopup();
//     }
// });
// $(document).on('click', '.clear_max_limit', function () {
//     resetMaxLimit();
//     closePopup();
// });
//
// /*Обработка галок "Источник доходов для погашения займа" и "Источник происхождения средств" - если все сняты*/
// $(document).on('change', '.repay_source', function () {
//     let checked_count = 0; //Количество установленый галок
//     $('.repay_source').each(function () {
//         if ($(this).prop('checked')) {
//             checked_count++;
//         }
//     });
//     if (checked_count == 0) {
//         $('#dohod_blank').prop('checked', true);
//     } else {
//         $('#dohod_blank').prop('checked', false);
//     }
// });
// $(document).on('change', '.income_source', function () {
//     let checked_count = 0; //Количество установленый галок
//     $('.income_source').each(function () {
//         if ($(this).prop('checked')) {
//             checked_count++;
//         }
//     });
//     if (checked_count == 0) {
//         $('#istok_blank').prop('checked', true);
//     } else {
//         $('#istok_blank').prop('checked', false);
//     }
// });
//
// $(document).on('change', 'input[name=clearing_payee_bankbik]', function () {
//     let bik = $(this).val();
//     addClassValid($(this), validateBik(bik));
// });
//
// $(document).on('change', '#second_form input[name=inn]', function () {
//     let inn = $(this).val();
//     addClassValid($(this), validateInn(inn));
// })
// $(document).on('change', 'input[name=clearing_payee_personalacc]', function () {
//     let rs = $(this).val();
//     let bic = $('input[name=clearing_payee_bankbik]').val();
//     addClassValid($(this), validateRs(rs, bic));
// })
//
//
//
//
// function setMaxLimit(sum) {
//     $('#limit_150_plus').val(sum);
//     $('#limit_150_plus + label').addClass('dobble-string').append('<span>(' + sum + ' руб.)</span>')
// }
// function resetMaxLimit() {
//     $('#limit_150_plus').val(500000).prop('checked', false);
//     $('#limit_150_plus + label').removeClass('dobble-string')
//     $('#limit_150_plus + label span').remove();
// }
//
// /*Проверка возраста и расстановка галок источник дохода*/
// function setSourceIncome() {
//     let age = $('input[name=birthdate]').val() != '' ? fullYear($('input[name=birthdate]').val()) : false; //возраст
//     console.log(age);
//     let gender = $('input[name=sex]').val() != '' ? $('input[name=sex]').val() : false; //пол
//     if (age && gender) {
//         if (gender == 'муж') { //условие для муж
//             if (age < 65) {
//                 $('#istok_rabota').prop('checked', true);
//                 $('#dohod_zp').prop('checked', true);
//                 $('#istok_social').prop('checked', false);
//                 $('#dohod_pensiya').prop('checked', false);
//             } else {
//                 $('#istok_rabota').prop('checked', false);
//                 $('#istok_social').prop('checked', true);
//                 $('#dohod_zp').prop('checked', false);
//                 $('#dohod_pensiya').prop('checked', true);
//             }
//         } else if (gender == 'жен') { //условие для жен
//             if (age < 60) {
//                 $('#istok_rabota').prop('checked', true);
//                 $('#dohod_zp').prop('checked', true);
//                 $('#istok_social').prop('checked', false);
//                 $('#dohod_pensiya').prop('checked', false);
//             } else {
//                 $('#istok_rabota').prop('checked', false);
//                 $('#istok_social').prop('checked', true);
//                 $('#dohod_zp').prop('checked', false);
//                 $('#dohod_pensiya').prop('checked', true);
//             }
//         } else {
//             //Не понятный пол ))
//             $('#istok_rabota').prop('checked', true);
//             $('#istok_social').prop('checked', false);
//         }
//     }
// }
//
// function digitsOnly(input) {
//     var digit = input.val().replace(/[^0-9 .]/g, "").trim();
//     digit = digit ? digit : 0;
//     console.log(parseFloat(digit).toFixed(0));
//     input.val(parseFloat(digit).toFixed(0));
//     console.log(parseFloat(digit).toFixed(0));
// }
// //Постановка классов valid notValid
// function addClassValid(object, valid) {
//     if (valid) {
//         object.removeClass('notValid').addClass('valid');
//     } else {
//         object.addClass('notValid').removeClass('valid');
//     }
// }
//
//
// //Преобразование даты в новый формат
// function dataFormat2(date) {
//     let date_array = date.split('-');
//     let new_date = date;
//     if (date_array.length > 1) {
//         new_date = date_array[2] + '.' + date_array[1] + '.' + date_array[0];
//     }
//     //console.log(date,new_date);
//     return new_date;
// }
// //Преобразование даты в новый формат
// function dataFormat(date) {
//     let date_array = date.split('.');
//     let new_date = date;
//     if (date_array.length > 1) {
//         new_date = date_array[2] + '-' + date_array[1] + '-' + date_array[0];
//     }
//     // console.log(date,new_date);
//     return new_date;
// }
//
// //Проверка серии паспорта
// function checkPassSeria(input) {
//     input.removeClass('notValid');
//     input.removeClass('valid');
//     input.val(input.val().replace(/\s+/g, ''));
//     var nameLngth = input.val().length;
//     var nameV = input.val().replace(/\s+/g, '');
//     if (nameLngth !== 4) { //длина 4 символа
//         addClassValid(input, false);
//         return false;
//     } else if (/[^0-9\ ]/.test(nameV)) { //только цифры
//         addClassValid(input, false);
//     } else if (checkRepeatNumber(nameV)) {
//         addClassValid(input, false);
//     } else {
//         addClassValid(input, true);
//     }
// }
// ;
// //Проверка номера паспорта
// function checkPassNumber(input) {
//     input.removeClass('notValid');
//     input.val(input.val().replace(/\s+/g, ''));
//     var nameLngth = input.val().length;
//     var nameV = input.val().replace(/\s+/g, '');
//     if (nameLngth !== 6) {
//         addClassValid(input, false);
//     } else if (/[^0-9\ ]/.test(nameV)) {
//         addClassValid(input, false);
//     } else if (checkRepeatNumber(nameV)) {
//         addClassValid(input, false);
//     } else {
//         addClassValid(input, true);
//     }
// }
// ;
//
// function checkPassCode(input) {
//     let code = input.val();
//     let data = $('[name=pass_whom]').val();
//     if (/^[0-9]{3}-[0-9]{3}$/.test(code) /*&& data != ''*/) {
//         addClassValid(input, true);
//     } else {
//         addClassValid(input, false);
//     }
// }
//
// function checkRepeatNumber(number) {
//     var x = parseInt(number.split('')[0]);
//     var y = parseInt(number.split('')[1]);
//     if (number.split('').length > 4) {
//         if (number / x == 111111 || number == '000000') {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         if ((number == 0 || number / x == 1111) && x != 1 && x != 2) {
//             return true;
//         } else if (x == 0 && y == 0) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }
//
// function fullValidationStep1() {
//
//     let errors = 0;
//     //Проверка на обязательные поля
//     $('#main_form input[data-need=1]').each(function () {
//         let val = $(this).val();
//         let valid = $(this).hasClass('valid');
//         if (val == '') {
//             valid = false;
//         }
//         let name = $(this).attr('name');
//         addClassValid($(this), valid);
//         if (valid == false) {
//             errors++;
//         }
//     });
//     //Проверка ФИО
//     if (!fioValidate()) {
//         errors++;
//         showPopup({text: 'Неверное значение ФИО'});
//     }
//     //Проверка лимитов
//     /*if (!$('input[name=limit]:checked').val()) {
//         errors++;
//         showPopup({text: 'Не выбран лимит!'});
//     }*/
//
//     //проверка СБП
//     if ($('#main_form input[name=sbp_phone]').length > 0 &&
//             ($('#main_form input[name=sbp_available]').val() == 1 && ($('#main_form input[name=sbp_phone]').val() == '' || $('#main_form select[name=sbp_bank_id_a]').val() == ''))) {
//         errors++;
//         showPopup({text: 'Не заполнены либо неверно заполнены поля в блоке СБП заемщика.'});
//     }
//
//     if ($("#pass_code").val().length > 7) {
//         errors++;
//         showPopup({text: 'Не верный код подразделения!'});
//     }
//     /*Проверка дохода*/
//     checkJob_salary($('input[name=job_salary]'));
//
//
//     //Проверка файлов
//     if ($('input[name=pass1_resized]').val() == '' || $('input[name=pass2_resized]').val() == '') {
//         errors++;
//         showPopup({text: 'Загружены не все фото паспорта'});
//     }
//
//     if (errors > 0) {
//         return false;
//     } else {
//         return true;
//     }
// }
//
// function fullValidationStep2() {
//     let errors = 0;
//     let prog = $('#programm').val();
//     let maxSummTovar = parseInt($('#max_summ_tovar').val());
//     let minSummTovar = parseInt($('#min_summ_tovar').val());
//     let summaTovar = parseInt($('#allSumm').val());
//     let maxSumm = parseInt($('#max_summ').val());
//     let minSumm = parseInt($('#min_summ').val());
//     let summaZaima = parseInt($('#summa_zaim').val());
//     let months = parseInt($('#months').val());
//     //Проверка лимита
//     checkLimitSumm($('input[name=summa_zaim'));
//
//     //Проверка номера карты
//     if($('input[name=bank_card_payout_status]').val() == 1) {
//         let input = $('input[name=bank_card_number]');
//         if(card_check(input.val())) {
//             addClassValid(input,true);
//             input.val(input.val().replace(/\D/g, ""));
//         }
//     }
//     //Проверка на обязательные поля
//     $('#second_form input[data-need=1]').each(function () {
//         let val = $(this).val();
//         let valid = $(this).hasClass('valid');
//         if (val == '') {
//             valid = false;
//         }
//         let name = $(this).attr('name');
//         addClassValid($(this), valid);
//         if (valid == false) {
//             errors++;
//         }
//     });
//     /*Проверка дохода*/
//     checkJob_salary($('input[name=job_salary]'));
//
//     //проверка СБП
//     if ($('#second_form input[name=sbp_payout_status]').val() == 1 &&
//             (($('#second_form input[name=sbp_phone]').val() == '' || $('#second_form select[name=sbp_bank_id_a]').val() == ''))) {
//         errors++;
//         showPopup({text: 'Не заполнены либо неверно заполнены поля в блоке "Перевод по СБП"'});
//     }
//
//
//     //Проверка файлов
//     if ($('input[name=pass1_resized]').val() == '' || $('input[name=pass2_resized]').val() == '') {
//         errors++;
//         showPopup({text: 'Загружены не все фото паспорта'});
//     } else {
//
//     }
//
//     //Проверка ограничений по суммам
//     if (maxSummTovar > minSummTovar && (summaTovar < minSummTovar || summaTovar > maxSummTovar))
//     {
//         showPopup({text: "Сумма товаров по данной программе должна быть от " + minSummTovar + " до " + maxSummTovar + "!"});
//         errors++;
//     }
//
//     if (maxSumm > minSumm && (summaZaima < minSumm || summaZaima > maxSumm))
//     {
//         showPopup({text: "Сумма займа по данной программе должна быть от " + minSumm + " до " + maxSumm + "!"});
//         errors++;
//     }
//
//     /*Максимальная сумма займа 500 000р. минимальная 1000*/
//     if (summaZaima > 500000 || summaZaima < 1000) {
//         showPopup({text: "Допустимая сумма займа от 1000р до 500 000р. "});
//         errors++;
//     }
//
//     /*Ограниченя для программ по сумме и сроку Стандартный займ, Стандарт *, Нал База ТТ - до 27000 макс срок 12 мес*/
//     if ((prog == 'Стандарт *' || prog == 'Стандартный Займ') && summaZaima < 27001 && months > 12) {
//         showPopup({text: "При сумме займа до 27 000р. по данной программе максимальный срок займа 12 мес.!"});
//         errors++;
//     }
//     /*Ограниченя для програме Нал База ТТ - срок больше 12 мес сумма от 27000 до 60 000 макс срок 12 мес*/
//     if (prog == 'Нал База ТТ' && (summaZaima <= 27000 || summaZaima > 60000) && months > 12) {
//         showPopup({text: "При сроке займа более 12-ти месяцев по данной программе ограничение по сумме от 27 001р. до 60 000р.!"});
//         errors++;
//     }
//     if (prog == 'Нал База ТТ' && summaZaima > 100000) {
//         showPopup({text: "Максимальная сумма займа по программе 100 000р."});
//         errors++;
//     }
//
//     //Проверка минимального аванса "Ювелирка" и т.п.
//     if (($('#specialOption').val() == 1 || $('#specialOption').val() == '1') && !$('#avans_to_partner').attr('readonly')) {
//         let sum = $('#allSumm').val();
//         let avans = $('#avans_to_partner').val();
//         if (checkMinAvans(sum, avans)) {
//             addClassValid($('#avans_to_partner'), true);
//         } else {
//             errors++;
//             addClassValid($('#avans_to_partner'), false);
//         }
//     }
//
//     //Проверка наличия адреса страхования
//     if (($('input[name=sber_nc_im_1').prop('checked') || $('input[name=sber_nc_im_2').prop('checked')) && $('input[name=insured_address]').val().length < 5) {
//         errors++;
//         addClassValid($('input[name=insured_address]'), false);
//     } else {
//         addClassValid($('input[name=insured_address]'), true);
//     }
//
//     if (errors > 0) {
//         return false;
//     } else {
//         return true;
//     }
// }
//
// function checkMinAvans(sum, avans) {
//     let so = specialOptions.filter(item => sum <= parseInt(item.max_summ) && sum >= parseInt(item.min_summ))[0];
//     //let so = specialOptions.filter(function(item) { return sum <= item.max_summ && sum >= item.min_summ; })[0];
//     // console.log(sum,avans);
//     let avansList = so.avans_linst;
//     let percent = avansList.replace("[", "").replace("]", "").split(',')[0];
//     //console.log(percent);
//     avans = avans == '' ? 0 : avans;
//     if (avans && avans != '' && avans >= sum * percent / 100) {
//         return true;
//     } else {
//         return false;
//     }
// }
//
// /*Проверка двойного отчества*/
// function checkDobleFatherName() {
//     var input = $('input[name=fio]').val();
//     if (input != '') {
//         var input_val = input.split(' ');
//         var dadata_val = [$('input[name=last_name]').val(), $('input[name=first_name]').val(), $('input[name=father_name]').val()];
//         let difference = input_val.filter(x => !dadata_val.includes(x)).concat(dadata_val.filter(x => !input_val.includes(x)));
//         console.log(difference);
//
//         if (difference.length > 1) {
//             addClassValid($('input[name=fio]'), false);
//             return false;
//         } else if (difference.length == 1) {
//             console.log(difference);
//             $('input[name=father_name]').val($('input[name=father_name]').val() + ' ' + difference[0]);
//         }
//     }
// }
// ;
//
// function checkSumm(input) {
//     let summ = parseInt(input.val());
//     let maxSumm = parseInt($('input[name=max_summ_tovar]').val());
//     let minSumm = parseInt($('input[name=min_summ_tovar]').val());
//
//     if (summ == 0 || summ < 1000) {
//         addClassValid(input, false);
//     } else {
//         if (maxSumm != 0) {
//             if (summ > maxSumm) {
//                 addClassValid(input, false);
//                 showPopup({text: 'Максимальная сумма товара по данной программе: ' + maxSumm + 'руб.'});
//             } else {
//                 addClassValid(input, true);
//             }
//         }
//         if (minSumm != 0) {
//             if (summ < minSumm) {
//                 addClassValid(input, false);
//                 showPopup({text: 'Минимальная сумма товара по данной программе: ' + minSumm + 'руб.'});
//             } else {
//                 addClassValid(input, true);
//             }
//         }
//         if (minSumm == 0 && maxSumm == 0) {
//             addClassValid(input, true);
//         }
//         //checkLimitSumm(input);
//         //checkLimitSumm($('input[name=summa_zaim'));
//     }
//
// }
//
// function checkJob_salary(input) {
//     /*let value = parseInt(input.val());
//      console.log(value);
//      if(value > 0) {
//      addClassValid(input,true);
//      } else {
//      addClassValid(input,false);
//      }*/
//
//     let summa = input.val().replace(/\s/g, '').trim();
//     let mrot = parseFloat($('input[name=mrot]').val().replace(/\s/g, '').trim());
//     let over_profit = parseFloat($('input[name=over_profit]').val().replace(/\s/g, '').trim());
//     let low_profit_accept = $('input[name=low_job_salary_accept]').prop('checked');
//     let overhight_profit_accept = $('input[name=over_job_salary_accept]').prop('checked');
//     console.log(low_profit_accept, overhight_profit_accept);
//     input.val(summa);
//     if (summa != '' && (summa < 8000 || summa > 500000)) {
//         addClassValid(input, false);
//         showPopup({text: 'Допустимый размер дохода от 8 000 до 500 000 руб'});
//     } else if (summa < mrot && low_profit_accept == false) {
//         $('#low-profit').show();
//         $('#hight-profit').hide();
//         $('#over_job_salary_accept').prop('checked', false);
//         showPopup({text: 'Подтвердите, что сумма дохода меньше МРОТ(' + mrot + 'руб.) или укажите иной размер дохода'});
//         addClassValid(input, false);
//     } else if (summa > over_profit && overhight_profit_accept == false) {
//         $('#hight-profit').show();
//         $('#low-profit').hide();
//         $('#low_job_salary_accept').prop('checked', false);
//         showPopup({text: 'Подтвердите, что сумма дохода больше ' + over_profit + 'руб. или укажите иной размер дохода'});
//         addClassValid(input, false);
//     } else if (summa >= mrot && summa <= over_profit) {
//         $('#low-profit').hide();
//         $('#hight-profit').hide();
//         $('#low_job_salary_accept').prop('checked', false);
//         $('#over_job_salary_accept').prop('checked', false);
//         addClassValid(input, true);
//     } else {
//         addClassValid(input, true);
//     }
//
//
// }
//
// function checkLimitSumm(input) {
//     //let summ = parseInt(input.val());
//     let summ = parseInt($('input[name=summa_zaim_for_validate').val());
//     let limit = parseInt($('input[name=current_limit]').val());
//     if (summ > limit) {
//         addClassValid(input, false);
//     } else {
//         addClassValid(input, true);
//     }
// }
//
// function checkMaxDate(date) {
//     let today = new Date();
//     let day = new Date(date);
//     console.log(day.getTime(), today.getTime());
//     if (day.getTime() > today.getTime()) {
//
//         return false;
//     } else {
//         return true;
//     }
// }
//
// /*Проверка возраста при страховках*/
// function checkAgeIns(birthday) {
//     let month = $('#months').val() ? $('#months').val() : 0;//$('input[name=birthdate]').val() != '' ? fullYear($('input[name=birthdate]').val()) : false; //возраст
//     let age = dataFormat2(birthday) != '' ? fullYear(dataFormat2(birthday)) : false; //возраст
//     let ageEndPolice = dataFormat2(birthday) != '' ? fullYear(dataFormat2(birthday), 0, month) : false; //возраст
//     console.log(birthday, age, ageEndPolice);
//     if ($('#bsplus').prop('checked') || $('#bs').prop('checked') && age) {
//         if (age > 69) {
//             showPopup({text: 'Ограничение по возрасту для выбранной программы страхования: 69 лет'});
//             $('#bsplus').prop('checked', false).trigger('change');
//             $('#bs').prop('checked', false).trigger('change');
//         }
//     }
//     if ($('#covid_1').prop('checked') || $('#covid_2').prop('checked') && age) {
//         if (age > 64) {
//             showPopup({text: 'Ограничение по возрасту для выбранной программы страхования: 64 года'});
//             $('#covid_1').prop('checked', false).trigger('change');
//             $('#covid_2').prop('checked', false).trigger('change');
//         }
//     }
//     if ($('#ins_trauma').prop('checked') || $('#ins_komfort').prop('checked') || $('#ins_life').prop('checked') && ageEndPolice) {
//         if (ageEndPolice > 68) {
//             showPopup({text: 'Ограничение по возрасту на момент окончания полиса: 68 лет'});
//             $('#ins_trauma').prop('checked', false).trigger('change');
//             $('#ins_komfort').prop('checked', false).trigger('change');
//             $('#ins_life').prop('checked', false).trigger('change');
//         }
//     }
//     if ($('#ins_life_plus').prop('checked') && ageEndPolice) {
//         if (ageEndPolice > 65) {
//             showPopup({text: 'Ограничение по возрасту на момент окончания полиса: 65 лет. Оформление будет продолжено без доп услуг'});
//             $('#ins_life_plus').prop('checked', false).trigger('change');
//         }
//     }
//     //addClassValid(input,false);
// }
// function getClientBirth(id) {
//     $.ajax({
//         type: 'POST',
//         url: '/user/getBithday?' + new Date().getTime(),
//         data: {'id': id},
//         beforeSend: function () {
//         },
//         success: function (data) {
//             let res = $.parseJSON(data);
//             if (res.success == true) {
//                 checkAgeIns(res.bithday);
//             }
//             //console.log(res);
//         },
//         error: function (xhr, str) {
//             showPopup({text: 'Возникла ошибка: ' + xhr.responseText});
//             return false;
//         }
//     });
// }
//
// //Плюсуем к возрасту срок займа
// /*function agePlusMonths(birthday,months){
//  let year_plus = 0; //сколько лет плюсуем
//  let month_plus = 0; //сколько месяцев плюсуем
//  if(months < 12) {
//  month_plus = months;
//  } else {
//  year_plus = ~~(months/12);
//  month_plus = months%12;
//  }
//
//  console.log(year_plus,month_plus);
//  return birthday;
//  }*/
//
// $.fn.setCursorPosition = function (pos) {
//     if ($(this).get(0).setSelectionRange) {
//         $(this).get(0).setSelectionRange(pos, pos);
//     } else if ($(this).get(0).createTextRange) {
//         var range = $(this).get(0).createTextRange();
//         range.collapse(true);
//         range.moveEnd('character', pos);
//         range.moveStart('character', pos);
//         range.select();
//     }
// }
//
// //Валидация поля фамилия имя и отчества в модальном онке ручного ввода
// $(document).on('input', 'input[name=manual_last_name]', function () {
//     let input = $(this);
//     if ($(this).val().trim() == '') {
//         $(this).val('');
//     }
//     $(this).removeClass('notValid');
//     $(this).removeClass('valid');
//     var nameLngth = $(this).val().trim().length;
//     var nameV = $(this).val().trim();
//     if (nameLngth <= 1) {
//         addClassValid(input, false);
//     } else if (/[^а-яА-ЯЁё\-]/.test(nameV)) {
//         addClassValid(input, false);
//     } else {
//         addClassValid(input, true);
//     }
// });
// $(document).on('input', 'input[name=manual_first_name]', function () {
//     let input = $(this);
//     if ($(this).val().trim() == '') {
//         $(this).val('');
//     }
//     $(this).removeClass('notValid');
//     $(this).removeClass('valid');
//     var nameLngth = $(this).val().trim().length;
//     var nameV = $(this).val().trim();
//     if (nameLngth <= 1) {
//         addClassValid(input, false);
//     } else if (!/^[а-яё]([а-яё\s\-]*[а-яё])?$/i.test(nameV)) {
//         addClassValid(input, false);
//     } else {
//         addClassValid(input, true);
//     }
// });
// $(document).on('input', 'input[name=manual_father_name]', function () {
//     let input = $(this);
//     if ($(this).val().trim() == '') {
//         $(this).val('');
//     }
//     $(this).removeClass('notValid');
//     $(this).removeClass('valid');
//     var nameLngth = $(this).val().trim().length;
//     var nameV = $(this).val().trim();
//     if (nameLngth <= 1) {
//         addClassValid(input, false);
//     } else if (/[^а-яА-ЯЁё \-]/.test(nameV)) {
//         addClassValid(input, false);
//     } else {
//         addClassValid(input, true);
//     }
// });
//
// //проверка номера карты
// $(document).on('input', 'input[name=bank_card_number]', function () {
//     $(this).val(cc_format($(this).val()));
//     let card_number = $(this).val();
//     addClassValid($(this),card_check(card_number));
// });
//
//
// function fioValidate() {
//     let f = $('input[name=last_name]').val().trim();
//     let i = $('input[name=first_name]').val().trim();
//     let o = $('input[name=father_name]').val().trim();
//     let res = true;
//
//     if (res) {
//         if (f.length <= 1) {
//             res = false;
//         } else if (/[^а-яА-ЯЁё\-]/.test(f)) {
//             res = false;
//         } else {
//             res = true;
//         }
//     }
//     if (res) {
//         if (i.length <= 1) {
//             res = false;
//         } else if (!/^[а-яё]([а-яё\s\-]*[а-яё])?$/i.test(i)) {
//             res = false;
//         } else {
//             res = true;
//         }
//     }
//
//     if (res) {
//         if($('input[name=noOtchesvo]').val() == 1) {
//             res = true;
//         } else if (o.length <= 1) {
//             res = false;
//         } else if (/[^а-яА-ЯЁё \-]/.test(o)) {
//             res = false;
//         } else {
//             res = true;
//         }
//     }
//
//     return res;
// }
// function dateValidate(input_date) {
//     let result = false;
//     let date = input_date.split('-');
//     let day = '';
//     let month = '';
//     let year = '';
//     let regexp = new RegExp('^((((0?[1-9].(0?[1-9]|1[0-2]))|([12][0-9].((0?[13-9])|1[0-2]))|(((1[0-9])|(2[0-8])).0?2)|(30.((0?[13-9])|1[0-2]))|(31.((0?[13578])|10|12))).[0-9]{4})|(29.0?2.(([0-9]{2}((0[48])|([2468][048])|([13579][26])))|((([02468][048])|([13579][26]))00))))$');
//     var validDate = regexp.test(input_date);
//     if (validDate) {
//         result = true;
//     } else {
//         result = false;
//     }
//     return result;
// }
//
// function card_check(card) {
//     let card_number = card.replace(/\D/g, "");
//     if (/[^0-9-\s]+/.test(card_number)) {
//         return false;
//     } else if(card_number.length < 16 || card_number.length > 19) {
//         return false;
//     } else {
//         const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
//         let len = card_number.length;
//         let bit = 1;
//         let sum = 0;
//         let val;
//
//         while (len) {
//           val = parseInt(card_number.charAt(--len), 10);
//           sum += (bit ^= 1) ? arr[val] : val;
//         }
//         return sum && sum % 10 === 0;
//     }
// }
// function cc_format(value) {
//     let val = value.replace(/\D/g, "");
//     let v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
//     let matches = v.match(/\d{16,19}/g);
//     let match = matches && matches[0] || ''
//     let parts = []
//     for (i=0, len=match.length; i<len; i+=4) {
//         parts.push(match.substring(i, i+4))
//     }
//     if (parts.length) {
//         return parts.join(' ')
//     } else {
//         return val
//     }
// }
//
// /*Валидация електронной почты*/
// $(document).on('click', '#confirm_email', function (e) {
//     e.preventDefault();
//     emailValidation($('input[name=email]').val());
// });
//
// function emailValidation (email){
//     $.ajax({
//         type: 'POST',
//         url: '/api/v1/validateEmail?'+ new Date().getTime(),
//         data: {'email': email},
//         beforeSend: function () {
//         },
//         success: function (res) {
//             console.log(res);
//             if(res.success) { // письмо отправлено
//                 $('#confirm_email').hide();
//                 $('#email_code_block').show();
//             } else { //письмо не отправлено
//                 $('#email_code_block').hide();
//                 $('#confirm_email').show();
//                 showPopup({text: 'Возникла ошибка: ', text: 'Попробуйте еще раз, или введите другой e-mail'});
//             }
//         },
//         error: function (xhr, str) {
//             showPopup({text: 'Возникла ошибка: ', text: xhr.responseText});
//             return false;
//         }
//     });
// }
//
// $(document).on('input', 'input[name=email_code]', function(){
//     digitsOnly($(this));
//     let code = $(this).val();
//     let email = $('input[name=email]').val();
//     if(code.length == 6){
//         emailCodeConfirm(email, code);
//     }
// });
//
// function emailCodeConfirm (email, code) {
//     $.ajax({
//         type: 'POST',
//         url: '/api/v1/checkValidateEmail?'+ new Date().getTime(),
//         data: {'email': email, 'code': code},
//         beforeSend: function () {
//         },
//         success: function (res) {
//             console.log(res);
//             if(res.success == true) {
//                 addClassValid($('input[name=email]'), true);
//                 addClassValid($('input[name=email_code]'), true);
//             } else {
//                 addClassValid($('input[name=email_code]'), false);
//             }
//         },
//         error: function (xhr, str) {
//             showPopup({text: 'Возникла ошибка: ', text: xhr.responseText});
//             return false;
//         }
//     });
// }
