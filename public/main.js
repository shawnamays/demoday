// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
// var trash = document.getElementsByClassName("fa-trash-o");

var favorite = document.getElementsByClassName("fa-trash-o");
var love = document.getElementsByClassName("fa-heart-o");

// favorite button is under the class "favorite"

Array.from(love).forEach(function(element) {
          element.addEventListener('click', function(){
          
          const herb = this.parentNode.parentNode.childNodes[1].innerText
           
            // FETCH REQUEST IS HERE ------------------------
            fetch('post', {
              //specifying which crud method we are using which is CREATE (put) in this case
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                herb
              })
            })
            .then(response => {
              if (response.ok) return response.json()
            })
            .then(data => {
              console.log(data)
              //reloading the page after every thumbs up
              window.location.reload(true)
            })
          });
    });

// Array.from(favorite).forEach(function(element) {
    
//           element.addEventListener('click', function(){
//             debugger
        
//           const herb = this.parentNode.parentNode.childNodes[1].innerText
           
//             // FETCH REQUEST IS HERE ------------------------
//             fetch('favorite', {
//               //specifying which crud method we are using which is CREATE (put) in this case
//               method: 'put',
//               headers: {'Content-Type': 'application/json'},
//               body: JSON.stringify({
//                 herb
//               })
//             })
//             .then(response => {
//               if (response.ok) return response.json()
//             })
//             .then(data => {
//               console.log(data)
//               //reloading the page after every thumbs up
//               window.location.reload(true)
//             })
//           });
//     });

    function edit(id){
        let herb = prompt("add to cabinet")
        
      
        fetch('/update', {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id,
           herb
          
          })
        }).then(function (response) {
          window.location.reload()
        })
      
      
      
      }
      

// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText

//         //A floating point number parsed from the given string, 
//         // or NaN when the first non-whitespace character cannot be converted to a number.
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)

//         // FETCH REQUEST IS HERE ------------------------
//         fetch('thumbup', {
//           //specifying which crud method we are using which is CREATE (put) in this case
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           //reloading the page after every thumbs up
//           window.location.reload(true)
//         })
//       });
// });

// // THUMBS DOWN logic-------------------------------------------

// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)


//     fetch('thumbdown', {
//       // PUT is from CRUD
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbDown':thumbDown
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

// // TRASH DELETE LOGIC---------------------------------------------------
// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });

