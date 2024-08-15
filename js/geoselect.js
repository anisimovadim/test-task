$(document).ready(function(){
    //Проверка на префикс
    //checkPoint();
    $('#geo-select input[type=radio]').change(function(){
        let prefix = $(this).attr('data-prefix');
        $('#geo-select input[name=prefix]').val(prefix);
    });

    //запись в сессию префикса и id анкеты
    $('#geo-select').submit(function(e){
        e.preventDefault();
        let data = $('#geo-select').serialize();
        let id = $('#geo-select input[name=id]:checked').val();
        let prefix = $('#geo-select input[name=prefix]').val();
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
