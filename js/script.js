/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

/*
For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/

//Code reworked from the RSVP app on Treehouse.
/***
 * returns an HTML element. Accepts an element name as a string and an array of objects as proprieties to be applied (format prop:property name, value:property value)
 * exemple use: createElement("div", [{prop:"className", value: "main"}]) returns a div with the class propriety "main"
 ***/
function createElement(elementName, arrayProperty = []) {
  const element = document.createElement(elementName);
  for (let i = 0; i < arrayProperty.length; i++) {
    element[arrayProperty[i]["prop"]] = arrayProperty[i]["value"];
  }
  return element;
}

/***
 * returns a li HTML element with student information and proper formating. takes an object as an argument.
 */
function createLI(student) {
  function appendToLI(elementName, arrayProperty) {
    const element = createElement(elementName, arrayProperty);
    listElement.appendChild(element);
    return element;
  }
  const listElement = document.createElement("li");
  listElement.className = "student-item cf";
  const divStudent = appendToLI("div", [
    { prop: "className", value: "student-details" },
  ]);
  divStudent.appendChild(
    createElement("img", [
      { prop: "className", value: "avatar" },
      { prop: "src", value: `${student.picture.thumbnail} ` },
      { prop: "alt", value: "profile picture" },
    ])
  );
  divStudent.appendChild(
    createElement("h3", [
      {
        prop: "textContent",
        value: `${student.name.title} ${student.name.first} ${student.name.last} `,
      },
    ])
  );
  divStudent.appendChild(
    createElement("email", [
      { prop: "className", value: "email" },
      { prop: "textContent", value: `${student.email}` },
    ])
  );
  const divJoined = appendToLI("div", [
    { prop: "className", value: "joined-details" },
  ]);
  divJoined.appendChild(
    createElement("span", [
      { prop: "className", value: "date" },
      { prop: "textContent", value: `${student.registered.date}` },
    ])
  );
  return listElement;
}

let itemPerPage = 9; //items per page should probably be a variable in case we want to add a feature to change the displayed number...
// eslint-disable-next-line no-undef
let currentStudentSet = data;

/***
 * Create the `showPage` function
 * This function will create and insert/append the elements needed to display a "page" of nine students
 * list parameter represent student data that will be passed as an argument when the function is called.
 * page parameter represent the page number that will be passed as an argument when the function is called.
 */
function showPage(list, page) {
  const startIndex = page * itemPerPage - itemPerPage;
  const endIndex = page * itemPerPage;
  const studentList = document.querySelector(".student-list");
  studentList.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    if (i >= startIndex && i < endIndex) {
      const li = createLI(list[i]);

      studentList.insertAdjacentElement("beforeend", li);
    }
  }
}

/***
 * Search bar function: inserts a search bar to the top of the page and handles its functionalities. takes a list as an argument
 */

