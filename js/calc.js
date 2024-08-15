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
    let InsLife = $("[name=InsLife]").is(':checked');
    let InsJob = $("[name=InsJob]").is(':checked');
    let InsTraum = $("[name=InsTraum]").is(':checked');
    let InsKomfort = $("[name=InsKomfort]").is(':checked');
    let insSumm = 0;
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
    let iterations = parseInt($('#iterations').val());
    let summa_zaim = parseInt($('#summa_zaim').val());
    let current_margin = $('#margin').val();
    let current_chgps = $('#chgps').val();
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
    let sber_percent = insReward > 0 ? 0.21 : 0.18;
    if ($('#sber_nc_1').is(':checked')) {
        let price_sber_nc_1 = parseFloat($('#sber_nc_1').attr('data-price'));
        sber = price_sber_nc_1 * sber_percent;
    }
    if ($('#sber_nc_2').is(':checked')) {
        let price_sber_nc_2 = parseFloat($('#sber_nc_2').attr('data-price'));
        sber = price_sber_nc_2 * sber_percent;
    }
    if ($('#sber_nc_3').is(':checked')) {
        let price_sber_nc_3 = parseFloat($('#sber_nc_3').attr('data-price'));
        sber = price_sber_nc_3 * sber_percent;
    }
    if ($('#sber_nc_zdz_1').is(':checked')) {
        let price_sber_nc_zdz_1 = parseFloat($('#sber_nc_zdz_1').attr('data-price'));
        sber = price_sber_nc_zdz_1 * sber_percent;
    }
    if ($('#sber_nc_zdz_2').is(':checked')) {
        let price_sber_nc_zdz_2 = parseFloat($('#sber_nc_zdz_2').attr('data-price'));
        sber = price_sber_nc_zdz_2 * sber_percent;
    }
    
    
    summaPartnerRewards += sber;
    
    //СБЕР-имущество страхование
    var sber_im = 0;
    if ($('#sber_nc_im_1').is(':checked')) {
        let price_sber_nc_im_1 = parseFloat($('#sber_nc_im_1').attr('data-price'));
        sber_im = price_sber_nc_im_1 * sber_percent;
    }
    if ($('#sber_nc_im_2').is(':checked')) {
        let price_sber_nc_im_2 = parseFloat($('#sber_nc_im_2').attr('data-price'));
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