//Проверка моб. телефона
/*Проверка серии паспорта*/
$(document).on('blur', '.serial_pass', function () {
    checkPassSeria($(this));
});
/*Проверка номера паспорта*/
$(document).on('blur', '.numm_pass', function () {
    checkPassNumber($(this));
});
/*Проверка код подразделения*/
$(document).on('blur', '#pass_code', function () {
    checkPassCode($(this));
});
$(document).on('keyup', '#pass_code', function () {
    $('[name=pass_whom]').val('');
});
/*Проверка даты рождения*/
$(document).on('blur, change', '#bithday', function () {
    //let date = dataFormat($(this).val());
    if (dateValidate($(this).val())) {
        let date = $(this).val();
        if (fullYear(date) < 20 || fullYear(date) > 75) {
            addClassValid($(this), false);
        } else {
            addClassValid($(this), true);
            $("input[name=birthday]").val(dataFormat(date));
        }
        setSourceIncome();
    } else {
        addClassValid($(this), false);
    }
});
/*Проверка место рождения*/
$(document).on('keyup, blur', '.pass_birth_where, input[name=pass_whom]', function () {
    $(this).removeClass('notValid');
    var nameLngth = $(this).val().length;
    var nameV = $(this).val();
    if (nameLngth < 2) {
        addClassValid($(this), false);
    } else if (/[^0-9а-яА-ЯёЁ\ /.,|\\"!-]/.test(nameV)) {
        addClassValid($(this), false);
    } else {
        addClassValid($(this), true);
    }
});

/*Проверка даты паспорта*/
$(document).on('blur, change', '#bithday, #data_pass', function () {
    let birth = $('#bithday').val();
    let pass_date = $('#data_pass').val();
    if (birth != '' && pass_date != '' && checkCorrectDate(birth) && checkCorrectDate(pass_date)) {
        addClassValid($('#data_pass'), passportCheck(birth, pass_date));
        $("input[name=pass_date]").val(dataFormat(pass_date));
    }
});

/*Проверка суммы*/
$(document).on('blur, change', 'input[name=summ]', function () {
    digitsOnly($(this));
    checkSumm($(this));
});
//Аванс партнеру только цыфры
$(document).on('keyup', '#avans_to_partner', function () {
    digitsOnly($(this));
    mainCalc();
});
/*Проверка дохода*/
$(document).on('blur, change', 'input[name=job_salary]', function () {
    digitsOnly($(this));
    checkJob_salary($(this));
});

$(document).on('change', 'input[name=low_job_salary_accept], input[name=over_job_salary_accept]', function () {
    digitsOnly($('input[name=job_salary]'));
    checkJob_salary($('input[name=job_salary]'));
});


//Проверка аванса при спец. условиях (Ювелирка)
$(document).on('input, blur', '#avans_to_partner', function () {
    let sum = $('#allSumm').val();
    let avans = $(this).val();
    if (($('#specialOption').val() == 1 || $('#specialOption').val() == '1') && !$(this).attr('readonly')) {
        addClassValid($('#avans_to_partner'), checkMinAvans(sum, avans))
    }
    ;
});

//Лимит 150+
$(document).on('change', 'input[name=limit]', function () {
    if ($(this).attr('id') == 'limit_150_plus') {
        console.log();
        showPopup({
            title: 'Уточите размер лимита', //не обязательный
            text: '<p class="text-center">Введите сумму более <br>150 000 рублей</p><input type="text" id="sum_max_limit" class="sum_limit_more_150" placeholder="Сумма руб.">', //не обязательный
            //кнопки в модалке - массив объектов, не обязательный (по умолчанию будет кнопка ok, каждый объект создает новую кнопку)
            //классы для ссылок:
            //reloadapp - перезагружает страницу
            //closepopup - закрывает модалку(по умолчанию)
            links: [{
                    link_text: 'Отмена',
                    link_class: 'clear_max_limit',
                    link: '#',
                },
                {
                    link_text: 'Подтвердить',
                    link_class: 'set_max_limit',
                    link: '#',
                }],
        });
    } else {
        resetMaxLimit();
    }
});
$(document).on('click', '.set_max_limit', function () {
    digitsOnly($('#sum_max_limit'));
    let sum = $('#sum_max_limit').val();
    if (sum <= 150000 || sum > 500000) {
        addClassValid($('#sum_max_limit'), false);
    } else {
        setMaxLimit(sum);
        closePopup();
    }
});
$(document).on('click', '.clear_max_limit', function () {
    resetMaxLimit();
    closePopup();
});

/*Обработка галок "Источник доходов для погашения займа" и "Источник происхождения средств" - если все сняты*/
$(document).on('change', '.repay_source', function () {
    let checked_count = 0; //Количество установленый галок
    $('.repay_source').each(function () {
        if ($(this).prop('checked')) {
            checked_count++;
        }
    });
    if (checked_count == 0) {
        $('#dohod_blank').prop('checked', true);
    } else {
        $('#dohod_blank').prop('checked', false);
    }
});
$(document).on('change', '.income_source', function () {
    let checked_count = 0; //Количество установленый галок
    $('.income_source').each(function () {
        if ($(this).prop('checked')) {
            checked_count++;
        }
    });
    if (checked_count == 0) {
        $('#istok_blank').prop('checked', true);
    } else {
        $('#istok_blank').prop('checked', false);
    }
});

$(document).on('change', 'input[name=clearing_payee_bankbik]', function () {
    let bik = $(this).val();
    addClassValid($(this), validateBik(bik));
});

$(document).on('change', '#second_form input[name=inn]', function () {
    let inn = $(this).val();
    addClassValid($(this), validateInn(inn));
})
$(document).on('change', 'input[name=clearing_payee_personalacc]', function () {
    let rs = $(this).val();
    let bic = $('input[name=clearing_payee_bankbik]').val();
    addClassValid($(this), validateRs(rs, bic));
})




function setMaxLimit(sum) {
    $('#limit_150_plus').val(sum);
    $('#limit_150_plus + label').addClass('dobble-string').append('<span>(' + sum + ' руб.)</span>')
}
function resetMaxLimit() {
    $('#limit_150_plus').val(500000).prop('checked', false);
    $('#limit_150_plus + label').removeClass('dobble-string')
    $('#limit_150_plus + label span').remove();
}

/*Проверка возраста и расстановка галок источник дохода*/
function setSourceIncome() {
    let age = $('input[name=birthdate]').val() != '' ? fullYear($('input[name=birthdate]').val()) : false; //возраст
    console.log(age);
    let gender = $('input[name=sex]').val() != '' ? $('input[name=sex]').val() : false; //пол
    if (age && gender) {
        if (gender == 'муж') { //условие для муж
            if (age < 65) {
                $('#istok_rabota').prop('checked', true);
                $('#dohod_zp').prop('checked', true);
                $('#istok_social').prop('checked', false);
                $('#dohod_pensiya').prop('checked', false);
            } else {
                $('#istok_rabota').prop('checked', false);
                $('#istok_social').prop('checked', true);
                $('#dohod_zp').prop('checked', false);
                $('#dohod_pensiya').prop('checked', true);
            }
        } else if (gender == 'жен') { //условие для жен
            if (age < 60) {
                $('#istok_rabota').prop('checked', true);
                $('#dohod_zp').prop('checked', true);
                $('#istok_social').prop('checked', false);
                $('#dohod_pensiya').prop('checked', false);
            } else {
                $('#istok_rabota').prop('checked', false);
                $('#istok_social').prop('checked', true);
                $('#dohod_zp').prop('checked', false);
                $('#dohod_pensiya').prop('checked', true);
            }
        } else {
            //Не понятный пол ))
            $('#istok_rabota').prop('checked', true);
            $('#istok_social').prop('checked', false);
        }
    }
}

function digitsOnly(input) {
    var digit = input.val().replace(/[^0-9 .]/g, "").trim();
    digit = digit ? digit : 0;
    console.log(parseFloat(digit).toFixed(0));
    input.val(parseFloat(digit).toFixed(0));
    console.log(parseFloat(digit).toFixed(0));
}
//Постановка классов valid notValid
function addClassValid(object, valid) {
    if (valid) {
        object.removeClass('notValid').addClass('valid');
    } else {
        object.addClass('notValid').removeClass('valid');
    }
}


//Преобразование даты в новый формат
function dataFormat2(date) {
    let date_array = date.split('-');
    let new_date = date;
    if (date_array.length > 1) {
        new_date = date_array[2] + '.' + date_array[1] + '.' + date_array[0];
    }
    //console.log(date,new_date);
    return new_date;
}
//Преобразование даты в новый формат
function dataFormat(date) {
    let date_array = date.split('.');
    let new_date = date;
    if (date_array.length > 1) {
        new_date = date_array[2] + '-' + date_array[1] + '-' + date_array[0];
    }
    // console.log(date,new_date);
    return new_date;
}

//Проверка серии паспорта
function checkPassSeria(input) {
    input.removeClass('notValid');
    input.removeClass('valid');
    input.val(input.val().replace(/\s+/g, ''));
    var nameLngth = input.val().length;
    var nameV = input.val().replace(/\s+/g, '');
    if (nameLngth !== 4) { //длина 4 символа
        addClassValid(input, false);
        return false;
    } else if (/[^0-9\ ]/.test(nameV)) { //только цифры
        addClassValid(input, false);
    } else if (checkRepeatNumber(nameV)) {
        addClassValid(input, false);
    } else {
        addClassValid(input, true);
    }
}
;
//Проверка номера паспорта
function checkPassNumber(input) {
    input.removeClass('notValid');
    input.val(input.val().replace(/\s+/g, ''));
    var nameLngth = input.val().length;
    var nameV = input.val().replace(/\s+/g, '');
    if (nameLngth !== 6) {
        addClassValid(input, false);
    } else if (/[^0-9\ ]/.test(nameV)) {
        addClassValid(input, false);
    } else if (checkRepeatNumber(nameV)) {
        addClassValid(input, false);
    } else {
        addClassValid(input, true);
    }
}
;

function checkPassCode(input) {
    let code = input.val();
    let data = $('[name=pass_whom]').val();
    if (/^[0-9]{3}-[0-9]{3}$/.test(code) /*&& data != ''*/) {
        addClassValid(input, true);
    } else {
        addClassValid(input, false);
    }
}

function checkRepeatNumber(number) {
    var x = parseInt(number.split('')[0]);
    var y = parseInt(number.split('')[1]);
    if (number.split('').length > 4) {
        if (number / x == 111111 || number == '000000') {
            return true;
        } else {
            return false;
        }
    } else {
        if ((number == 0 || number / x == 1111) && x != 1 && x != 2) {
            return true;
        } else if (x == 0 && y == 0) {
            return true;
        } else {
            return false;
        }
    }
}

function fullValidationStep1() {

    let errors = 0;
    //Проверка на обязательные поля
    $('#main_form input[data-need=1]').each(function () {
        let val = $(this).val();
        let valid = $(this).hasClass('valid');
        if (val == '') {
            valid = false;
        }
        let name = $(this).attr('name');
        addClassValid($(this), valid);
        if (valid == false) {
            errors++;
        }
    });
    //Проверка ФИО
    if (!fioValidate()) {
        errors++;
        showPopup({text: 'Неверное значение ФИО'});
    }
    //Проверка лимитов
    /*if (!$('input[name=limit]:checked').val()) {
        errors++;
        showPopup({text: 'Не выбран лимит!'});
    }*/

    //проверка СБП
    if ($('#main_form input[name=sbp_phone]').length > 0 &&
            ($('#main_form input[name=sbp_available]').val() == 1 && ($('#main_form input[name=sbp_phone]').val() == '' || $('#main_form select[name=sbp_bank_id_a]').val() == ''))) {
        errors++;
        showPopup({text: 'Не заполнены либо неверно заполнены поля в блоке СБП заемщика.'});
    }

    if ($("#pass_code").val().length > 7) {
        errors++;
        showPopup({text: 'Не верный код подразделения!'});
    }
    /*Проверка дохода*/
    checkJob_salary($('input[name=job_salary]'));


    //Проверка файлов
    if ($('input[name=pass1_resized]').val() == '' || $('input[name=pass2_resized]').val() == '') {
        errors++;
        showPopup({text: 'Загружены не все фото паспорта'});
    }

    if (errors > 0) {
        return false;
    } else {
        return true;
    }
}

function fullValidationStep2() {
    let errors = 0;
    let prog = $('#programm').val();
    let maxSummTovar = parseInt($('#max_summ_tovar').val());
    let minSummTovar = parseInt($('#min_summ_tovar').val());
    let summaTovar = parseInt($('#allSumm').val());
    let maxSumm = parseInt($('#max_summ').val());
    let minSumm = parseInt($('#min_summ').val());
    let summaZaima = parseInt($('#summa_zaim').val());
    let months = parseInt($('#months').val());
    //Проверка лимита
    checkLimitSumm($('input[name=summa_zaim'));

    //Проверка номера карты
    if($('input[name=bank_card_payout_status]').val() == 1) {
        let input = $('input[name=bank_card_number]');
        if(card_check(input.val())) {
            addClassValid(input,true);
            input.val(input.val().replace(/\D/g, ""));
        }
    }
    //Проверка на обязательные поля
    $('#second_form input[data-need=1]').each(function () {
        let val = $(this).val();
        let valid = $(this).hasClass('valid');
        if (val == '') {
            valid = false;
        }
        let name = $(this).attr('name');
        addClassValid($(this), valid);
        if (valid == false) {
            errors++;
        }
    });
    /*Проверка дохода*/
    checkJob_salary($('input[name=job_salary]'));

    //проверка СБП
    if ($('#second_form input[name=sbp_payout_status]').val() == 1 &&
            (($('#second_form input[name=sbp_phone]').val() == '' || $('#second_form select[name=sbp_bank_id_a]').val() == ''))) {
        errors++;
        showPopup({text: 'Не заполнены либо неверно заполнены поля в блоке "Перевод по СБП"'});
    }


    //Проверка файлов
    if ($('input[name=pass1_resized]').val() == '' || $('input[name=pass2_resized]').val() == '') {
        errors++;
        showPopup({text: 'Загружены не все фото паспорта'});
    } else {

    }

    //Проверка ограничений по суммам
    if (maxSummTovar > minSummTovar && (summaTovar < minSummTovar || summaTovar > maxSummTovar))
    {
        showPopup({text: "Сумма товаров по данной программе должна быть от " + minSummTovar + " до " + maxSummTovar + "!"});
        errors++;
    }

    if (maxSumm > minSumm && (summaZaima < minSumm || summaZaima > maxSumm))
    {
        showPopup({text: "Сумма займа по данной программе должна быть от " + minSumm + " до " + maxSumm + "!"});
        errors++;
    }

    /*Максимальная сумма займа 500 000р. минимальная 1000*/
    if (summaZaima > 500000 || summaZaima < 1000) {
        showPopup({text: "Допустимая сумма займа от 1000р до 500 000р. "});
        errors++;
    }

    /*Ограниченя для программ по сумме и сроку Стандартный займ, Стандарт *, Нал База ТТ - до 27000 макс срок 12 мес*/
    if ((prog == 'Стандарт *' || prog == 'Стандартный Займ') && summaZaima < 27001 && months > 12) {
        showPopup({text: "При сумме займа до 27 000р. по данной программе максимальный срок займа 12 мес.!"});
        errors++;
    }
    /*Ограниченя для програме Нал База ТТ - срок больше 12 мес сумма от 27000 до 60 000 макс срок 12 мес*/
    if (prog == 'Нал База ТТ' && (summaZaima <= 27000 || summaZaima > 60000) && months > 12) {
        showPopup({text: "При сроке займа более 12-ти месяцев по данной программе ограничение по сумме от 27 001р. до 60 000р.!"});
        errors++;
    }
    if (prog == 'Нал База ТТ' && summaZaima > 100000) {
        showPopup({text: "Максимальная сумма займа по программе 100 000р."});
        errors++;
    }

    //Проверка минимального аванса "Ювелирка" и т.п.
    if (($('#specialOption').val() == 1 || $('#specialOption').val() == '1') && !$('#avans_to_partner').attr('readonly')) {
        let sum = $('#allSumm').val();
        let avans = $('#avans_to_partner').val();
        if (checkMinAvans(sum, avans)) {
            addClassValid($('#avans_to_partner'), true);
        } else {
            errors++;
            addClassValid($('#avans_to_partner'), false);
        }
    }

    //Проверка наличия адреса страхования
    if (($('input[name=sber_nc_im_1').prop('checked') || $('input[name=sber_nc_im_2').prop('checked')) && $('input[name=insured_address]').val().length < 5) {
        errors++;
        addClassValid($('input[name=insured_address]'), false);
    } else {
        addClassValid($('input[name=insured_address]'), true);
    }

    if (errors > 0) {
        return false;
    } else {
        return true;
    }
}

function checkMinAvans(sum, avans) {
    let so = specialOptions.filter(item => sum <= parseInt(item.max_summ) && sum >= parseInt(item.min_summ))[0];
    //let so = specialOptions.filter(function(item) { return sum <= item.max_summ && sum >= item.min_summ; })[0];
    // console.log(sum,avans);
    let avansList = so.avans_linst;
    let percent = avansList.replace("[", "").replace("]", "").split(',')[0];
    //console.log(percent);
    avans = avans == '' ? 0 : avans;
    if (avans && avans != '' && avans >= sum * percent / 100) {
        return true;
    } else {
        return false;
    }
}

/*Проверка двойного отчества*/
function checkDobleFatherName() {
    var input = $('input[name=fio]').val();
    if (input != '') {
        var input_val = input.split(' ');
        var dadata_val = [$('input[name=last_name]').val(), $('input[name=first_name]').val(), $('input[name=father_name]').val()];
        let difference = input_val.filter(x => !dadata_val.includes(x)).concat(dadata_val.filter(x => !input_val.includes(x)));
        console.log(difference);

        if (difference.length > 1) {
            addClassValid($('input[name=fio]'), false);
            return false;
        } else if (difference.length == 1) {
            console.log(difference);
            $('input[name=father_name]').val($('input[name=father_name]').val() + ' ' + difference[0]);
        }
    }
}
;

function checkSumm(input) {
    let summ = parseInt(input.val());
    let maxSumm = parseInt($('input[name=max_summ_tovar]').val());
    let minSumm = parseInt($('input[name=min_summ_tovar]').val());

    if (summ == 0 || summ < 1000) {
        addClassValid(input, false);
    } else {
        if (maxSumm != 0) {
            if (summ > maxSumm) {
                addClassValid(input, false);
                showPopup({text: 'Максимальная сумма товара по данной программе: ' + maxSumm + 'руб.'});
            } else {
                addClassValid(input, true);
            }
        }
        if (minSumm != 0) {
            if (summ < minSumm) {
                addClassValid(input, false);
                showPopup({text: 'Минимальная сумма товара по данной программе: ' + minSumm + 'руб.'});
            } else {
                addClassValid(input, true);
            }
        }
        if (minSumm == 0 && maxSumm == 0) {
            addClassValid(input, true);
        }
        //checkLimitSumm(input);
        //checkLimitSumm($('input[name=summa_zaim'));
    }

}

function checkJob_salary(input) {
    /*let value = parseInt(input.val());
     console.log(value);
     if(value > 0) {
     addClassValid(input,true);
     } else {
     addClassValid(input,false);
     }*/

    let summa = input.val().replace(/\s/g, '').trim();
    let mrot = parseFloat($('input[name=mrot]').val().replace(/\s/g, '').trim());
    let over_profit = parseFloat($('input[name=over_profit]').val().replace(/\s/g, '').trim());
    let low_profit_accept = $('input[name=low_job_salary_accept]').prop('checked');
    let overhight_profit_accept = $('input[name=over_job_salary_accept]').prop('checked');
    console.log(low_profit_accept, overhight_profit_accept);
    input.val(summa);
    if (summa != '' && (summa < 8000 || summa > 500000)) {
        addClassValid(input, false);
        showPopup({text: 'Допустимый размер дохода от 8 000 до 500 000 руб'});
    } else if (summa < mrot && low_profit_accept == false) {
        $('#low-profit').show();
        $('#hight-profit').hide();
        $('#over_job_salary_accept').prop('checked', false);
        showPopup({text: 'Подтвердите, что сумма дохода меньше МРОТ(' + mrot + 'руб.) или укажите иной размер дохода'});
        addClassValid(input, false);
    } else if (summa > over_profit && overhight_profit_accept == false) {
        $('#hight-profit').show();
        $('#low-profit').hide();
        $('#low_job_salary_accept').prop('checked', false);
        showPopup({text: 'Подтвердите, что сумма дохода больше ' + over_profit + 'руб. или укажите иной размер дохода'});
        addClassValid(input, false);
    } else if (summa >= mrot && summa <= over_profit) {
        $('#low-profit').hide();
        $('#hight-profit').hide();
        $('#low_job_salary_accept').prop('checked', false);
        $('#over_job_salary_accept').prop('checked', false);
        addClassValid(input, true);
    } else {
        addClassValid(input, true);
    }


}

function checkLimitSumm(input) {
    //let summ = parseInt(input.val());
    let summ = parseInt($('input[name=summa_zaim_for_validate').val());
    let limit = parseInt($('input[name=current_limit]').val());
    if (summ > limit) {
        addClassValid(input, false);
    } else {
        addClassValid(input, true);
    }
}

function checkMaxDate(date) {
    let today = new Date();
    let day = new Date(date);
    console.log(day.getTime(), today.getTime());
    if (day.getTime() > today.getTime()) {

        return false;
    } else {
        return true;
    }
}

/*Проверка возраста при страховках*/
function checkAgeIns(birthday) {
    let month = $('#months').val() ? $('#months').val() : 0;//$('input[name=birthdate]').val() != '' ? fullYear($('input[name=birthdate]').val()) : false; //возраст
    let age = dataFormat2(birthday) != '' ? fullYear(dataFormat2(birthday)) : false; //возраст
    let ageEndPolice = dataFormat2(birthday) != '' ? fullYear(dataFormat2(birthday), 0, month) : false; //возраст
    console.log(birthday, age, ageEndPolice);
    if ($('#bsplus').prop('checked') || $('#bs').prop('checked') && age) {
        if (age > 69) {
            showPopup({text: 'Ограничение по возрасту для выбранной программы страхования: 69 лет'});
            $('#bsplus').prop('checked', false).trigger('change');
            $('#bs').prop('checked', false).trigger('change');
        }
    }
    if ($('#covid_1').prop('checked') || $('#covid_2').prop('checked') && age) {
        if (age > 64) {
            showPopup({text: 'Ограничение по возрасту для выбранной программы страхования: 64 года'});
            $('#covid_1').prop('checked', false).trigger('change');
            $('#covid_2').prop('checked', false).trigger('change');
        }
    }
    if ($('#ins_trauma').prop('checked') || $('#ins_komfort').prop('checked') || $('#ins_life').prop('checked') && ageEndPolice) {
        if (ageEndPolice > 68) {
            showPopup({text: 'Ограничение по возрасту на момент окончания полиса: 68 лет'});
            $('#ins_trauma').prop('checked', false).trigger('change');
            $('#ins_komfort').prop('checked', false).trigger('change');
            $('#ins_life').prop('checked', false).trigger('change');
        }
    }
    if ($('#ins_life_plus').prop('checked') && ageEndPolice) {
        if (ageEndPolice > 65) {
            showPopup({text: 'Ограничение по возрасту на момент окончания полиса: 65 лет. Оформление будет продолжено без доп услуг'});
            $('#ins_life_plus').prop('checked', false).trigger('change');
        }
    }
    //addClassValid(input,false);
}
function getClientBirth(id) {
    $.ajax({
        type: 'POST',
        url: '/user/getBithday?' + new Date().getTime(),
        data: {'id': id},
        beforeSend: function () {
        },
        success: function (data) {
            let res = $.parseJSON(data);
            if (res.success == true) {
                checkAgeIns(res.bithday);
            }
            //console.log(res);
        },
        error: function (xhr, str) {
            showPopup({text: 'Возникла ошибка: ' + xhr.responseText});
            return false;
        }
    });
}

//Плюсуем к возрасту срок займа
/*function agePlusMonths(birthday,months){
 let year_plus = 0; //сколько лет плюсуем
 let month_plus = 0; //сколько месяцев плюсуем
 if(months < 12) {
 month_plus = months;
 } else {
 year_plus = ~~(months/12);
 month_plus = months%12;
 }

 console.log(year_plus,month_plus);
 return birthday;
 }*/

$.fn.setCursorPosition = function (pos) {
    if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

//Валидация поля фамилия имя и отчества в модальном онке ручного ввода
$(document).on('input', 'input[name=manual_last_name]', function () {
    let input = $(this);
    if ($(this).val().trim() == '') {
        $(this).val('');
    }
    $(this).removeClass('notValid');
    $(this).removeClass('valid');
    var nameLngth = $(this).val().trim().length;
    var nameV = $(this).val().trim();
    if (nameLngth <= 1) {
        addClassValid(input, false);
    } else if (/[^а-яА-ЯЁё\-]/.test(nameV)) {
        addClassValid(input, false);
    } else {
        addClassValid(input, true);
    }
});
$(document).on('input', 'input[name=manual_first_name]', function () {
    let input = $(this);
    if ($(this).val().trim() == '') {
        $(this).val('');
    }
    $(this).removeClass('notValid');
    $(this).removeClass('valid');
    var nameLngth = $(this).val().trim().length;
    var nameV = $(this).val().trim();
    if (nameLngth <= 1) {
        addClassValid(input, false);
    } else if (!/^[а-яё]([а-яё\s\-]*[а-яё])?$/i.test(nameV)) {
        addClassValid(input, false);
    } else {
        addClassValid(input, true);
    }
});
$(document).on('input', 'input[name=manual_father_name]', function () {
    let input = $(this);
    if ($(this).val().trim() == '') {
        $(this).val('');
    }
    $(this).removeClass('notValid');
    $(this).removeClass('valid');
    var nameLngth = $(this).val().trim().length;
    var nameV = $(this).val().trim();
    if (nameLngth <= 1) {
        addClassValid(input, false);
    } else if (/[^а-яА-ЯЁё \-]/.test(nameV)) {
        addClassValid(input, false);
    } else {
        addClassValid(input, true);
    }
});

//проверка номера карты
$(document).on('input', 'input[name=bank_card_number]', function () {
    $(this).val(cc_format($(this).val()));
    let card_number = $(this).val();
    addClassValid($(this),card_check(card_number));
});


function fioValidate() {
    let f = $('input[name=last_name]').val().trim();
    let i = $('input[name=first_name]').val().trim();
    let o = $('input[name=father_name]').val().trim();
    let res = true;

    if (res) {
        if (f.length <= 1) {
            res = false;
        } else if (/[^а-яА-ЯЁё\-]/.test(f)) {
            res = false;
        } else {
            res = true;
        }
    }
    if (res) {
        if (i.length <= 1) {
            res = false;
        } else if (!/^[а-яё]([а-яё\s\-]*[а-яё])?$/i.test(i)) {
            res = false;
        } else {
            res = true;
        }
    }

    if (res) {
        if($('input[name=noOtchesvo]').val() == 1) {
            res = true;
        } else if (o.length <= 1) {
            res = false;
        } else if (/[^а-яА-ЯЁё \-]/.test(o)) {
            res = false;
        } else {
            res = true;
        }
    }

    return res;
}
function dateValidate(input_date) {
    let result = false;
    let date = input_date.split('-');
    let day = '';
    let month = '';
    let year = '';
    let regexp = new RegExp('^((((0?[1-9].(0?[1-9]|1[0-2]))|([12][0-9].((0?[13-9])|1[0-2]))|(((1[0-9])|(2[0-8])).0?2)|(30.((0?[13-9])|1[0-2]))|(31.((0?[13578])|10|12))).[0-9]{4})|(29.0?2.(([0-9]{2}((0[48])|([2468][048])|([13579][26])))|((([02468][048])|([13579][26]))00))))$');
    var validDate = regexp.test(input_date);
    if (validDate) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

function card_check(card) {
    let card_number = card.replace(/\D/g, "");
    if (/[^0-9-\s]+/.test(card_number)) {
        return false;
    } else if(card_number.length < 16 || card_number.length > 19) {
        return false;
    } else {
        const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
        let len = card_number.length;
        let bit = 1;
        let sum = 0;
        let val;

        while (len) {
          val = parseInt(card_number.charAt(--len), 10);
          sum += (bit ^= 1) ? arr[val] : val;
        }
        return sum && sum % 10 === 0;
    }
}
function cc_format(value) {
    let val = value.replace(/\D/g, "");
    let v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    let matches = v.match(/\d{16,19}/g);
    let match = matches && matches[0] || ''
    let parts = []
    for (i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4))
    }
    if (parts.length) {
        return parts.join(' ')
    } else {
        return val
    }
}

/*Валидация електронной почты*/
$(document).on('click', '#confirm_email', function (e) {
    e.preventDefault();
    emailValidation($('input[name=email]').val());
});

function emailValidation (email){
    $.ajax({
        type: 'POST',
        url: '/api/v1/validateEmail?'+ new Date().getTime(),
        data: {'email': email},
        beforeSend: function () {
        },
        success: function (res) {
            console.log(res);
            if(res.success) { // письмо отправлено
                $('#confirm_email').hide();
                $('#email_code_block').show();
            } else { //письмо не отправлено
                $('#email_code_block').hide();
                $('#confirm_email').show();
                showPopup({text: 'Возникла ошибка: ', text: 'Попробуйте еще раз, или введите другой e-mail'});
            }
        },
        error: function (xhr, str) {
            showPopup({text: 'Возникла ошибка: ', text: xhr.responseText});
            return false;
        }
    });
}

$(document).on('input', 'input[name=email_code]', function(){
    digitsOnly($(this));
    let code = $(this).val();
    let email = $('input[name=email]').val();
    if(code.length == 6){
        emailCodeConfirm(email, code);
    }
});

function emailCodeConfirm (email, code) {
    $.ajax({
        type: 'POST',
        url: '/api/v1/checkValidateEmail?'+ new Date().getTime(),
        data: {'email': email, 'code': code},
        beforeSend: function () {
        },
        success: function (res) {
            console.log(res);
            if(res.success == true) {
                addClassValid($('input[name=email]'), true);
                addClassValid($('input[name=email_code]'), true);
            } else {
                addClassValid($('input[name=email_code]'), false);
            }
        },
        error: function (xhr, str) {
            showPopup({text: 'Возникла ошибка: ', text: xhr.responseText});
            return false;
        }
    });
}
