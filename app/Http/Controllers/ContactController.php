<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ContactController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $allowedSorts = ['name', 'created_at'];
        $dir = strtolower($request->query('dir')) === 'asc' ? 'asc' : 'desc';
        $sort = in_array($request->query('sort'), $allowedSorts) ? $request->query('sort') : 'created_at';

        $contacts = Contact::query()
            ->where('user_id', $request->user()->id)
            ->when($request->query('q'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $dir)
            ->paginate($request->query('per_page', 10));

        return ContactResource::collection($contacts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        $this->authorize('create', Contact::class);

        $contact = $request->user()->contacts()->create($request->validated());

        return new ContactResource($contact);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        $this->authorize('view', $contact);

        return new ContactResource($contact);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $this->authorize('update', $contact);

        $contact->update($request->validated());

        return new ContactResource($contact);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $this->authorize('delete', $contact);

        $contact->delete();

        return response()->json(null, 204);
    }
}
