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
    let id = $('input[name=app_id]').val();
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
