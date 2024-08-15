/* 
Выбор программ, настройки программ наценки, чгпс и пр.
 */
var programm_limit; //Переменная со всеми лимитами по программе

$(document).on('change', '#programm', function() {
   let programm = $(this).val(); 
   getProgrammSet(programm);
});
$(document).on('change', '#months', function() {
   let months = $(this).val(); 
   let programm = $('#programm').val();
   let summ = $('input[name=summ]').val();
   getProgrammSet(programm,summ,months,'','months');
   let id = $('input[name=app_id]').val();
   getClientBirth(id);
});
$(document).on('change', '#avans', function() {
   let avans = $(this).val(); 
   let months = $('#months').val();
   let programm = $('#programm').val();
   let summ = $('input[name=summ]').val();
   getProgrammSet(programm,summ,months,avans,'avans');
});
$(document).on('change', 'input[name=summ]', function() {
   let summ = digitsOnly($(this)); 
   let programm = $('#programm').val();
   let months = $('#months').val();
   let avans = $('#avans').val();
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
    let accounting_avans = $('input[name=accounting_avans]').val();
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
    let months_string = '';
    let months_array = [];
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
    let avans_array = [];
    let avans_string;
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
    let months = $('#months').val(); 
    let programm = $('#programm').val();
    let summ = $('input[name=summ]').val();
    let avans = $('#avans').val();
    let accounting_avans = $('input[name=accounting_avans]').val();
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
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}
//Уникализация массива
function array_uniq(arr) {
    let r = {};
    return arr.filter(i=>r[i]?!1:r[i]=!0);
}
