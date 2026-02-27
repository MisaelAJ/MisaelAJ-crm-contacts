<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:200',
            'phone' => 'required|string|max:20',
            'company' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|nullable',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