function searchBar(list) {
  //create a div if the search results in no matches
  function noResultDivCreator() {
    const noResultDiv = document.createElement("div");
    const studentList = document.querySelector(".student-list");
    const pageList = document.querySelector(".link-list");
    studentList.innerHTML = "";
    pageList.innerHTML = "";
    noResultDiv.innerHTML = "No matches were found.";
    studentList.appendChild(noResultDiv);
  }

  //generate the html for the search bar
  function createSearchBar() {
    const header = document.querySelector("header");
    const searchBar = document.createElement("label");
    searchBar.for = "search";
    searchBar.className = "student-search";
    searchBar.appendChild(createElement("span")); 
    searchBar.appendChild(
      createElement("input", [
        { prop: "id", value: "search" },
        { prop: "placeholder", value: "Search by name..." },
      ])
    );
    searchBar
      .appendChild(createElement("button", [{ prop: "type", value: "button" }]))
      .appendChild(
        createElement("img", [
          { prop: "src", value: "img/icn-search.svg" },
          { prop: "alt", value: "Search icon" },
        ])
      );
    header.insertAdjacentElement("beforeend", searchBar);
  }

  //returns an array with the search results
  function searchStudentsName(list) {
    const searchField = document.querySelector("#search");
    const searchString = searchField.value.toLowerCase();
    let searchResults = [];
    list.filter((hit) => {
      //inspired by https://www.jamesqquick.com/blog/build-a-javascript-search-bar
      let fullName =
        hit.name.first.toLowerCase() + " " + hit.name.last.toLowerCase();
      if (
       
        fullName.includes(searchString)
      ) {
        searchResults.push(hit);
      }
    });

    return searchResults;
  }
  createSearchBar();
  const searchField = document.querySelector("#search");
  searchField.addEventListener("keyup", () => {
    const searchResults = searchStudentsName(list);
    currentStudentSet = searchResults;
    if (searchResults.length === 0) {
      noResultDivCreator();
    } else {
      showPage(searchResults, 1);
      addPagination(searchResults);
    }
  });

  const searchButton = searchField.nextSibling;
  searchButton.addEventListener("click", () => {
    const searchResults = searchStudentsName(list);
    currentStudentSet = searchResults;
    if (searchResults.length === 0) {
      noResultDivCreator();
    } else {
      showPage(searchResults, 1);
      addPagination(searchResults);
    }
  });
}

/***
 * Create the `addPagination` function
 * This function will create and insert/append the elements needed for the pagination buttons
 */
function addPagination(list) {
  const numberOfPages = Math.ceil(list.length / itemPerPage);
  const pageList = document.querySelector(".link-list");
  pageList.innerHTML = " ";
  if (numberOfPages > 1) {
    const li = document.createElement("li");
    li.appendChild(
      createElement("button", [
        { prop: "type", value: "button" },
        { prop: "textContent", value: "Prev. Page" },
        { prop: "className", value: "nav-btn-prev" },
      ])
    );
    for (let i = 1; i <= numberOfPages; i++) {
      li.appendChild(
        createElement("button", [
          { prop: "type", value: "button" },
          { prop: "textContent", value: i },
        ])
      );

      pageList.insertAdjacentElement("beforeend", li);
    }
    li.appendChild(
      createElement("button", [
        { prop: "type", value: "button" },
        { prop: "textContent", value: "Next Page" },
        { prop: "className", value: "nav-btn-next" },
      ])
    );

    const firstButton =
      pageList.firstElementChild.firstElementChild.nextSibling;
    firstButton.className = "active";
  }
}
const pageList = document.querySelector(".link-list");
pageList.addEventListener("click", (e) => {
  const buttons = document.querySelectorAll("button");
  if (
    e.target.tagName === "BUTTON" &&
    e.target.className !== "nav-btn-prev" &&
    e.target.className !== "nav-btn-next"
  ) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active");
    }
    const button = e.target;

    button.classList.add("active");
    showPage(currentStudentSet, button.textContent);
  } else if (e.target.className === "nav-btn-prev") {
    const currentPageButton = document.querySelector(".active");
    const currentPageNumber = parseInt(currentPageButton.textContent);
    if (parseInt(currentPageNumber) > 1) {
      currentPageButton.classList.remove("active");
      currentPageButton.previousSibling.classList.add("active");

      showPage(currentStudentSet, currentPageNumber - 1);
    }
  } else if (e.target.className === "nav-btn-next") {
    const currentPageButton = document.querySelector(".active");
    const currentPageNumber = parseInt(currentPageButton.textContent);
    if (!(currentPageButton.nextSibling.className === "nav-btn-next")) {
      currentPageButton.classList.remove("active");
      currentPageButton.nextSibling.classList.add("active");
      showPage(currentStudentSet, currentPageNumber + 1);
    }
  }
});

// Call functions
// eslint-disable-next-line no-undef
showPage(data, 1);
// eslint-disable-next-line no-undef
addPagination(data);
// eslint-disable-next-line no-undef
searchBar(data);


