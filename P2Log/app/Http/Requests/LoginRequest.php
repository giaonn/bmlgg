<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user' => 'required|min:8|max:15|regex:/[A-Za-z0-9]$/',
            'pass' =>'required|min:8|max:20|regex:/[A-Za-z0-9]$/'
        ];
    }


    public function messages()
    {
        return[
            'user.required' => 'IDまたはパスワードが不正です。',
            'user.min' => 'IDまたはパスワードが不正です。',
            'user.max' => 'IDまたはパスワードが不正です。',
            'user.regex' => 'IDまたはパスワードが不正です。',
            'pass.required' => 'IDまたはパスワードが不正です。',
            'pass.min' => 'IDまたはパスワードが不正です。',
            'pass.max' => 'IDまたはパスワードが不正です。',
            'pass.regex' => 'IDまたはパスワードが不正です。'
        ];
    }

}
