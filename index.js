import reddit from "./redditapi.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Form Event Listener
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get Search Term
  const searchTerm = searchInput.value;

  //Get Sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;

  // Get limit
  const searchLimit = document.getElementById("limit").value;

  // Check for empty input
  if (searchTerm === "") {
    // Show message
    showMessage("Please add a search term", "danger");
  }

  // Reset input (search) field
  searchInput.value = "";

  //Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then((results) => {
    let output = `<div class="card-columns">`;
    // console.log(results);

    // Loop though posts
    results.forEach((post) => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://bolojawan.com/wp-content/uploads/2021/05/2qy7unjo2j331.png";

      output += `
                <div class="card">
                    <img class="card-img-top" src="${image}" alt="Card image cap" >
                    <div class="card-body overflow-hidden">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${truncateText(
                          post.selftext,
                          100
                        )}</p>
                        <a href="https://www.reddit.com${
                          post.permalink
                        }" class="btn post_btn" target="_blank">Go To Post</a>
                        <hr>
                        <div id="badge_div">
                            <span class="badge badge-secondary">Subreddit: ${
                              post.subreddit
                            }</span>
                            <span class="badge badge-dark">Score: ${
                              post.score
                            }</span>
                        </div>
                    </div>
                </div>
                `;
    });
    output += "</div>";

    document.getElementById("results").innerHTML = output;
  });
});

// Show Message
function showMessage(message, className) {
  // Create div
  const div = document.createElement("div");
  //Add Classes
  div.className = `alert alert-${className}`;
  // Add message text
  div.appendChild(document.createTextNode(message));

  //Add message div to our form:
  // Get parent
  const searchContainer = document.getElementById("search-container");
  // Get Search
  const search = document.getElementById("search");
  // Insert Message to DOM
  searchContainer.insertBefore(div, search);

  // Timeout alert 3 seconds
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
}

// Truncate Text
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
}
