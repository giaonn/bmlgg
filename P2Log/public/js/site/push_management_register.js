$(document).ready(function() {
    $('#push_management_register_form').formValidation({
        framework: 'bootstrap',
        // excluded: [':disabled'],
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // err: {
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
                    //     message: '本文は1024文字以内で入力してください'
                    // },
                    callback: {
                        callback: function(value, validator, $field) {
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
                        message: '開始日は日時形式(yyyy/MM/dd hh24:mi)で入力してください。'
                    },
                    // date: {
                    //     max: 'end_date',
                    //     message: '表示期間の開始時間は終了時間よりも前の時間を設定して下さい。'
                    // }
                }
            },
            end_date : {
                validators: {
                    // notEmpty: {
                    //     message: '終了日を入力してください。'
                    // },
                    date: {
                        format: 'YYYY/MM/DD HH:mm',
                        message: '終了日は日時形式(yyyy/MM/dd hh24:mi)で入力してください。'
                    },
                    // date: {
                    //     min: 'start_date',
                    //     message: '表示期間の開始時間は終了時間よりも前の時間を設定して下さい。'
                    // }
                }
            },
            push_reservation_date : {
                validators: {
                    notEmpty: {
                        message: '送信日時を入力してください'
                    },
                    date: {
                        format: 'YYYY/MM/DD HH:mm',
                        message: '送信日時は日時形式(yyyy/MM/dd hh24:mi)で入力してください。'
                    },
                    // date: {
                    //     min: 'start_date',
                    //     message: '送信日時は表示期間の開始日時よりも前の時間を設定して下さい。'
                    // },
                    // date: {
                    //     max: 'end_date',
                    //     message: '送信日時は表示期間の終了日時よりも前の時間を設定して下さい。'
                    // },
                    callback: {
                        callback: function(value, validator, $field) {
                            if (value === '') {
                                return true;
                            }

                            // Check if the start is earlier then the end one
                            var today = moment().format('YYYY/MM/DD');
                            var date = moment(value).format('YYYY/MM/DD');
                            var hour = moment(value).hour();
                            var minute = moment(value).minute();

                            if (hour < 9 || hour > 20 || (hour === 20 && minute !== 0) ) {
                                // validator.updateMessage('push_reservation_date', 'callback', "お知らせ配信可能時間（9:00 ~ 20:00）になっていないため、登録できません。");
                                // return false;
                                return {
                                    valid: false,
                                    message: 'お知らせ配信可能時間（9:00 ~ 20:00）になっていないため、登録できません。'
                                }
                            }

                            if (today == date && (hour === 19 && minute !== 0) && ((moment().hour() === 19 && moment().minute() !== 0) || moment().hour() > 19 ) ) {
                                return {
                                    valid: false,
                                    message: '本日送信するお知らせの登録可能時間（19:00前）を超えましたため、登録できません。'
                                }
                            }

                            // var startDate = moment($("#start_date").val()).format('YYYY/MM/DD HH:mm');
                            // if (startDate != 'Invalid date'&&date < startDate)  {
                            //     return {
                            //         valid: false,
                            //         message: '送信日時は表示期間の開始日時よりも前の時間を設定して下さい。'
                            //     }
                            // }

                            // var endDate = moment($("#end_date").val()).format('YYYY/MM/DD HH:mm');
                            // if (endDate != 'Invalid date' && date > endDate)  {
                            //     return {
                            //         valid: false,
                            //         message: '送信日時は表示期間の終了日時よりも前の時間を設定して下さい。'
                            //     }
                            // }

                            return true;
                        }
                    }

                }

            }

        }
    }).on('success.form.fv', function(e) {
        // Retrieve instances
        var $form = $(e.target);        // The form instance
        //    fv    = $(e.target).data('formValidation'); // FormValidation instance

        // check the submit request from input window or preview window
        if ($form.find("#push_register_preview_wrapper").is(":visible")){
            window.onbeforeunload = null;
            $('#loading_overlay').show();
            $("#push_management_register_form").unbind('submit').submit();
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
            $("#push_register_input_wrapper").fadeOut(500, function () {
                $("#push_register_preview_wrapper").fadeIn(500, function () {
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


    var dateUTCtime = new Date();

    $("#push_reservation_date").on('click',function (e) {
        $('#push_reservation_date_span').click();
    });

    $("#push_reservation_date_div").datetimepicker({
        locale: 'ja',
        format: 'YYYY/MM/DD HH:mm',
        // defaultDate: dateUTCtime.setHours(dateUTCtime.getHours()+1),
        // minDate: dateUTCtime.toISOString(),
        useCurrent: false,
        sideBySide: true
    }).on('dp.change', function(e) {
        // Revalidate the start date field
        $('form').formValidation('revalidateField', 'push_reservation_date');
    }).on("dp.show", function(){
        if(isEmpty($(this).data("date"))){
            time = dateUTCtime.setHours(dateUTCtime.getHours()+1);
            $(this).data('DateTimePicker').date(moment(time).format("YYYY/MM/DD HH:mm"));
        }
    });



    // if($('#push_reservation_date').val().trim() == ''){
    //
    //         $("#push_reservation_date").on('click',function (e) {
    //             $('#push_reservation_date_span').click();
    //         });
    //
    //         $("#push_reservation_date_div").datetimepicker({
    //             locale: 'ja',
    //             format: 'YYYY/MM/DD HH:mm',
    //             // defaultDate: dateUTCtime.setHours(dateUTCtime.getHours()+1),
    //             // minDate: dateUTCtime.toISOString(),
    //             useCurrent: false,
    //             sideBySide: true
    //         }).on('dp.change', function(e) {
    //             // Revalidate the start date field
    //             $('form').formValidation('revalidateField', 'push_reservation_date');
    //         }).on("dp.show", function(){
    //             if(isEmpty($(this).data("date"))){
    //                 time = dateUTCtime.setHours(dateUTCtime.getHours()+1);
    //                 $(this).data('DateTimePicker').date(moment(time).format("YYYY/MM/DD HH:mm"));
    //             }
    //         });
    //
    // } else {
    //
    //
    //     $("#push_reservation_date").on('click',function (e) {
    //         $('#push_reservation_date_span').click();
    //     });
    //
    //     $("#push_reservation_date_div").datetimepicker({
    //         locale: 'ja',
    //         format: 'YYYY/MM/DD HH:mm',
    //         //minDate: dateUTCtime.toISOString(),
    //         // useCurrent: false,
    //         sideBySide: true
    //     }).on('dp.change', function(e) {
    //         // Revalidate the start date field
    //         $('form').formValidation('revalidateField', 'push_reservation_date');
    //         $('#push_reservation_date').data("DateTimePicker").minDate(dateUTCtime.toISOString());
    //     }).on("dp.show", function(){
    //         if(isEmpty($(this).data("date"))){
    //             time = dateUTCtime.setHours(dateUTCtime.getHours()+1);
    //             $(this).data('DateTimePicker').date(moment(time).format("YYYY/MM/DD HH:mm"));
    //         }
    //     });
    //
    // }

    // OCL = true;
    // $('#push_reservation_date_div').click(function(){
    //     if (OCL) {
    //         time = dateUTCtime.setHours(dateUTCtime.getHours()+1);
    //         $('#push_reservation_date').val(moment(time).format("YYYY/MM/DD HH:mm"));
    //     }
    //     OCL = false;
    // });

    $("#back_register").click(function() {
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

});

function confirmBack(href) {
    window.onbeforeunload = null;
    if(isEmpty($("#push_title").val())&& isEmpty($("#push_body").val())&& isEmpty($("#push_start_date").val())&&isEmpty($("#push_end_date").val())&&isEmpty($("#push_reservation_date").val())){
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
    $("#push_management_register_form").submit();
}

function cancelPreview(){
    // $("#push_management_register_form").un();
    // $("#loading_overlay").show();
    $("#push_register_preview_wrapper").fadeOut(500, function(){
        $("#push_register_input_wrapper").fadeIn(500, function(){
            // $("#loading_overlay").hide();
        });
    });
    return false;
}

function savePush(){
    next_request = 'true';
    $('#publish_push_register').attr('disabled','disabled');
    $("#push_management_register_form").submit();

}