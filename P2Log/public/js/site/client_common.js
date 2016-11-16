var showed = false;

$(document).ready(function() {
    var dateUTCtime = new Date().toISOString();

    $('#start_date_div').datetimepicker({
        locale: 'ja',
        sideBySide: true,
        format: 'YYYY/MM/DD HH:mm',
        useCurrent: false,
        // minDate: dateUTCtime
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'start_date');
        $('#end_date_div').data("DateTimePicker").minDate(e.date);

    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            $(this).data('DateTimePicker').date(moment().format("YYYY/MM/DD HH:mm"));
        }
    });

    $('#start_date').on('click',function (e) {
        $('#start_date_span').click();
    });

    $('#end_date_div').datetimepicker({
        useCurrent: false, //Important! See issue #1075
        sideBySide: true,
        locale: 'ja',
        format: 'YYYY/MM/DD HH:mm'
        // minDate: dateUTCtime
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'end_date');
        $('#start_date_div').data("DateTimePicker").maxDate(e.date);
    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            $(this).data('DateTimePicker').date(moment().format("YYYY/MM/DD" + " 23:59"));
        }
    });

    $('#end_date').on('click',function (e) {
        $('#end_date_span').click();
    });
});



function isEmpty(value){
    return (value == null || value.length === 0);
}

function get_params_from_href(href){
    var paramstr = href.split('?')[1];        // get what's after '?' in the href
    var paramsarr = paramstr.split('&');      // get all key-value items
    var params = Array();
    for (var i = 0; i < paramsarr.length; i++) {
        var tmparr = paramsarr[i].split('='); // split key from value
        params[tmparr[0]] = tmparr[1];        // sort them in a arr[key] = value way
    }
    return params;
}

function isEmail(email) {
    // add support to + sign (Nghi: 17/1/2016) START
    var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    // add support to + sign (Nghi: 17/1/2016) END
    if (regex.test(email)){
        return true;
    }
    return false;
}


function checkAlphabet(sentences) {
	var regex = /^[A-Za-z0-9]+$/i;
	if (!regex.test(sentences)){
        return false;
    }
	return true;
}

function ValidateTypeImg() {
    var fuData = document.getElementById('fileChooser');
    var FileUploadPath = fuData.value;

    //To check if user upload any file
    if (FileUploadPath == '') {
        return "Please upload an image";

    } else {
        var Extension = FileUploadPath.substring(
            FileUploadPath.lastIndexOf('.') + 1).toLowerCase();

        //The file uploaded is an image

        if (Extension == "gif" || Extension == "png" || Extension == "bmp"
            || Extension == "jpeg" || Extension == "jpg") {

            // To Display
            if (fuData.files && fuData.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $('#blah').attr('src', e.target.result);
                };

                reader.readAsDataURL(fuData.files[0]);
            }

        }

        //The file upload is NOT an image
        else {
            alert("Photo only allows file types of GIF, PNG, JPG, JPEG and BMP. ");

        }
    }
}

/**
 * Toggle header (search, favorite artist, high five)
 */ 
function isActived(obj) {
	if(obj.hasClass('active')) {
		return true;
	}
	return false;
}

function toggleHeader(obj) {	
	$('li a', obj.closest('ul')).removeClass('active');
	obj.addClass('active');
}

function formatNumber(num) {
    num += '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(num)) {
        num = num.replace(rgx, '$1' + ',' + '$2');
    }
    return num;
}