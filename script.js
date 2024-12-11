const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

const toggle = document.querySelector(".toggle");

async function getUser(username) {
  try {
    const { data } = await axios.get(APIURL + username);

    userInfo(data);
    getUserRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      noUserFound("No profiles match your search");
    }

    console.log(err);
  }
}

async function getUserRepos(username) {
  try {
    const { data } = await axios.get(APIURL + username + "/repos?sort=created");

    addUserRepos(data);
  } catch (err) {
    if (err.response.status == 404) {
      noUserFound("Error fetching repos");
    }

    console.log(err);
  }
}

function userInfo(user) {
  const cardHtml = `
        <div class="card">
            <div>
            <img
                src="${user.avatar_url}"
                alt="${user.name}"
                class="avatar"
            />
            </div>

            <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            <p><i class="fas fab fa-twitter"></i> @ ${user.twitter_username}</p>

            <ul>
                <li>${user.followers}<strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>

            <div id="repos"></div>
            </div>
        </div>`;

  main.innerHTML = cardHtml;
}

function noUserFound(msg) {
  const errHtml = `
        <div class="card">
            <div>
                ${msg}
            </div>
        </div>`;

  main.innerHTML = errHtml;
}

function addUserRepos(repos) {
  const repoSection = document.getElementById("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoLinks = document.createElement("a");

    repoLinks.classList.add("repo");
    repoLinks.href = repo.html_url;
    repoLinks.target = "_blank";
    repoLinks.innerText = repo.name;

    repoSection.appendChild(repoLinks);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
