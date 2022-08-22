if (localStorage.getItem("Authorization") && localStorage.getItem("Authorization")) {
    window.location.href == "./index.html"
}


let login = document.querySelector(".login")
let password = document.querySelector(".password")
let form = document.querySelector(".form")

form.addEventListener("submit", function (evt) {
    evt.preventDefault();

    fetch("https://fast-ravine-16741.herokuapp.com/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": `${login.value}`,
                "password": `${password.value}`
            })
        })
        .then(res => res.json())
        .then(datal => {
            localStorage.setItem("Authorization", datal.Authorization)
            window.location.href = "./index.html"
            console.log(datal);
        })


})