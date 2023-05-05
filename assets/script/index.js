"use strict";

import { select, print, onEvent } from "./utils.js";

// selecting Inputs
const moviesInput = select(".search-movie");
const cityInput = select(".search-city");
let listmovies = select(".autoComplete-movie");
let listCities = select(".autoComplete-city");

moviesInput.value = "";
cityInput.value = "";

// URLs for external json files
const moviesUrl = "./assets/script/movies.json";
const citiesUrl = "./assets/script/cities.json";

// Options for fetch
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  mode: "cors",
};

async function getMovies() {
  try {
    const response = await fetch(moviesUrl, options);

    if (!response.ok)
      throw new Error(`${response.statusText} ${response.status}`);

    const data = await response.json();
    const grid = select(".grid-container");
    console.log(grid);

    function getInfo(array) {
      grid.innerHTML = "";

      array.forEach((element) => {
        grid.innerHTML += ` <div class="grid-item">
        <div class="poster">
        <img
        src="${element.img}"
        alt="movie-poster"
        />
        </div>
        <p class="movie-title">${element.title}</p>
        `;
      });
    }
    getInfo(data.results);

    // Functions for auto-completion inputs
    function autoInputs(array, input) {
      onEvent(input, "keyup", function () {
        let inputValue = input.value.toLowerCase();
        removeDropdown(moviesInput);

        if (inputValue.length === 0) return;

        listmovies.innerHTML = " ";

        array.forEach((el) => {
          if (
            el.title.substr(0, inputValue.length).toLowerCase() === inputValue
          ) {
            listmovies.innerHTML += `<li><button>${el.title}</button></li>`;
          }
        });
      });
    }
    autoInputs(data.results, moviesInput);
  } catch (error) {
    print(error.message);
  }
}

getMovies();

// Remove dropdown
function removeDropdown(input, list) {
  if (input.value.length === 0) list.innerHTML = " ";
}

// getting input by clicking on list
function onclickMovies(e) {
  e.preventDefault();

  const click = e.target;
  this.value = click.innerHTML;
  listmovies.innerHTML = "";
}

onEvent(listmovies, "click", onclickMovies.bind(moviesInput));

function onclickCities(e) {
  e.preventDefault();

  const click = e.target;
  this.value = click.innerHTML;
  listCities.innerHTML = "";
}

onEvent(listCities, "click", onclickCities.bind(cityInput));

// fetching cities

async function getCities() {
  try {
    const response = await fetch(citiesUrl, options);

    if (!response.ok)
      throw new Error(`${response.statusText} ${response.status}`);

    const data = await response.json();

    function autoInput(array, input) {
      onEvent(input, "keyup", function () {
        let inputValue = input.value.toLowerCase();

        removeDropdown(cityInput, listCities);
        if (inputValue.length === 0) return;

        listCities.innerHTML = " ";

        array.forEach((el) => {
          if (
            el.name.substr(0, inputValue.length).toLowerCase() === inputValue
          ) {
            listCities.innerHTML += `<li><button>${el.name}</button></li>`;
          }
        });
      });
    }
    autoInput(data.cities, cityInput);
  } catch (error) {
    print(error.message);
  }
}

getCities();
