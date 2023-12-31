"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  try {
    hidePageComponents();
    putStoriesOnPage();
  } catch (error) {
    console.error("Error fetching and showing stories:", error);
  }

}

$body.on("click", "#nav-all", navAllStories);

function navSubmitStoryClick(evt) {
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);

function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navMyStories(evt) {
  try {
    hidePageComponents();
    putUserStoriesOnPage();
    $ownStories.show();
  } catch {
    console.log("Error fetching and showing stories:", error);
  }
}

$body.on("click", "#nav-my-stories", navMyStories);

function navUserProfileClick(evt) {
  console.log("navUserProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navUserProfileClick);