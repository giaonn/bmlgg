$( document ).ready(function(){

    if($('.tbody-scroll').height() < $('table.table-scroll-body').prop('scrollHeight')){
        var w = $('table.table-scroll-body').width();
        $('table.table-head').width(w);
    }

    $('#day-start-div').datetimepicker({
        locale: 'ja',
        format: 'YYYY/MM/DD'
    }).on('dp.change', function(e) {
        // $('#day-end-div').data("DateTimePicker").minDate(e.date);
    });

    $('#day-start').on('click',function (e) {
        $('#day-start-span').click();
    });

    $('#day-end-div').datetimepicker({
        locale: 'ja',
        format: 'YYYY/MM/DD'
    }).on('dp.change', function(e) {
        // $('#day-start-div').data("DateTimePicker").maxDate(e.date);
    });

    $('#day-end').on('click',function (e) {
        $('#day-end-span').click();
    });

    $(window).scrollTo('#result',{
        duration: 800
    });

});
