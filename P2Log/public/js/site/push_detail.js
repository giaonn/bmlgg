$(document).ready(function(){

    $('#btn-apply').click(function(){
        $('#applyModal').modal('show');
        $('#btnApply').click(function(){
            var push_id = getParameterByName('push_id');
            $.ajax({
                type: "POST",
                url: "/push/push_detail",
                data: {'push_id': push_id, 'action': 2},
                dataType: "json",
                beforeSend: function(){

                },
                error: function () {
                    $('#failed_alert').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>データが既に更新されました。画面をリロードし、もう一度やり直してください。</div>');
                },
                success: function (data) {
                    if (data) {
                        $('#success_alert').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>お知らせ送信を承認しました。</div>');
                        $('#btn-apply').attr('disabled', 'disabled');
                        $('#btn-success').attr('disabled', 'disabled');
                    }
                }
            });

            $('#applyModal').modal('hide');
        });
    });
    $('#btn-stop').click(function(){
        $('#stopModal').modal('show');
        $('#btnStop').click(function(){
            var push_id = getParameterByName('push_id');
            console.log(push_id);
            $.ajax({
                type: "POST",
                url: "/push/push_detail",
                data: {'push_id':push_id,'action':4},
                dataType: "json",
                beforeSend: function(){

                },
                error: function () {
                    $('#failed_alert').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>データが既に更新されました。画面をリロードし、もう一度やり直してください。</div>');
                },
                success: function (data) {
                if (data){
                    $('#success_alert').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>お知らせ送信を中止しました。</div>');

                    $('#btn-apply').attr('disabled','disabled');
                    $('#btn-success').attr('disabled','disabled');
                    $('#btn-stop').attr('disabled','disabled');
                }
                }
            });

            $('#stopModal').modal('hide');
        });
    });
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}