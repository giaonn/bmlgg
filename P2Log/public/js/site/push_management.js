var order = "CREATED_AT";
var sorted = "DESC";

$(document).ready(function() {
    $(".loading-overlay").show();
    $v.getRows(1);

    $('#send_start_date_div').datetimepicker({
        useCurrent: false,
        locale: 'ja',
        sideBySide: true,
        format: 'YYYY/MM/DD HH:mm'
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'send_start_date');
        $('#send_end_date_div').data("DateTimePicker").minDate(e.date);
    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            $(this).data('DateTimePicker').date(moment().format("YYYY/MM/DD" + " 00:00"));
        }
    });

    $('#send_start_date').on('click',function (e) {
        $('#send_start_date_span').click();
    });

    $('#send_end_date_div').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        locale: 'ja',
        sideBySide: true,
        format: 'YYYY/MM/DD HH:mm'
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'send_end_date');
        $('#send_start_date_div').data("DateTimePicker").maxDate(e.date);
    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            $(this).data('DateTimePicker').date(moment().format("YYYY/MM/DD" + " 23:59"));
        }
    });

    $('#send_end_date').on('click',function (e) {
        $('#send_end_date_span').click();
    });

    $('#register_start_date_div').datetimepicker({
        useCurrent: false,
        locale: 'ja',
        sideBySide: true,
        format: 'YYYY/MM/DD HH:mm'
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'register_start_date');
        $('#register_end_date_div').data("DateTimePicker").minDate(e.date);
    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            $(this).data('DateTimePicker').date(moment().format("YYYY/MM/DD" + " 00:00"));
        }
    });

    $('#register_start_date').on('click',function (e) {
        $('#register_start_date_span').click();
    });
    $('#register_end_date_div').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        locale: 'ja',
        sideBySide: true,
        format: 'YYYY/MM/DD HH:mm'
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'register_end_date');
        $('#register_start_date_div').data("DateTimePicker").maxDate(e.date);
    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            $(this).data('DateTimePicker').date(moment().format("YYYY/MM/DD" + " 23:59"));
        }
    });

    $('#register_end_date').on('click',function (e) {
        $('#register_end_date_span').click();
    });

    $("#search_push").click(function() {
        $(".loading-overlay").show();
        $v.getRows(1);
    });
});

/* catch scrollable
catch_scrollable = function(){
    var w = $('#table-scroll-body').width();
    $('#table-head').width(w);
};*/

first_time=true;
scrollToResults = function () {
    setTimeout(function(){
        if (!first_time) {
            $(window).scrollTo('#table-head', {
                duration: 800
            });
        } else {
            first_time = false;
        }
    }, 300);
};

var $v = new Vue({
    el: '#vue-container',
    data: {
        rows: [],
        pagination: {
            markup: '',
            currentPage: -1
        }
    },
    methods: {
        getRows: function(page) {
            if (!isNaN(page) && page > 0) {
                page = '?page=' + page + '&' + $("#push_managerment_form").serialize()+'&order=' + order  + '&sorted='+sorted;
            } else {
                page = $("#push_managerment_form").serialize();
            }
            $(".loading-overlay").show();
            $("#tbody-scroll").hide();
            $.ajax({
                url: '/push/pushmanagement' + page,
                method: 'POST',
                dataType: 'json',
                async: true,
                beforeSend: function() {
                    $("#tbody-scroll").hide();
                    // $(".loading-overlay").fadeIn(300);
                    $(".loading-overlay").show();
                },
                error: function(data, status, errThrown){
                    $(".loading-overlay").hide();
                    $("#tbody-scroll").fadeIn(300);
                    window.location='/';
                    // setTimeout(function(){
                    //     catch_scrollable();
                    // }, 400);
                },
                success: function(data){
                    $(".loading-overlay").fadeOut(300);
                    $(".tbody-scroll").fadeIn(300).show();
                    $("#pagination").show();
                    // setTimeout(function(){
                    //     catch_scrollable();
                    // }, 400);
                }
            }).done(function(response) {
                if (response.status == 'success' && Object.keys(response.data.rows).length > 0) {
                    $v.rows = response.data.rows.data;
                    $v.pagination.currentPage = response.data.rows.current_page;
                    //if(response.data.rows.last_page>1){
                        $v.pagination.markup = convertPaginationMarkup(response.data.paginationMarkup, $v.pagination.currentPage, '$v.getRows');
                    //}

                } else {
                        $v.rows = [];
                        $v.pagination.currentPage = -1;
                        $v.pagination.markup = '';
                }
            });
            scrollToResults();
        }
    },
    filters: {
        truncate: function(string, value) {
            return (string.length > value)?(string.substring(0, value) + '...'):string;
        },
        dateTimeFormat: function(string) {
            return moment(string).format('YYYY/MM/DD HH:mm').replace('Invalid date','');
        }
    }

});



//handle AJAX supplied pagination - this can be moved to your main app library and used on other pages
function convertPaginationMarkup(markup, currentPage, onClickMethod) {
    var miniDOM = $(markup);
    //remove HREFs and add vue code
    $.each(miniDOM.find('a'), function() {
        var $link = $(this), linkValue = $link.html();
        //parse link value - is actual page number that we're after
        if (isNaN(parseInt(linkValue))) {
            if (linkValue === '次') {
                fetchPage = currentPage + 1;
            }
            if (linkValue === '前') {
                fetchPage = currentPage - 1;
            }
        } else {
            fetchPage = parseInt(linkValue);
        }
        //remove straight up href
        $link.attr('href', 'javascript:void(0)');
        //add onclick event to load next page via AJAX rather than straight up href
        $link.attr('onclick', onClickMethod + '(' + fetchPage + ')');

    });

    //use the innerHTML of a DOM clone to convert the HTML object to HTML string

    return $('<div>').append(miniDOM.clone()).html();

}

function orderPush(thisimg){

    if ($(thisimg).attr("src") == "/img/updown.png") {
        $('.sort-img').each(function() {
            $( this ).attr("src","/img/updown.png");
        });

        sorted = "desc";
        $(thisimg).attr("src","/img/sorted.png");

    } else if ($(thisimg).attr("src") == "/img/sorted.png") {

        $('.sort-img').each(function() {
            $( this ).attr("src","/img/updown.png");
        });

        sorted = "asc";
        $(thisimg).attr("src","/img/sorted_reverse.png");

    } else if ($(thisimg).attr("src") == "/img/sorted_reverse.png") {

        $('.sort-img').each(function() {
            $( this ).attr("src","/img/updown.png");
        });

        sorted = "desc";
        $(thisimg).attr("src","/img/sorted.png");

    }

    order = $(thisimg).data("id");

    $v.getRows(1);
}

