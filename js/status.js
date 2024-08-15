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
    let id = $(this).attr('data-id');
    let ref = $(this).attr('data-ref');
    let status = $(this).text();
    let comment = $(this).attr('data-comment');
    comment = b64_to_utf8(comment);
    let limit = $(this).attr('data-limit');
    let status_num = $(this).attr('data-statusnum');
    let app_date = $(this).attr('data-appdate');
    let today_date = $('#today').val();
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
    let status = $(this).attr('data-status');
    let id = $(this).attr('href');
    let warning_text = 'После аннуляции, подписание договора будет не доступно. Вы уверены, что хотите аннулировать договор?';
    let popup_class = 'annul_app';
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
    let id_app = $(this).attr('href');
    cancelAppConfirm(id_app);
});
$(document).on('click', '.annul_app_207', function(e){
    e.preventDefault();
    closePopup();
    let id_app = $(this).attr('href');
    cancelAppInit(id_app);
});
$(document).on('submit', '#cancelApp', function(e){
    e.preventDefault();
    checkAspCodes($('#cancelApp'),true);
});

$(document).on('click','.sign-app', function(e){
    e.preventDefault();
    //let id = $(this).attr('href');
    let id = $('input[name=uuid]').val();
    let stage = $(this).attr('data-stage');
    let clientPhone = $(this).attr('data-phone');
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
               let json = [{"type":"cancelApp"}];
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
    let url = '/';
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
            let app_count = data.length;
            if(app_count != 0) {
                let app = '';
                $.each(data, function(key, value) {
                    console.log(key, value);
                    let button = ''; //кнопка "оформить","отправить", "подписать" и т.д.
                    let akt_button = ''; //кнопка акта сверки
                    let recon_available = false; //Есть или нет договор для акта сверки
                    recon_available = value.contract == 0 ? false : true;
                    let ref = value.Ref ? value.Ref : 0; //Есть ли прикрепленный файл
                    let frontStatus = value.front_status; //статус для отображения
                    let bki = value.bki == 0 ? false : true; //не исп.
                    let dogovor = value.dogovor == 0 ? false : true; //не исп.
                    let comment = value.DescriptionTemplate ? value.DescriptionTemplate : ''; //комментарий верификатора
                    let limit = value.approved_limit ? value.approved_limit : ''; //Доступный лимит
                    let limit_in_status = limit.slice(0,-3); //размер лимита в статусе
                    let signed = '';
                    let clientPhone = value.phone != '' && value.phone != null ? value.phone : 'клиента'; //номер телефона клиента
                    let sbpPhone = value.sbp_phone != '' && value.sbp_phone != null ? value.sbp_phone : 'клиента'; //номер телефона клиента
                    console.log(value);
                    let app_date_create = value.date_created ? value.date_created.split(' ')[0] : '';
                    let type_write = 0;
                    let sbp_payout = value.sbp_payout_status ? true : false;
                    let fio = String(value.fio);
                    let client_fio = fio.replace( /(<([^>]+)>)/ig, '').trim() == '' ? 'Недопустимое значение ФИО' : fio.replace( /(<([^>]+)>)/ig, '');
                    let mq_text = ''; //Заявки с шаблоном маникло - выделяем в тексте
                    let mq_calss = ''; //отдельный класс для маникло
                    let sbp_allowed = value.is_allowed_pefix == true ? true : false;

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
    let match = 'Маникло';
    return string.indexOf(match) >= 0 ? true : false;
}
