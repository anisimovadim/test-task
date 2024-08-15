$(document).on('click', '.get-pdf', function(e){
    e.preventDefault();
    let type = $(this).attr('data-type');
    //let id = $('input[name=uuid]').val();
    let id = $(this).attr('href');
    getPDF(id,type);
});

$(document).on('click', '.get-dogovor', function(e){
    e.preventDefault();
    let id = $(this).attr('href');
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
            let b64 = data.body;
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
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "Documents.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}
