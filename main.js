const URL = "https://api.thecatapi.com/v1/images/search?api_key=live_nrAiME1AyHRpm7NT55PgYhcV7AZ16dJyvmp1pKcGytEhKlr1IUPgVYbXrz0z38tN";
const URL_FAVOURITES = "https://api.thecatapi.com/v1/favourites";
const URL_UPLOAD_IMG_CAT = "https://api.thecatapi.com/v1/images/upload";

const input = document.querySelector("input");
const catRandom = document.querySelector(".cat-random");
const spanError = document.getElementById("errorMessage");
const buttonFavourite = document.getElementsByClassName("btn-favourite");
const buttonDeleteFavourite = document.getElementsByClassName("btn-delete-favourite");
const img = document.getElementsByTagName("img");
const catFavoritesList = document.querySelector(".cat-favorites__list");
const formUploadCat = document.getElementById("formUploadCat");
const inputFile = document.getElementById("inputFile");
const btnUploadCat = document.getElementById("btnUploadCat");

//Llamado a la api y asignación a cada imagen una foto aleatoria y su botón agregar a favoritos
async function randomCats(Url) {
    const response = await fetch(Url);
    const data = await response.json();
    for (let j = 0; j < img.length; j++) {
        img[j].src = data[j].url;
        buttonFavourite[j].value = data[j].id;
        //agregar a favoritos las imagenes por medio del botón que tiene como valor el id de cada imagen
        buttonFavourite[j].addEventListener("click", function addFavorite(){
            addFavouriteCat(buttonFavourite[j].value);
        });
    }
}

//Agregar un gato a la lista de favoritos
async function addFavouriteCat(idImg){
    try {
        const response = await fetch(URL_FAVOURITES,{
            method:"POST",
            headers : {
                "Content-Type" : "application/json",
                "x-api-key" : "live_nrAiME1AyHRpm7NT55PgYhcV7AZ16dJyvmp1pKcGytEhKlr1IUPgVYbXrz0z38tN" //más seguro que query parameters
            },
            body:JSON.stringify({ //debe convertirse en un string porque el backend puede estar escrito en otro lenguaje y no entienda el lenguaje de javascript
                image_id : idImg
            })
        })
        if(response.status !== 200){ //cuando se quiere validar una variable cuyo valor depende de await, se debe colocar luego de esa instrucción, porque sino no lo va a reconocer
            throw new Error("Hay un error que tiene el status: "+ response.status + await response.text()); //response.text() permite ver el mensaje del error y se coloca await porque es una promesa que debe terminar
        }
        favouritesCats();
    } catch (error) {
        spanError.innerHTML = error.message;
    }
}

//Obtener lista de favoritos
async function favouritesCats() {
    try {
        const response = await fetch(URL_FAVOURITES,{
            headers : {
                "x-api-key" : "live_nrAiME1AyHRpm7NT55PgYhcV7AZ16dJyvmp1pKcGytEhKlr1IUPgVYbXrz0z38tN" //más seguro que query parameters
            }
        });
        if(response.status !== 200){ //cuando se quiere validar una variable cuyo valor depende de await, se debe colocar luego de esa instrucción, porque sino no lo va a reconocer
            throw new Error("Hay un error que tiene el status: "+ response.status + await response.text());
        }
        const data = await response.json();
        console.log(data);
        //se construirá dinámicamente cada vez que se llame a la función
        catFavoritesList.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            const catFavouriteItem = document.createElement("div");
            catFavouriteItem.setAttribute("class","cat-favorite__item");
            const imgChild = document.createElement("img");
            imgChild.setAttribute("alt","cat-img");
            imgChild.src = data[i].image.url;
            const buttonDeleteFavorite = document.createElement("button");
            buttonDeleteFavorite.setAttribute("class","btn-delete-favourite");
            buttonDeleteFavorite.textContent = "Eliminar de favoritos";
            catFavouriteItem.append(imgChild,buttonDeleteFavorite);
            catFavoritesList.appendChild(catFavouriteItem);
            //eliminar de favoritos las imagenes por medio del botón que tiene como valor el id de cada imagen
            buttonDeleteFavourite[i].value = data[i].id;
            buttonDeleteFavourite[i].addEventListener("click",()=>{
                deleteFavourite(buttonDeleteFavourite[i].value);
            });
        }
    } catch (error) {
        spanError.innerHTML = error.message;
    }
}

randomCats(URL);
favouritesCats();

//Eliminar un gato de favoritos
async function deleteFavourite(idFavourite) {
    const response = await fetch(`${URL_FAVOURITES}/${idFavourite}`,{
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json",
            "x-api-key" : "live_nrAiME1AyHRpm7NT55PgYhcV7AZ16dJyvmp1pKcGytEhKlr1IUPgVYbXrz0z38tN"
        }
    })
    favouritesCats();
}

