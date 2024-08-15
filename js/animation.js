var preloader = '<div class="preloader" data-loader="circle-side"></div>';
$(document).ready(function(){
    //Вкладка дополнительная информация
    $('.more-info').click(function(e){
        e.preventDefault();
        $(this).toggleClass('active');
        $('.more-info-block').slideToggle(300);
    });
    
    //Анимация окна авторизации
    $('.auth-modal').addClass('visible');
    
    /*закрытие баннера*/
    $('.close_msg').click(function(){
        $('.messege-block').slideUp(200);
    });
    
    //Анимация справок
    $('.show-spravka').click(function(e){
        e.preventDefault();
        showPopup({
            'title': 'Справка о доходах',
            'text': '<div class="files-block">\n\
                    <a href="/files/2-ndfl.pdf" target="_blank" class="file-ico">2 НДФЛ</a>\n\
                    <a href="/files/gosuslugi.pdf" target="_blank" class="file-ico">Справка Госуслуги</a>\n\
                    <a href="/files/faq.pdf" target="_blank" class="file-ico">Инструкция</a>\n\
                    <a href="/files/free_form.pdf" target="_blank" class="file-ico">Наша форма</a>\n\
                    <a href="/files/samozan.pdf" target="_blank" class="file-ico">Самозанятые</a></div>'
        });
    });
    
});
