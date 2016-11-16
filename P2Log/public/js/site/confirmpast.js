$(document).ready(function() {

    $('#daystart_div').datetimepicker({
        locale: 'ja',
        format: 'YYYY/MM/DD'
    }).on('dp.change', function(e) {
        // $('#dayend_div').data("DateTimePicker").minDate(e.date);
    });

    $('#daystart').on('click',function (e) {
        $('#daystart_span').click();
    });

    $('#dayend_div').datetimepicker({
        locale: 'ja',
        format: 'YYYY/MM/DD'
    }).on('dp.change', function(e) {
        // $('#daystart_div').data("DateTimePicker").maxDate(e.date);
    });

    $('#dayend').on('click',function (e) {
        $('#dayend_span').click();
    });
    $(window).scrollTo('#result', {
        duration: 800
    });
});
