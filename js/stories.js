"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

let currentPage = 1;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  try {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();
    putStoriesOnPage();
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
}


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
  <li id="${story.storyId}">
    ${showDelete ? getDeleteBtn() : ""}
    ${showStar ? getStar(story, currentUser) : ""}
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <br>
    <small class="story-author" style="color: green;">by ${story.author}</small>
    <br>
    <small class="story-user" style="color: orange;">posted by ${story.username}</small>
  </li>
`);

}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


function getDeleteBtn() {
  return `<span class="trash-can">
  <i class="fas fa-trash-alt"></i>
</span>`;
}

function getStar(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>`;
}

async function deleteStory(evt) {
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  putUserStoriesOnPage();
}
$ownStories.on("click", ".trash-can", deleteStory);

async function submitNewStory(evt) {
  evt.preventDefault();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };
  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

function putUserStoriesOnPage() {
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories yet!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

function putFavoritesListOnPage() {
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites yet!</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

async function toggleStoryFavorite(evt) {
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
