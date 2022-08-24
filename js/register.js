 let email = document.querySelector(".e-mail")
 let password = document.querySelector(".password")
 let username = document.querySelector(".username")
 let isAdmin = document.querySelector(".isAdmin")
 let form = document.querySelector(".form")


 form.addEventListener("submit", function (evt) {
     evt.preventDefault();
     if (localStorage.getItem("Authorization")) {
         window.location.href == "./index.html"
     }
     let newAuth = {
         email: email.value,
         password: password.value,
         name: username.value,
         isAdmin: isAdmin.checked
     }
     fetch("https://fast-ravine-16741.herokuapp.com/api/users", {
             method: "POST",
             headers: {
                 "content-Type": "application/json"
             },
             body: JSON.stringify({
                 "email": `${email.value}`,
                 "password": `${password.value}`,
                 "name": `${username.value}`,
                 "isAdmin": `${isAdmin.checked}`
             })
         })
         .then(res => res.json())
         .then(datal => {
             localStorage.setItem("Authorization", datal._id)
         })

 })