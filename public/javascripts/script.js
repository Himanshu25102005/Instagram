const upload = require("../../routes/multer");

let edit = document.querySelector(".edit");

let form = document.querySelector(".uploads")

edit.addEventListener("click", ()=>{
     document.querySelector(".uploads input").click();
})

document.querySelector(".uploads input").addEventListener("change", ()=>{
    upload
})