//Por cada nuevo valor que se le ponga al input, se va a borrar y crear nuevamente la cantidad de imágenes de ese valor del input
input.addEventListener("change",(e)=>{
    catRandom.innerHTML = "";
    const queryParameter = `&limit=${e.target.value}`;
    for (let i = 0; i < e.target.value; i++) {
        const catRandomItem = document.createElement("div");
        catRandomItem.setAttribute("class","cat-random__item");
        const imgChild = document.createElement("img");
        imgChild.setAttribute("alt","cat-img");
        const buttonFavorite = document.createElement("button");
        buttonFavorite.setAttribute("class","btn-favourite");
        buttonFavorite.textContent = "Agregar a favoritos";
        catRandomItem.append(imgChild,buttonFavorite);
        catRandom.appendChild(catRandomItem);
    }
    randomCats(`${URL}/${queryParameter}`);
    favouritesCats();
})

//Generar nuevas imágenes con el botón NEW CATS
const buttonRandom = document.getElementById("btnRandom");
buttonRandom.addEventListener("click",()=>{
    if(input.value > 0){ //validar si hay al menos una imagen
        //se reconstruirá el contenido para que no se agreguen los mismo eventos de randomCats varias veces en los botones
        catRandom.innerHTML = "";
        for (let i = 0; i < input.value; i++) {
            const catRandomItem = document.createElement("div");
            catRandomItem.setAttribute("class","cat-random__item");
            const imgChild = document.createElement("img");
            imgChild.setAttribute("alt","cat-img");
            const buttonFavorite = document.createElement("button");
            buttonFavorite.setAttribute("class","btn-favourite");
            buttonFavorite.textContent = "Agregar a favoritos";
            catRandomItem.append(imgChild,buttonFavorite);
            catRandom.appendChild(catRandomItem);
        }
        randomCats(`${URL}/&limit=${input.value}`);
    }
    else{
        alert("Ingrese al menos una imagen");
    }
});

//Subir una imagen de gatos
async function uploadCat() {
    try {
        const uploadFormData = new FormData(formUploadCat); //se usa una instancia hacia el prototitpo formData cuando se trata de formularios, que pasa como argumento el formulario de HTML para que agarre todos los valores de los inputs
        const response = await fetch(URL_UPLOAD_IMG_CAT,{
            method : "POST",
            headers:{
                //"Content-Type" : "multipart/form-data", //cuando se trata de FORMDATA, automáticamente coloca el tipo de multipart y el boundary necesario
                "x-api-key" : "live_nrAiME1AyHRpm7NT55PgYhcV7AZ16dJyvmp1pKcGytEhKlr1IUPgVYbXrz0z38tN"
            },
            body: uploadFormData //no es necesario JSON.stringtify cuando se trata de un FormData y como no tiene valor no se pone {}
        })
        const data = await response.json();
        if(response.status !== 201){ //cuando se quiere validar una variable cuyo valor depende de await, se debe colocar luego de esa instrucción, porque sino no lo va a reconocer
            throw new Error("Hay un error que tiene el status: "+ response.status + await response.text());
        }
        else{
            addFavouriteCat(data.id);
        }
    } catch (error) {
        spanError.innerHTML = error.message;
    }
}

//Detectar cuando se cargo una imagen en el inputFile
inputFile.addEventListener("change",()=>{
    //crea la imagen de previsualización
    const imgUploadCat = document.createElement("img");
    imgUploadCat.setAttribute("class","image-preview");
    imgUploadCat.setAttribute("alt","image-preview");
    //mostrar preview de la imagen a cargar
    const reader = new FileReader();
    const filePreview = inputFile.files[0];
    reader.addEventListener('load', () => {
        imgUploadCat.src = reader.result;
    }, false);
    if(filePreview){
        reader.readAsDataURL(filePreview);
    }
    //evalua si la cantidad de elementos hijos del form es menor a 3: input, button y agrega una imagen de previsualizacion
    if(formUploadCat.childElementCount<3){
        formUploadCat.append(imgUploadCat);
        btnUploadCat.removeAttribute("class","hidden");
    }
    else if(filePreview == null){ //valida si no hay una imagen seleccionada para no mostrar la previsualización
        formUploadCat.removeChild(document.querySelector(".image-preview"));
        btnUploadCat.setAttribute("class","hidden");
    }
    else{ //caso contrario elimina la imagen de previsualización anterior (en caso se elija otra imagen luego de cargar uno)
        formUploadCat.removeChild(document.querySelector(".image-preview"));
        formUploadCat.append(imgUploadCat);
        btnUploadCat.removeAttribute("class","hidden");
    }
})

//Al botón de subir se le agrega el evento que llama a la función uploadCat y recarga la lista de favoritos
btnUploadCat.addEventListener("click",()=>{
    uploadCat();
    inputFile.value = null;
    favouritesCats();
    formUploadCat.removeChild(document.querySelector(".image-preview"));//borro la previsualización de la imagen
    btnUploadCat.setAttribute("class","hidden");
});