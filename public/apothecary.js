document.querySelector(".addButton").addEventListener("click",() =>{
    const ingredients = document.querySelector(".ingredientName").value
    const taste = document.querySelector(".taste").value
    const pair = document.querySelector(".pair").value
    const benefits = document.querySelector(".benefits").value
    const query = `${ingredients} herbal tea`
    console.log(query)
    fetch (`https://api.unsplash.com/search/photos/?query=${query}&client_id=RQf2Q1FonDZkdjLWZ6-rOnE8iADraDdFKTNCZSWLntQ`).then(res => res.json()).then((data) =>{
      const url = data.results[1].urls.thumb
    fetch ("/post",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url, ingredients, taste, pair, benefits
        })
    }).then(res => res.json()).then(data => window.location.reload())
    })
})