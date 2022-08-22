 if (!localStorage.getItem("Authorization")) {
     window.location.href = "./login.html"
 }


 let elPostsWrapper = document.querySelector(".posts__wrapper");
 let elCommentsWrapper = document.querySelector(".comment__wrapper");
 let elUsersWrapper = document.querySelector(".users__wrapper");
 let elUsersTotal = document.querySelector(".total__users");
 let elPostsTotal = document.querySelector(".total__posts");
 let form = document.querySelector(".form_submit");
 let elCommentsTotal = document.querySelector(".total__comments");
 let elTempUsers = document.querySelector("#user__template").content;

 let elTempPosts = document.querySelector("#post__template").content;

 fetch("https://fast-ravine-16741.herokuapp.com/api/users/me", {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `${localStorage.getItem("Authorization")}`
         }
     }, )
     .then(res => res.json())
     .then(data1 => {
         let me = document.querySelector(".me").innerHTML = data1.email
     })


 fetch("https://fast-ravine-16741.herokuapp.com/api/users", {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `${localStorage.getItem("Authorization")}`
         }
     }, )
     .then(res => res.json())
     .then(data1 => {
         renderUsers(data1.slice(0, 10))
     })


 fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `${localStorage.getItem("Authorization")}`
         }
     }, )
     .then(res => res.json())
     .then(data1 => {
         renderPosts(data1.posts)
     })



 elPostsWrapper.addEventListener("click", function (evt) {
     let datasetId = evt.target.dataset.id;
     if (datasetId) {
         fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${datasetId}`, {
                 method: "DELETE",
                 headers: {
                     "Content-Type": "application/json",
                     "Authorization": `${localStorage.getItem("Authorization")}`
                 }
             }, )
             .then(res => res.json())
             .then(data1 => {
                 alert("Deleted")
                 fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
                         method: "GET",
                         headers: {
                             "Content-Type": "application/json",
                             "Authorization": `${localStorage.getItem("Authorization")}`
                         }
                     }, )
                     .then(res => res.json())
                     .then(data1 => {
                         renderPosts(data1.posts)
                         console.log(data1);
                     })
             })

     }
 })





 function renderUsers(array) {
     elUsersWrapper.innerHTML = null;
     let newFragment = document.createDocumentFragment();

     for (const item of array) {
         let newLi = elTempUsers.cloneNode(true);

         elUsersTotal.innerHTML = array.length;
         newLi.querySelector(".user__name").textContent = item.name;
         newLi.querySelector(".user__email").textContent = item.email;
         newLi.querySelector(".user__id").textContent = item._id;
         newLi.querySelector(".user__link").dataset.userId = item.id;
         newLi.querySelector(".user__name").dataset.userId = item.id;
         newLi.querySelector(".user__email").dataset.userId = item.id;


         newFragment.appendChild(newLi);
     }

     elUsersWrapper.appendChild(newFragment);
 }

 function renderPosts(array) {

     elPostsTotal.innerHTML = array.length;
     elPostsWrapper.innerHTML = null;
     let newFragment = document.createDocumentFragment();

     for (const item of array) {
         let newLi = elTempPosts.cloneNode(true);

         newLi.querySelector(".post__link").dataset.postId = item.id;
         newLi.querySelector(".post__body").dataset.postId = item.id;
         newLi.querySelector(".post__title").dataset.postId = item.id;
         newLi.querySelector(".post__body").textContent = item.body;
         newLi.querySelector(".post__title").textContent = item.title;
         newLi.querySelector(".post__delete").dataset.id = item._id;

         newFragment.appendChild(newLi);
     }

     elPostsWrapper.appendChild(newFragment);
 }


 form.addEventListener("submit", function (evt) {
     evt.preventDefault();


     fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": `${localStorage.getItem("Authorization")}`
             },
             body: JSON.stringify({
                 "title": `${form.querySelector(".title").value}`,
                 "body": `${form.querySelector(".body").value}`
             })
         }, )
         .then(res => res.json())
         .then(data1 => {
             fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
                     method: "GET",
                     headers: {
                         "Content-Type": "application/json",
                         "Authorization": `${localStorage.getItem("Authorization")}`
                     }
                 }, )
                 .then(res => res.json())
                 .then(data1 => {
                     renderPosts(data1.posts)
                     console.log(data1);
                 })

             form.querySelector(".title").value = null;
             form.querySelector(".body").value = null;
         })
 })