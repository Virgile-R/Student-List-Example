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
function createElement(elementName, arrayProperty){
   const element = document.createElement(elementName);
   for (let i =0; i< arrayProperty.length; i++ ) {
      element[arrayProperty[i]['prop']] = arrayProperty[i]['value'];
   }
   return element;
}

/***
 * returns a li HTML element with student information and proper formating. takes an object as an argument.
 */
function createLI(student) {
   function appendToLI(elementName, arrayProperty){
      const element = createElement(elementName, arrayProperty);
      listElement.appendChild(element);
      return element;
     } 
   const listElement = document.createElement("li");
   listElement.className ="student-item cf";
   const divStudent = appendToLI('div', [{prop: "className", value: 'student-details'}]);
   divStudent.appendChild(createElement('img',  [
      {prop: "className", value: "avatar"},
      {prop :"src", value: `${student.picture.thumbnail} `},
      {prop: "alt", value: "profile picture"}
   ]));
   divStudent.appendChild(createElement('h3', [{prop :'textContent', value: `${student.name.title} ${student.name.first} ${student.name.last} `}]));
   divStudent.appendChild(createElement('email', [
      {prop: "className", value: "email"}, 
      {prop: "textContent", value: `${student.email}`}
   ]));
   const divJoined = appendToLI('div', [{prop:'className', value: 'joined-details'}]);
   divJoined.appendChild(createElement('span', [
      {prop: "className", value:'date'}, 
      {prop: "textContent", value: `${student.registered.date}`}
   ]));
   return listElement
}

let itemPerPage = 9 //items per page should probably be a variable in case we want to add a feature to change the displayed number...


/***
* Create the `showPage` function
* This function will create and insert/append the elements needed to display a "page" of nine students
* list parameter represent student data that will be passed as an argument when the function is called.
* page parameter represent the page number that will be passed as an argument when the function is called.
*/
function showPage(list, page) {
   const startIndex = (page * itemPerPage) - itemPerPage; 
   const endIndex = page * itemPerPage;
   const studentList = document.querySelector('.student-list');
   studentList.innerHTML = '';
   for (let i = 0; i < list.length; i++) {
      if (i >= startIndex && i < endIndex){
         const li = createLI(list[i]);
         
         studentList.insertAdjacentElement('beforeend', li)
         
      }



   }

}

/***
 * Search bar function: inserts a search bar to the top of the page and handles its functionalities. takes a list as an argument
 */

function searchBar (list){
   function noResultDivCreator() {
      const noResultDiv = document.createElement('div');
      const studentList = document.querySelector('.student-list');
      const pageList = document.querySelector('.link-list');
      studentList.innerHTML = "";
      pageList.innerHTML ="";
      noResultDiv.innerHTML = "No matches were found.";
      studentList.appendChild(noResultDiv);
   }
   
   function createSearchBar() {
      const header = document.querySelector('header')
      const searchBar = document.createElement('label')
      searchBar.for ='search'
      searchBar.className ="student-search"
      searchBar.appendChild(createElement('span', [])) //Does Javascript have optional args like python?
      searchBar.appendChild(createElement('input', [
         {prop: "id", value: "search"},
         {prop: "placeholder", value:"Search by name..."}
      ]))
      searchBar.appendChild(createElement('button', [{prop: "type", value: "button"}])).appendChild(createElement('img', [
         {prop: 'src', value:'img/icn-search.svg'},
         {prop: 'alt', value:'Search icon'}]))
      header.insertAdjacentElement('beforeend', searchBar)   
      }  
      
   function searchStudentsName(list) {
      const searchField = document.querySelector("#search")
      const searchString = searchField.value.toLowerCase();
      let searchResults = [];
      const filter = list.filter(hit => { //inspired by https://www.jamesqquick.com/blog/build-a-javascript-search-bar
         let fullName = hit.name.first.toLowerCase() + ' ' + hit.name.last.toLowerCase()
         if (hit.name.first.toLowerCase().includes(searchString) || hit.name.last.toLowerCase().includes(searchString) || fullName.includes(searchString)){
            searchResults.push(hit)
         }
      }); 
      return searchResults
   }
   createSearchBar()
   const searchField = document.querySelector("#search")
   searchField.addEventListener('keyup', () =>{
      const searchResults = searchStudentsName(list)      
      if (searchResults.length === 0){
            noResultDivCreator()
            
      }  else {
         showPage(searchResults, 1);
         addPagination(searchResults);
      }
   })
   
   const searchButton = searchField.nextSibling
   searchButton.addEventListener('click', () =>{
      const searchResults = searchStudentsName(list) 
      if (searchResults.length === 0){
            noResultDivCreator()
            
         }  else {
         showPage(searchResults, 1);
         addPagination(searchResults);
      }
         
      })
   }   


   
   

   


/***
* Create the `addPagination` function
* This function will create and insert/append the elements needed for the pagination buttons
*/
function addPagination(list) {
   const numberOfPages = Math.round(list.length/itemPerPage);
   const pageList = document.querySelector('.link-list');
   pageList.innerHTML = " ";
   if (numberOfPages > 1){  
   for (i = 1; i <=numberOfPages; i++){
      const li = document.createElement("li")
      li.appendChild(createElement('button',[
         {prop: "type", value: "button"},
         {prop: "textContent", value: i}
        
      ]))
      
      pageList.insertAdjacentElement('beforeend', li)
   }
  
   const firstButton = pageList.firstElementChild.firstElementChild
   firstButton.className = "active"

   pageList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
         const buttons = document.querySelectorAll('button');
         for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active')
         }
         const button = e.target;
         
         button.classList.add("active")
         showPage(data, button.textContent)

      } 
     



   })
}}


// Call functions
showPage(data, 1)
addPagination(data)
searchBar(data)