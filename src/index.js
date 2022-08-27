document.addEventListener("DOMContentLoaded", init)

const filterDogsButton = document.querySelector("#good-dog-filter")
// filterDogsButton.addEventListener("click", toggleFilterDogs)
function init(){
  getDogs().then(addAllDogsToDogBar)
}

//filtering the dogs
function toggleFilterDogs(){
  if (filterDogsButton.innerText.includes("OFF")){
    filterDogsButton.innerText = "Filter good dogs: ON"
    updateDogBar()
  } else {
    filterDogsButton.innerText = "Filter good dogs: OFF"
    updateDogBar()
  }
}

//adding dogs to the bar
function addAllDogsToDogBar(dogArray, filter = false){
  const dogBar = document.querySelector("#dog-bar")
  dogBar.innerHTML = ""
  if (filter) {
    dogArray.filter(dog => dog.isGoodDog).forEach(addDogSpantoDogBar)
  } else {
    dogArray.forEach(addDogSpantoDogBar)
  }
}

//adding span and event listener
function addDogSpantoDogBar(dog){
  const dogBar = document.querySelector("#dog-bar")
  const dogSpan = document.createElement("span")
  dogSpan.innerText = dog.name
  dogSpan.dataset.id = dog.id

  dogSpan.addEventListener("click", onDogSpanClick)

  dogBar.append(dogSpan)
}

const onDogSpanClick = (event) =>{
  getSingleDog(event.target.dataset.id).then(addDogInfoToPage)
}

//adding info to the dog page
function addDogInfoToPage(dog){
  const dogInfo = document.querySelector("#dog-info")
  dogInfo.innerHTML = ""
  const dogImg = document.createElement("img")
  dogImg.src = dog.image

  const dogTitle = document.createElement("h2")
  dogTitle.innerText = dog.name

  const dogButton = document.createElement("button")
  dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
  dogButton.dataset.id = dog.id
  dogButton.addEventListener("click", onGoodDogButtonClick)

  dogInfo.append(dogImg, dogTitle, dogButton)
}

function onGoodDogButtonClick(event){
  let newValue;
  if (event.target.innerText.includes("Good")){
    event.target.innerText = "Bad Dog"
    newValue = false
  } else {
    event.target.innerText = "Good Dog"
    newValue = true
  }
  toggleGoodDog(event.target.dataset.id, newValue).then(updateDogBar)
}


function updateDogBar(){
  if (filterDogsButton.innerText.includes("OFF")){
    getDogs().then(dogArray => addAllDogsToDogBar(dogArray))
  } else {
    getDogs().then(dogArray => addAllDogsToDogBar(dogArray, true))
  }
}

//  fetching dogs , and  by ID
const baseURL = "http://localhost:3000/pups"

const getDogs = () =>{return fetch(baseURL).then(r => r.json())}

const getSingleDog = (id) =>{return fetch(baseURL + `/${id}`).then(resp => resp.json() )}

function toggleGoodDog(id, newValue){
  const options = {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      isGoodDog: newValue
    })
  }
  return fetch(baseURL + `/${id}`, options)
    .then(resp => resp.json())
} 