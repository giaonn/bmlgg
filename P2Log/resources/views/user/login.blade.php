<!DOCTYPE html>

<!--[if IE 8]>
<html lang="ja" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]>
<html lang="ja" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="ja">
<head>
    <meta charset="utf-8"/>
    <title>LOGIN</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">

    <script src="{!! asset('js/jquery.min.js') !!}"></script>
    <script src="{!! asset('js/bootstrap.min.js') !!}"></script>

    <link href="{!! asset('css/bootstrap.min.css') !!}" rel="stylesheet"/>
    <link href="{!! asset('css/styles.
    css') !!}" rel="stylesheet" type="text/css"/>
    <link href="{!! asset('css/login.css') !!}" rel="stylesheet" type="text/css"/>

    <link rel="shortcut icon" href="img/fav.png"/>

</head>

<body>
<div class="login">
    <div class="logo">

        <h2>Login</h2>
    </div>
    <div class="content">
        @if (count($errors) > 0)
            {!! $errors->all()[0] !!}
        @endif

        <form method="post" action={!!route('postlogin')!!}>
            <input type="hidden" name="_token" value="{!! csrf_token() !!}">


            <input type="text" name="user"><br>
            <input type="text" name="pass"><br>
            <input type="submit" value="Login">
        </form>
    </div>
</div>
</body>
</html>
