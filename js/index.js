 if (!localStorage.getItem("Authorization")) {
     window.location.href = "./login.html"
 }


 let elPostsWrapper = document.querySelector(".posts__wrapper");
 let elCommentsWrapper = document.querySelector(".comment__wrapper");
 let elSavedTotal = document.querySelector(".saved__wrapper__total");
 let elUsersWrapper = document.querySelector(".users__wrapper");
 let elSavedWrapper = document.querySelector(".saved__wrapper");
 let elUsersTotal = document.querySelector(".total__users");
 let elPostsTotal = document.querySelector(".total__posts");
 let elTotalUsers = document.querySelector(".total_users");
 let elTotalPosts = document.querySelector(".total_posts");
 let form = document.querySelector(".form_submit");
 let elPageWrapper = document.querySelector(".pagination");
 let elCommentsTotal = document.querySelector(".total__comments");
 let elTempPosts = document.querySelector("#post__template").content;
 let savedPostTemplate = document.querySelector("#savedPost").content;
 let savedPosts
 if (localStorage.getItem("savedPosts")) {
     savedPosts = JSON.parse(localStorage.getItem("savedPosts"))

     renderSavedPosts(savedPosts);
 } else {
     savedPosts = []
 }





 elSavedWrapper.addEventListener("click", function (evt) {
     let saveId = evt.target.dataset.likeId
     if (saveId) {
         let SavedItem = savedPosts.findIndex(function (item) {
             return item.dataset.id == saveId
         })

         savedPosts.splice(SavedItem, 1);

         localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
     }
     renderSavedPosts(savedPosts);
 })








 fetch("https://fast-ravine-16741.herokuapp.com/api/users/me", {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `${localStorage.getItem("Authorization")}`
         }
     }, )
     .then(res => res.json())
     .then(data1 => {
         document.querySelector(".me").innerHTML = data1.email
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
         renderPagination(Math.ceil(data1.totalResults / 10), elPageWrapper)
     })


 elPostsWrapper.addEventListener("click", function (evt) {
     let datasetPostId = evt.target.dataset.id;
     let datasetEditId = evt.target.dataset.editId;
     let datasetSaveId = evt.target.dataset.saveId;

     let Li = evt.target.closest(".card");

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

     if (datasetSaveId) {

         if (savedPosts.length == 0) {
             fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${datasetSaveId}`, {
                     method: "GET",
                     headers: {
                         "Content-Type": "application/json",
                         "Authorization": `${localStorage.getItem("Authorization")}`
                     }
                 }, )
                 .then(res => res.json())
                 .then(data => {


                     if (!data.error) {
                         savedPosts.unshift(data)
                         renderSavedPosts(savedPosts)
                         localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
                     }
                 })

         } else if (!savedPosts.find(item => item._id == datasetSaveId)) {
             fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${datasetSaveId}`, {
                     method: "GET",
                     headers: {
                         "Content-Type": "application/json",
                         "Authorization": `${localStorage.getItem("Authorization")}`
                     }
                 }, )
                 .then(res => res.json())
                 .then(data => {


                     if (!data.error) {
                         savedPosts.unshift(data)
                         renderSavedPosts(savedPosts)
                         localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
                     }
                 })

         }

         console.log(savedPosts);
     }
 })
 elSavedWrapper.addEventListener("click", function (evt) {
     let datasetPostId = evt.target.dataset.id;

     if (datasetPostId) {
         let FoundSavedPost = savedPosts.findIndex(function (item) {
             return item.id == datasetPostId;
         })

         savedPosts.splice(FoundSavedPost, 1);

         localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
     }
     renderSavedPosts(savedPosts, elSavedWrapper);

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
         RenderedPosts = array
         let newLi = elTempPosts.cloneNode(true);
         newLi.querySelector(".post__body").textContent = item.body;
         newLi.querySelector(".post__title").textContent = item.title;
         newLi.querySelector(".post__delete").dataset.id = item._id;

         newLi.querySelector(".post__edit").dataset.editId = item._id;
         newLi.querySelector(".post__save").dataset.saveId = item._id;

         newFragment.appendChild(newLi);
     }

     elPostsWrapper.appendChild(newFragment);
 }

 function renderSavedPosts() {
     elSavedWrapper.innerHTML = null

     let fragment = document.createDocumentFragment();

     for (const item of savedPosts) {
         let newItem = savedPostTemplate.cloneNode(true);

         newItem.querySelector(".post__title").textContent = item.title;
         newItem.querySelector(".post__body").textContent = item.body;
         newItem.querySelector(".post__btn").dataset.id = item._id;
         fragment.appendChild(newItem);
     }

     elSavedWrapper.appendChild(fragment)
 }

 function renderPagination(total, wrapper) {
     wrapper.innerHTML = null;
     console.log(total);
     if (total > 1) {
         let fragment = document.createDocumentFragment()
         for (let i = 1; i <= total; i++) {
             let NewLi = document.createElement("li")
             let Newp = document.createElement("a")
             NewLi.classList.add("page-item")
             Newp.classList.add("page-link")
             Newp.textContent = i
             Newp.dataset.pageId = i
             NewLi.appendChild(Newp)
             fragment.appendChild(NewLi)
         }
         wrapper.appendChild(fragment)
     }
 }