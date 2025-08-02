<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InterestCategory;
use App\Models\Interest;
use App\Models\UserInterest;

class InterestController extends Controller
{
    public function getCategories()
    {
        $categories = InterestCategory::all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function getInterests(Request $request)
    {
        $category = $request->query('category', 'all');
        $userId = session('user_id');

        if ($category === 'all') {
            $interests = Interest::all();
        } else {
            $categoryObj = InterestCategory::where('value', $category)->first();
            if ($categoryObj) {
                $interests = Interest::where('category_id', $categoryObj->id)->get();
            } else {
                $interests = collect();
            }
        }

        foreach ($interests as $interest) {
            $interest->category_name = $interest->category->name;
            $userInterest = UserInterest::where('user_id', $userId)
                                      ->where('interest_id', $interest->id)
                                      ->first();
            $interest->user_has_interest = $userInterest ? true : false;
        }

        return response()->json([
            'success' => true,
            'data' => $interests
        ]);
    }

    public function getUserInterests(Request $request)
    {
        $category = $request->query('category', 'all');
        $userId = session('user_id');

        if ($category === 'all') {
            $userInterests = UserInterest::where('user_id', $userId)->get();
        } else {
            $categoryObj = InterestCategory::where('value', $category)->first();
            if ($categoryObj) {
                $userInterests = UserInterest::where('user_id', $userId)
                    ->whereHas('interest', function($query) use ($categoryObj) {
                        $query->where('category_id', $categoryObj->id);
                    })->get();
            } else {
                $userInterests = collect();
            }
        }

        $interests = [];
        foreach ($userInterests as $userInterest) {
            $interest = $userInterest->interest;
            $interest->category_name = $interest->category->name;
            $interest->user_has_interest = true;
            $interests[] = $interest;
        }

        return response()->json([
            'success' => true,
            'data' => $interests
        ]);
    }

    public function toggleInterest(Request $request)
    {
        $interestId = $request->input('interestId');
        
        if (!$interestId || empty($interestId) || $interestId <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'ID interesse non valido o mancante'
            ]);
        }

        $userId = session('user_id');
        $interestId = (int) $interestId;

        $userInterest = UserInterest::where('user_id', $userId)
                                   ->where('interest_id', $interestId)
                                   ->first();

        if ($userInterest) {
            UserInterest::where('user_id', $userId)
                       ->where('interest_id', $interestId)
                       ->delete();
            return response()->json([
                'success' => true,
                'action' => 'removed',
                'interestId' => $interestId,
                'message' => 'Interesse rimosso con successo'
            ]);
        } else {
            $newUserInterest = new UserInterest();
            $newUserInterest->user_id = $userId;
            $newUserInterest->interest_id = $interestId;
            $newUserInterest->added_at = now();
            $newUserInterest->save();
            
            return response()->json([
                'success' => true,
                'action' => 'added',
                'interestId' => $interestId,
                'message' => 'Interesse aggiunto con successo'
            ]);
        }
    }
}