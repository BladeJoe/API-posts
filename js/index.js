 if (!localStorage.getItem("Authorization")) {
     window.location.href = "./login.html"
 }


 let elPostsWrapper = document.querySelector(".posts__wrapper");
 let elCommentsWrapper = document.querySelector(".comment__wrapper");
 let elUsersWrapper = document.querySelector(".users__wrapper");
 let elUsersTotal = document.querySelector(".total__users");
 let elPostsTotal = document.querySelector(".total__posts");
 let elTotalUsers = document.querySelector(".total_users");
 let elTotalPosts = document.querySelector(".total_posts");
 let form = document.querySelector(".form_submit");
 let elCommentsTotal = document.querySelector(".total__comments");
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


 fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `${localStorage.getItem("Authorization")}`
         }
     }, )
     .then(res => res.json())
     .then(data1 => {
         renderPosts(data1.posts);

         elTotalPosts.innerHTML = data1.totalResults;
     })


 elPostsWrapper.addEventListener("click", function (evt) {
     let datasetPostId = evt.target.dataset.id;
     let datasetEditId = evt.target.dataset.editId;

     if (datasetPostId) {
         fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${datasetPostId}`, {
                 method: "DELETE",
                 headers: {
                     "Content-Type": "application/json",
                     "Authorization": `${localStorage.getItem("Authorization")}`
                 }
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
                         elTotalPosts.innerHTML = data1.totalResults;
                     })

                 alert("Deleted")
             })

     }

     if (datasetEditId) {
         let Li = evt.target.closest(".card");
         console.log(Li);
         let submit = document.querySelector(".modalSubmit")
         let title = document.querySelector(".modal_title")
         let body = document.querySelector(".modal_body")
         submit.dataset.editId = datasetEditId;

         title.value = Li.querySelector(".post__title").textContent;
         body.value = Li.querySelector(".post__body").textContent;
         document.querySelector(".modal-content").addEventListener("submit", function (evt) {
             evt.preventDefault()
             fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${datasetEditId}`, {
                     method: "PUT",
                     headers: {
                         "Content-Type": "application/json",
                         "Authorization": `${localStorage.getItem("Authorization")}`
                     },
                     body: JSON.stringify({
                         "title": title.value,
                         "body": body.value
                     })
                 }, )
                 .then(res => res.json())
                 .then(data1 => {
                     console.log(data1);
                     fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
                             method: "GET",
                             headers: {
                                 "Content-Type": "application/json",
                                 "Authorization": `${localStorage.getItem("Authorization")}`
                             }
                         }, )
                         .then(res => res.json())
                         .then(data1 => {
                             renderPosts(data1.posts);
                             elTotalPosts.innerHTML = data1.totalResults;
                         })

                     title = null;
                     body = null;

                 })
         })


     }
 })


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
                     renderPosts(data1.posts);
                     elTotalPosts.innerHTML = data1.totalResults;
                 })

             form.querySelector(".title").value = null;
             form.querySelector(".body").value = null;
         })
 })






 function renderPosts(array) {

     elPostsTotal.innerHTML = array.length;
     elPostsWrapper.innerHTML = null;
     let newFragment = document.createDocumentFragment();
     for (const item of array) {
         let newLi = elTempPosts.cloneNode(true);
         newLi.querySelector(".post__body").textContent = item.body;
         newLi.querySelector(".post__title").textContent = item.title;
         newLi.querySelector(".post__delete").dataset.id = item._id;
         newLi.querySelector(".post__edit").dataset.editId = item._id;

         newFragment.appendChild(newLi);
     }

     elPostsWrapper.appendChild(newFragment);
 }