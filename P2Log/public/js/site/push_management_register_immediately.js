var submitted = false;
var formHasChanged = false;

$(document).ready(function() {
    $('#push_register_immediately_form').formValidation({
        framework: 'bootstrap',
        // excluded: [':disabled'],
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // err: {
        //     // You can set it to popover
        //     // The message then will be shown in Bootstrap popover
        //     container: 'tooltip'
        // },
        fields: {
            push_title : {
                validators: {
                    notEmpty: {
                        message: 'タイトルを入力してください'
                    },
                    stringLength: {
                        max: 64,
                        message: 'タイトルは64文字以内で入力してください。'
                    }
                }
            },
            push_body : {
                validators: {
                    notEmpty: {
                        message: '本文を入力してください'
                    },
                    // stringLength: {
                    //     max: 1024,
                    //     message: '本文は1024文字以内で入力してください。'
                    // },
                    callback: {
                        callback: function (value, validator, $field) {
                            if (value.trim() === '') {
                                return true;
                            }
                            //I'm guessing JavaScript is treating a newline as one character rather than two so when I try to insert a "max length" string into the database I get an error.
                            //Detect how many newlines are in the textarea, then be sure to count them twice as part of the length of the input.
                            var newlines = (value.match(/\n/g) || []).length;
                            if (value.trim().length + newlines > 1024) {
                                return {
                                    valid: false,
                                    message: '本文は1024文字以内で入力してください'
                                }
                            }

                            return true;
                        }
                    }
                }
            },
            start_date : {
                validators: {
                    // notEmpty: {
                    //     message: '開始日を入力してください。'
                    // },
                    date: {
                        format: 'YYYY/MM/DD HH:mm',
                        max: 'end_date',
                        message: '開始日は日時形式(yyyy/MM/dd hh24:mi)で入力してください。'
                    }
                }
            },
            end_date : {
                validators: {
                    // notEmpty: {
                    //     message: '終了日を入力してください。'
                    // },
                    date: {
                        format: 'YYYY/MM/DD HH:mm',
                        min: 'start_date',
                        message: '終了日は日時形式(yyyy/MM/dd hh24:mi)で入力してください。'
                    }
                }
            }

        }
    }).on('success.form.fv', function(e) {
        // Retrieve instances
        var $form = $(e.target);        // The form instance
        //    fv    = $(e.target).data('formValidation'); // FormValidation instance

        // check the submit request from input window or preview window
        if ($form.find("#push_register_immediately_preview_wrapper").is(":visible")){
            window.onbeforeunload = null;
            $('#loading_overlay').show();
            $("#push_register_immediately_form").unbind('submit').submit();
        } else {
            // Prevent form submission
            //e.preventDefault();
            // Do whatever you want here ...
            //$form.submit();
            $("input[type=text]").each(function (e) {
                var val = $(this).val();
                var id = $(this).attr("id");
                var preview_id = id + "_preview";
                $("#" + preview_id).html(val);
            });

            $("#push_body_preview").html($("#push_body").val().replace(/\n/g, '<br \\>'));

            var startDate = $("#start_date").val();
            var endDate = $("#end_date").val();
            if(startDate.trim() == '' && endDate.trim() == ''){
                $("#daterange_preview").html("無期限");
            }else {
                $("#daterange_preview").html(startDate + " ~ " + endDate);
            }

            // $("#loading_overlay").show();
            $("#push_register_immediately_input_wrapper").fadeOut(500, function () {
                $("#push_register_immediately_preview_wrapper").fadeIn(500, function () {
                    // $("#loading_overlay").hide()
                });
            });
            return false;
        }

    });

    window.onbeforeunload = function (event) {
        var message = '登録が完了してません。変更点が破棄されます。中止してよろしいですか？';
        if (typeof event == 'undefined') {
            event = window.event;
        }
        if (event) {
            event.returnValue = message;
        }

        return message;
    };


    $("#back_register_immediately").click(function() {
        confirmBack("/push/pushmanagement");
    });

    $("#menu1").click(function(event) {
        event.preventDefault();
        var href = event.target.href;
        confirmBack(href);
    });

    $("#menu2").click(function(event) {
        event.preventDefault();
        var href = event.target.href;
        confirmBack(href);
    });

    $("#menu3").click(function(event) {
        event.preventDefault();
        var href = event.target.href;
        confirmBack(href);
    });

    $('#push_title').change(function () {
        formHasChanged = true;
    });
    $('#push_body').change(function () {
        formHasChanged = true;
    });
    $('#start_date').mouseenter(function () {
        formHasChanged = true;
    });
    $('#end_date').mouseenter(function () {
        formHasChanged = true;
    });

});


function confirmBack(href) {
    window.onbeforeunload = null;
    if(isEmpty($("#push_title").val())&& isEmpty($("#push_body").val())&& isEmpty($("#push_start_date").val())&&isEmpty($("#push_end_date").val())){
        location.href = href;
    }else {
        bootbox.setDefaults({locale:"ja"});
        bootbox.confirm( {
            message: "登録が完了してません。変更点が破棄されます。中止してよろしいですか？",
            callback:  function(result) {
                if(result == true) {
                    location.href = href;
                }else {
                    window.onbeforeunload = function (event) {
                        var message = '登録が完了してません。変更点が破棄されます。中止してよろしいですか？';
                        if (typeof event == 'undefined') {
                            event = window.event;
                        }
                        if (event) {
                            event.returnValue = message;
                        }

                        return message;
                    };
                }
            }
        });
    }
}


function showPreview(){
    $("#push_register_immediately_form").submit();
}

function cancelPreview(){
    // $("#loading_overlay").show();
    $("#push_register_immediately_preview_wrapper").fadeOut(500, function(){
        $("#push_register_immediately_input_wrapper").fadeIn(500, function(){
            // $("#loading_overlay").hide();
        });
    });
    return false;
}

function savePush(){
    next_request ='true';
    $('#publish_push_register_immediately').attr('disabled','disabled');
    $("#push_register_immediately_form").submit();
}