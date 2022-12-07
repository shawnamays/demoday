document.querySelectorAll(".deleteBtn").forEach(button => {

    button.addEventListener("click", function() {
        console.log("send delete")
            const brewName = this.dataset.brewName
            const brewHerbSelection = this.dataset.brewHerbSelection.split(",")
          console.log("brew name=",brewName, "brew selection=", brewHerbSelection)
            fetch('/deleteBrews', {
            
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
        
                brewName,
                brewHerbSelection
                })
            })
                .then(response => {
                    if (response.ok) return response.body
                })
                .then(data => {
                   
                    
                    window.location.reload(true)
                })
        });
                
})
console.log("attached")