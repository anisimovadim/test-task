$(document).on('click','a.get-akt', function(e){
    e.preventDefault();
    let id = $(this).attr('href');
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
            let res = $.parseJSON(data);
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