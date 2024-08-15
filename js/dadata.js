var token = dadata_token;
//var token = 'd5b9bcdecc32148dc7fc9b1816539fc2fbc76ea0';;
//console.log(process.env.DATATA_TOKEN);
 function gender2str(gender) {
        return gender === "MALE" ? 1 :
               gender === "FEMALE" ? 0 : "";
    }

    /*Реквизиты банка*/

    $("input[name=clearing_payee_bankbik]").suggestions({
        token: token,
        type: "BANK",
        onSelect: function (suggestion) {
            var error = {
                code: 0,
                message: ''
            };
            $("input[name=clearing_payee_bankbik]").removeClass('valid notValid');
            var bic = suggestion.data.bic;
            var bank = suggestion.value;
            var cor = suggestion.data.correspondent_account;
            var inn = suggestion.data.inn;
            var kpp = suggestion.data.kpp;
            var name = $('input[name=last_name]').val()+' '+$('input[name=first_name]').val()+' '+$('input[name=father_name]').val();
            var rs = $('input[name=clearing_payee_personalacc]').val();
/*            if ($.trim(name) == '') {
                showAlert('Не заполнены ФИО во вкладке "Личные данные", заполните данные для продолжения.');
                $("input[name=clearing_payee_bankbik]").val('');
            } else */
            if ((suggestion.data.opf.type != 'BANK' && suggestion.data.opf.type != 'BANK_BRANCH') || suggestion.data.state.status != 'ACTIVE') {
                console.log(suggestion);
                showAlert('В данный момент нет возможности перечислить на такие реквизиты');
                $("input[name=clearing_payee_bankbik]").val('');
            } else {
                $("input[name=clearing_payee_bankbik]").val(bic);
                $("input[name=clearing_payee_bankname]").val(bank);
                $("input[name=clearing_payee_inn]").val(inn);
                $("input[name=clearing_payee_kpp]").val(kpp);
                $("input[name=clearing_payee_bankcorracc]").val(cor);
                addClassValid($("input[name=clearing_payee_bankbik]"), true);
                addClassValid($("input[name=clearing_payee_bankname]"), true);
                addClassValid($("input[name=clearing_payee_inn]"), true);
                addClassValid($("input[name=clearing_payee_kpp]"), true);
                addClassValid($("input[name=clearing_payee_bankcorracc]"), true);
               // $("input[name=clearing_payee_name]").val(name);
                console.log(suggestion);
            }
            if(validateRs(rs,bic,error) == true) {
                addClassValid($('input[name=clearing_payee_personalacc]'),true);
            } else {
                addClassValid($('input[name=clearing_payee_personalacc]'),false);
            }
        }
    });
    //Проверка Р/С по блуру
   /** $("input[name=clearing_payee_personalacc]").blur(function(){
        var rs = $(this).val();
        var bic = $('input[name=clearing_payee_bankbik]').val();
        if(validateRs(rs,bic) == true) {
            addClassValid($('input[name=clearing_payee_personalacc]'),true);
        } else {
            addClassValid($('input[name=clearing_payee_personalacc]'),false);
        }
    });/

    /*Поле ФИО*/
    $("#fio").suggestions({
        token: token,
        type: "NAME",
        hint:'Выбирите один из вариантов',
        onSelectNothing: function(suggestion) {
            console.log(suggestion, 'Имя: '+$('input[name=first_name]').val()+',фамилия : '+ $('input[name=last_name]').val()+', Отчество: '+$('input[name=father_name]').val());
            fioAlert(suggestion,$('input[name=last_name]').val(),$('input[name=first_name]').val(),$('input[name=father_name]').val());
        },
        /*onInvalidateSelection: function(suggestion) {
            //console.log(suggestion, $('input[name=first_name]').val(), $('input[name=last_name]').val(),$('input[name=father_name]').val());
            fioAlert(suggestion,$('input[name=last_name]').val(),$('input[name=first_name]').val(),$('input[name=father_name]').val());
        },*/
        onSelect: function (suggestion) {
            console.log(suggestion);
            $('input[name=sex]').val(gender2str(suggestion.data.gender));
            if(suggestion.data.name != null && suggestion.data.surname != null /*&& suggestion.data.patronymic != null*/) {
                $('input[name=first_name]').val(suggestion.data.name);
                $('input[name=last_name]').val(suggestion.data.surname);
                if(suggestion.data.patronymic != null) {
                    $('input[name=father_name]').val(suggestion.data.patronymic);
                    $('input[name=noOtchesvo]').val('0');
                } else {
                    $('input[name=father_name]').val('');
                    $('input[name=noOtchesvo]').val('1');
                }
                $("#fio").addClass('valid').removeClass('notValid');
            } else {
                $("#fio").removeClass('valid').addClass('notValid');
            }
            setSourceIncome();
        },
    });

    /*Код подразделения*/
    $("#pass_code").suggestions({
        token: token,
        type: "fms_unit",
        onSuggestionsFetch:function (suggestions) {
            if(suggestions.length == 0) {
                console.log('Нет кода');
                $("#pass_code").addClass('semi-valid');
                $('.pass_whom_block').show().attr('data-need',1);
            } else {

            }
        },
        onSelect: function (suggestion) {
            if(suggestion.data.code != '' && suggestion.data.name != '') {
                $("#pass_code").removeClass('notValid').addClass('valid').val(suggestion.data.code);
                $('input[name=pass_whom]').val(suggestion.data.name).removeAttr('data-need');
                $("#pass_code").removeClass('semi-valid');
                $('.pass_whom_block').hide();
            } else {
                //$("#pass_code").removeClass('valid').addClass('notValid');
            }

            console.log(suggestion);
        }
    });

    //Адрес объекта страхования
     $('input[name=insured_address]').suggestions ({
        token: token,
        type: 'ADDRESS',
        onSelect: function (suggestion) {
        }
     });

    /*Адрес регистрации*/
    $('[name=one_string_adres_registration]').suggestions ({
        token: token,
        type: 'ADDRESS',
        hint: false,
        onSuggestionsFetch:function (suggestions) {
            if(suggestions.length == 0) {
                console.log('Нет адреса');
                $('[name=one_string_adres_registration]').addClass('semi-valid');
                $('[name=adress_registration_incorrect]').val(1);
            } else {

            }
        },
        onSelect: function (suggestion) {
            let source_input = $('[name=one_string_adres_registration]');
            source_input.removeClass('semi-valid');
            $('[name=adress_registration_incorrect]').val(0);
            //source_input.val(suggestion.value).addClass('valid');
             console.log(suggestion.data);
                /*коды фиас и окато*/
                $('[name=fias_id_registration]').val(suggestion.data.fias_id);
                $('[name=okato_registration]').val(suggestion.data.okato);

                //Обработка региона
                $('[name=obl_registration]').val(suggestion.data.region_with_type);

                //Код региона
                try {
                    $('[name=region_registration]').val(suggestion.data.kladr_id.substr(0,2));
                } catch (e) {
                    $('[name=region_registration]').val('');
                }
                $('[name=adress_code_registration]').val(suggestion.data.kladr_id);

                //Обработка города
                var city_with_type = suggestion.data.city + ' ' + suggestion.data.city_type;
                if (suggestion.data.city_with_type == null) {
                    $('[name=locality_registration]').val('');
                    if(suggestion.data.settlement_with_type == null) {
                        $('[name=countryside_registration]').val('');
                        addClassValid(source_input, false); //без населенного пункта поле не валидно
                        $('.clone_reg').hide();
                    } else {
                        $('[name=countryside_registration]').val(suggestion.data.settlement_with_type);
                        addClassValid(source_input, true);
                        $('.clone_reg').show();
                    }
                } else {
                    $('[name=locality_registration]').val(city_with_type);
                    if(suggestion.data.settlement_with_type != null) {
                        $('[name=countryside_registration]').val(suggestion.data.settlement_with_type);
                    }
                    addClassValid(source_input, true);
                    $('.clone_reg').show();
                }

                //Обработка района
                $('[name=ray_registration]').val(suggestion.data.area_with_type);
                //Почтовый индекс
                $('[name=postalcode_registration]').val(suggestion.data.postal_code);

                //обработка улицы + галка нет улицы
                if (suggestion.data.street != null) {
                    let street_with_type = suggestion.data.street + ' ' + suggestion.data.street_type;
                    $('[name=street_registration]').val(street_with_type);
                    $('#registration_street_off').prop('checked',false);
                } else {
                     $('[name=street_registration]').val('');
                     $('#registration_street_off').prop('checked',true);
                }

                //обработка дома + галка нет дома
                if (suggestion.data.house == null || suggestion.data.house == undefined) {
                    $('[name=home_registration]').val('');
                    $('#registration_home_off').prop('checked',true);
                } else {
                    $('[name=home_registration]').val(suggestion.data.house);
                    $('#registration_home_off').prop('checked',false);
                }

                //обработка квартиры + галка нет квартиры
                if (suggestion.data.flat == null || suggestion.data.flat == undefined) {
                    $('[name=apartment_registration]').val('');
                    $('#registration_apartment_off').prop('checked',true);
                } else {
                    $('[name=apartment_registration]').val(suggestion.data.flat);
                    $('#registration_apartment_off').prop('checked',false);
                }


            }
    });

    /*Адрес проживания*/
    $('[name=one_string_adres_living]').suggestions ({
        token: token,
        type: 'ADDRESS',
        hint: false,
        onSuggestionsFetch:function (suggestions) {
            if(suggestions.length == 0) {
                console.log('Нет адреса');
                $('[name=one_string_adres_living]').addClass('semi-valid');
                $('[name=adress_living_incorrect]').val(1);
            } else {

            }
        },
        onSelect: function (suggestion) {
            let source_input = $('[name=one_string_adres_living]');
            //source_input.val(suggestion.value).addClass('valid');
            source_input.removeClass('semi-valid');
            $('[name=adress_living_incorrect]').val(0);
             console.log(suggestion.data);
                /*коды фиас и окато*/
                $('[name=fias_id_living]').val(suggestion.data.fias_id);
                $('[name=okato_living]').val(suggestion.data.okato);

                //Обработка региона
                $('[name=obl_living]').val(suggestion.data.region_with_type);

                //Код региона
                try {
                    $('[name=region_living]').val(suggestion.data.kladr_id.substr(0,2));
                } catch (e) {
                    $('[name=region_living]').val('');
                }
                $('[name=adress_code_living]').val(suggestion.data.kladr_id);

                //Обработка города
                var city_with_type = suggestion.data.city + ' ' + suggestion.data.city_type;
                if (suggestion.data.city_with_type == null) {
                    $('[name=locality_living]').val('');
                    if(suggestion.data.settlement_with_type == null) {
                        $('[name=countryside_living]').val('');
                        addClassValid(source_input, false); //без населенного пункта поле не валидно
                    } else {
                        $('[name=countryside_living]').val(suggestion.data.settlement_with_type);
                        addClassValid(source_input, true);
                    }
                } else {
                    if(suggestion.data.settlement_with_type != null) {
                        $('[name=countryside_living]').val(suggestion.data.settlement_with_type);
                    }
                    $('[name=locality_living]').val(city_with_type);
                    addClassValid(source_input, true);
                }

                //Обработка района
                $('[name=ray_living]').val(suggestion.data.area_with_type);
                //Почтовый индекс
                $('[name=postalcode_living]').val(suggestion.data.postal_code);

                //обработка улицы + галка нет улицы
                if (suggestion.data.street != null) {
                    let street_with_type = suggestion.data.street + ' ' + suggestion.data.street_type;
                    $('[name=street_living]').val(street_with_type);
                    $('#living_street_off').prop('checked',false);
                } else {
                     $('[name=street_living]').val('');
                     $('#living_street_off').prop('checked',true);
                }

                //обработка дома + галка нет дома
                if (suggestion.data.house == null || suggestion.data.house == undefined) {
                    $('[name=home_living]').val('');
                    $('#living_home_off').prop('checked',true);
                } else {
                    $('[name=home_living]').val(suggestion.data.house);
                    $('#living_home_off').prop('checked',false);
                }

                //обработка квартиры + галка нет квартиры
                if (suggestion.data.flat == null || suggestion.data.flat == undefined) {
                    $('[name=apartment_living]').val('');
                    $('#living_apartment_off').prop('checked',true);
                } else {
                    $('[name=apartment_living]').val(suggestion.data.flat);
                    $('#living_apartment_off').prop('checked',false);
                }
            }
    });

    //Кнопка совпадает с регистрацией
    $('.clone_reg').click(function(e){
        e.preventDefault();
        $('[name=one_string_adres_living]').val($('[name=one_string_adres_registration]').val());
        addClassValid($('[name=one_string_adres_living]'), true);
        if($('[name=one_string_adres_registration]').hasClass('semi-valid')) {
            $('[name=one_string_adres_living]').addClass('semi-valid');
        } else {
            $('[name=one_string_adres_living]').removeClass('semi-valid');
        }
        $('.registration-fields input').each(function(){
            let target = $(this).attr('name').replace('registration', 'living');
            let val = $(this).val();
            $('.living-fields input[name='+target+']').val(val);
            if($(this).attr('type') == 'checkbox') {
                let checked = $(this).prop('checked');
                console.log(target,checked);
                $('.living-fields input[name='+target+']').prop('checked',checked);
            }
        });
    });

    function fioAlert(sugg,last_name,first_name,father_name) {
        let text = '';
        if (sugg == '') {
            showPopup({
                text: 'Вы не ввели ФИО!'
            });
        } else {
            if(last_name == '' && first_name == '' && father_name == '') {
                text = '<p>Не удалось определить ФИО. Пожалуйста заполните форму ниже:</p>\n\
                            <label>Фамилия</label><input type="text" name="manual_last_name" maxlength="25" placeholder="Фамилия">\n\
                            <label>Имя</label><input type="text" name="manual_first_name" maxlength="25" placeholder="Имя">\n\
                            <label>Отчество</label><input type="text" name="manual_father_name" maxlength="25" placeholder="Отчество">'
            } else {
                text = '<p>Не удалось определить ФИО. Пожалуйста заполните форму ниже:</p>\n\
                            <label>Фамилия</label><input type="text" name="manual_last_name" placeholder="Фамилия" maxlength="25" value="'+last_name+'">\n\
                            <label>Имя</label><input type="text" name="manual_first_name" placeholder="Имя" maxlength="25" value="'+first_name+'">\n\
                            <label>Отчество</label><input type="text" name="manual_father_name" placeholder="Отчество" maxlength="25" value="'+father_name+'">'
            }

            showPopup({
                    title: 'Внимание!',
                    text: text,
                    links: [{
                        link_text:'Подтвердить',
                        link_class:'accept-manual-fio',
                        link: '#',
                    }],
                    classes: 'set-fio' //Классы для модалки если нужно, не обязательный
                });
        }
    }

    $(document).on('click','.accept-manual-fio', function(e){
        e.preventDefault();
        let last_name = $('.set-fio input[name=manual_last_name]').hasClass('notValid') ? '' : $('.set-fio input[name=manual_last_name]').val().trim();
        let first_name = $('.set-fio input[name=manual_first_name]').hasClass('notValid') ? '' : $('.set-fio input[name=manual_first_name]').val().trim();
        let father_name = $('.set-fio input[name=manual_father_name]').hasClass('notValid') ? '' : $('.set-fio input[name=manual_father_name]').val().trim();
        if(last_name != '' && first_name != '') {
            $('input[name=first_name]').val(first_name);
            $('input[name=last_name]').val(last_name);
            if(father_name != '') {
                $('input[name=father_name]').val(father_name);
                $('input[name=noOtchesvo]').val('0');
            } else {
                $('input[name=father_name]').val('');
                $('input[name=noOtchesvo]').val('1');
            }
            $("#fio").addClass('valid').removeClass('notValid');
            $('#fio').val(last_name+' '+first_name+' '+father_name);
            closePopup();
        } else {

        }
    });
