<?php

namespace App\Http\Controllers;

use DB;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getLogin()
    {
        return view('user.login');
    }

    public function postLogin(LoginRequest $request)
    {
        $user = $request->user;
        $pass = $request->pass;

        $lstUser = DB::table('M_USER')->get();

        if($this->checkLogin($user,$pass,$lstUser)){
            echo 'Success';
        }else{
            echo 'Fail';
        }


    }

    private function checkLogin($user, $pass, $lstUser)
    {

        foreach ($lstUser as $mem) {
            if ($user == $mem->USER_NAME && $pass == $mem->PWD) {
                return true;
            }
        }
        return false;

    }


}
