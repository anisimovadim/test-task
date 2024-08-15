/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function fullYear(data,days,months) {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(data)) {
        var bDay = data.match(/^\d{2}/)[0];
        var bMonth = data.match(/\.\d{2}\./)[0].replace(/\./g, '') - 1;
        var bYear = data.match(/\d{4}$/)[0];
        var today = new Date();
        if(days) {
            today.setDate(today.getDate() + days);
        }
        if(months && months > 0) {
            today.setMonth(today.getMonth() + parseInt(months));
            //today.setDate(date.getDate() - 1);
            //console.log(today);
        }
        if (new Date(bYear, bMonth, bDay)) {
            var r = (today.getFullYear() - bYear - ((today.getMonth() - bMonth || today.getDate() - bDay) < 0));
            //console.log(r+' полных лет')
            return (r);
        } else {
            console.log('Не существует такой даты!');
            return false;
        }
    } else {
        console.log('Ошибка дата не в том формате!')
        return false;
    }
}
        //разность двух дат в годах
function dateDistYear(data1, data2) {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(data1) && /^\d{2}\.\d{2}\.\d{4}$/.test(data2)) {
        var day1 = data1.match(/^\d{2}/)[0];
        var month1 = data1.match(/\.\d{2}\./)[0].replace(/\./g, '') - 1;
        var year1 = data1.match(/\d{4}$/)[0];
        var day2 = data2.match(/^\d{2}/)[0];
        var month2 = data2.match(/\.\d{2}\./)[0].replace(/\./g, '') - 1;
        var year2 = data2.match(/\d{4}$/)[0];
        if (new Date(year1, month1, day1) && new Date(year2, month2, day2)) {
            var r = (year2 - year1 - ((month2 - month1 ||day2  - day2) < 0));
            return (r);

        } else {
            console.log('Не существует такой даты!');
            return false;
        }
    }
    else {
        console.log('Ошибка дата не в том формате!')
        return false;
    }
}
//проверка на ребенка
function isChildren(date){
    if (fullYear(date)<=17 )
    {
        return true;
    }
}

//Проверка на пасспорт
function havePassport(date){
    if (fullYear(date)>=14 )
    {
        return true;
    }
}
//Проверка паспорта на дату выдачи
function passportCheck(bd, pg) {
    let bithday = bd;
    let passGet = pg;
    var bith = fullYear(bithday);
    var passBith = dateDistYear(bithday, passGet);
    if(checkMaxDate(dataFormat(bd)) == false || checkMaxDate(dataFormat(pg)) == false) {
        return false;
    } else {
        if (bith >= 14 && bith <= 20 && (passBith<14 || passBith>20))
        {
            return false;
        }
        else if (bith >= 20 && bith <= 45 && (passBith<20 || passBith>45)) {
            return false;
        }
        else if (bith >= 45 && passBith<45) {
            return false;
        }
        else {
            return true;
        }
    }
}



