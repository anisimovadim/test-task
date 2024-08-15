/*загрузка фото паспорта и ресайз картинок для загрузки*/
$(document).on('click', '.pass-button', function () {
    let file1 = $('input[name=pass1_resized]').val() != '' ? $('.file1-info span').text() : 'Выбрать файл';
    let file2 = $('input[name=pass2_resized]').val() != '' ? $('.file2-info span').text() : 'Выбрать файл';
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
    let file1 = $('input[name=spravka1_resized]').val() != '' ? $('.file3-info span').text() : 'Выбрать файл';
    let file2 = $('input[name=spravka2_resized]').val() != '' ? $('.file4-info span').text() : 'Выбрать файл';
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
    let fileID = $(this).attr('data-file');
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