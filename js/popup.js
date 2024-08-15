/*popup settings:
showPopup ({
            title: 'Заголовок модального окна', //не обязательный
            text: 'Текст модального окна', //не обязательный
            //кнопки в модалке - массив объектов, не обязательный (по умолчанию будет кнопка ok, каждый объект создает новую кнопку)
            //классы для ссылок:
            //reloadapp - перезагружает страницу
            //closepopup - закрывает модалку(по умолчанию)
            links: [{
                    link_text:'Нет',
                    link_class:'no',
                    link: '#',
                },
                {
                    link_text:'Да',
                    link_class:'yes',
                    link: '#',
                }],
            classes: 'class1 class2' //Классы для модалки если нужно, не обязательный
        }); 


 */
function showPopup (object) {
    if(!object.title && object.title != '') {
        object.title = 'Внимание';
    }
    if(!object.text && object.text != '') {
        object.text = '';
    }
    if(!object.links) {
        object.links = [{
            link_text: 'ok',
            link_class: 'closepopup',
            link: '#',
        }];
    }
    if(!object.classes) {
        object.classes = '';
    } 
    let links = '';
    let leng = object.links.length;
    //генерим кнопки
    for (let i =0; i<leng;i++) {
        links += '<a href="'+object.links[i].link+'" class="'+object.links[i].link_class+'">'+object.links[i].link_text+'</a>';
    }
    //добавляем класс к попапу
    $('#popup').addClass(object.classes);
    //добавляем заголовок
    $('#popup .popup-title').html(object.title);
    //добавляем текст
    $('#popup .popup-text').html(object.text);
    //добавляем кнопки
    $('#popup .popup-buttons').html(links);
    //показываем фон и модалку
    $('.popup-bg').fadeIn(200);
    $('#popup').slideDown(300);
}

function closePopup() {
    $('#popup').removeClass();
    $('.popup-bg').fadeOut(200);
    $('#popup').slideUp(300);
    //$('#app-docks-modal').slideUp(300);
}