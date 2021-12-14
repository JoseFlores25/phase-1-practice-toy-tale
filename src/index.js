document.addEventListener("DOMContentLoaded", () => {
  toyFormContainer.style.display = "none";
});

fetch("http://localhost:3000/toys")
  .then((resp) => resp.json())
  .then((toys) => {
    renderToys(toys);
  });

document
  .querySelector(".add-toy-form")
  .addEventListener("submit", handleCreateToy);

function renderToys(toys) {
  const div = document.getElementById("toy-collection");

  toys.forEach((toy) => {
    div.append(renderOneToy(toy));
  });
}

function renderNewToy(toy) {
  const div = document.getElementById("toy-collection");

  div.append(renderOneToy(toy));
}

function renderOneToy(toyObj) {
  const div = document.createElement("div");
  div.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = toyObj.name;
  div.append(h2);

  const img = document.createElement("img");
  img.className = "toy-avatar";
  img.src = toyObj.image;
  img.alt = `Image of ${toyObj.name}`;
  div.append(img);

  const p = document.createElement("p");
  p.textContent = toyObj.likes;
  div.append(p);

  const btn = document.createElement("button");
  btn.className = "like-btn";
  btn.id = toyObj.id;
  btn.textContent = "Like ❤️";
  btn.addEventListener("click", handleLike);
  div.append(btn);

  return div;
}

function handleCreateToy(event) {
  const newToy = document.querySelectorAll(".add-toy-form input.input-text");

  event.preventDefault();

  const formData = {
    name: newToy[0].value,
    image: newToy[1].value,
  };

  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  };

  fetch("http://localhost:3000/toys", configObj)
    .then(function (response) {
      return response.json();
    })
    .then(function (object) {
      renderNewToy(object);
    })
    .catch(function (error) {
      alert(`Adding new toy failed with error: \n[${error.message}]`);
      console.log(error.message);
    });

  event.target.reset();
}

function handleLike(event) {
  const id = event.target.id;
  const likeElement = event.target.parentElement.querySelector("p");
  let likesCount = parseInt(likeElement.textContent);

  likesCount += 1;

  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      likes: likesCount,
    }),
  })
    .then((res) => res.json())
    .then((updatedToy) => {
      console.log(updatedToy);
      likeElement.textContent = likesCount;
    });
}
