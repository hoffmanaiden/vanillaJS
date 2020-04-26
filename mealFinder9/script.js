const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal')
;


function searchMeal(e) {
  e.preventDefault();

  // clear single meal
  single_mealEl.innerHTML="";

  // Get search term
  const searchTerm = search.value;
  if(searchTerm.trim()){
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then(res => res.json())
      .then(data => {
        resultHeading.innerHTML=`<p>search results for '${searchTerm}':</p>`;

        if(data.meals === null){
          resultHeading.innerHTML = `<p>'${searchTerm}' found no results.</p>`;
        } else {
          mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealId="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `).join('');
        }
      });
      // Clear search text
      search.value = '';
  } else {
    alert('Please enter a search term.');
  }
}

function addMealToDom(meal){

  const ingredients = [];
  for(let i=1; i<=20; i++){
    if(meal[`strIngredient${i}`]){
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<span>${meal.strCategory}</span>` : ''}
        ${meal.strCategory && meal.strArea ? `<span> - </span>` : ''}
        ${meal.strArea ? `<span>${meal.strArea}</span>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function getMealById(id){
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDom(meal);
    })
}

function randomMeal() {
  // clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
      const randomMeal = data.meals[0];
      addMealToDom(randomMeal);
    })
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if(item.classList){
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if(mealInfo) {
    const mealId = mealInfo.getAttribute('data-mealId');
    getMealById(mealId);
  }
});

