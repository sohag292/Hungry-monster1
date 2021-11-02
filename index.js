const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

//Functions
function searchMeal(e){
    e.preventDefault();
    singleMealEl.innerHTML='';

    const term =search.value;
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res=>res.json())
        .then(data=>{
            resultHeading.innerHTML=`<h2> search results for ${term}: </h2>`;

            if(data.meals===null){
                resultHeading.innerHTML=` There ara no search result.Try again!`;
            }else{
                mealsEl.innerHTML=data.meals.map(meal=> `
                <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3> ${meal.strMeal} </h3>
                 </div>
                 </div>
                `).join('');
            }
        });
        search.value="";
    }else{
        alert('please enter a search term');
    }
}

//Fetch meal by Id
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res=>res.json())
        .then(data=>{
            const meal = data.meals[0];
            addMealToDOM(meal);
            
        });
}

//Fetch meal form Api
function getDetailsMeal(mealID){
    mealsEl.innerHTML='';
    resultHeading.innerHTML='';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealID}`)
        .then(res=>res.json())
        .then(data=>{
            const meal = data.meals;
            addMealToDOM(meal);
            
            
        });
}

//add meal
function addMealToDOM(meal){
    const ingredients =[];

    for(let i = 1; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }
    singleMealEl.innerHTML=`
        <div class =""single-meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>

            <div class="main">
                <h1>Food Name: ${meal.strMeal} </h1>
                <h2 class="head">Intredients </h2>
                <ol>
                    ${ingredients.map(ing=> `<li>${ing}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
}

//Event listeners
submit.addEventListener('submit', searchMeal);
meals.addEventListener('click', getDetailsMeal);

mealsEl.addEventListener('click', e=>{
    const mealInfo = e.path.find(item=>{
        if(item.classList){
            return item.classList.contains('meal-info')
        }else{
            return false;
        }
    });
    if(mealInfo){
        const mealID=mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
})