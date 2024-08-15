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
    let regexp =  new RegExp('^((((0?[1-9].(0?[1-9]|1[0-2]))|([12][0-9].((0?[13-9])|1[0-2]))|(((1[0-9])|(2[0-8])).0?2)|(30.((0?[13-9])|1[0-2]))|(31.((0?[13578])|10|12))).[0-9]{4})|(29.0?2.(([0-9]{2}((0[48])|([2468][048])|([13579][26])))|((([02468][048])|([13579][26]))00))))$');
    var validDate = regexp.test(val);
    return validDate;
}

