
    
    const bookmarks = document.getElementsByClassName('bookmark')

    ;[...bookmarks].forEach(function(bookmark){

        bookmark.style.cursor = 'pointer'

        bookmark.addEventListener('click',function(e){

            let target = e.target.parentElement;
       
            let headers  = new Headers()
            headers.append('accept','Application/JSON')
          

            let req = new Request(`/api/bookmarks/${target.dataset.post}`,{
                method:'GET',
                headers,
                mode:'cors'
                
            })

            fetch(req)
                .then(res=>res.json())
                .then(data=>{
                    if(data.bookmarks){
                        target.innerHTML = '<i class="fas fa-bookmark"></i>'
                    }else{
                        target.innerHTML = '<i class="far fa-bookmark"></i>'
                    }


                })
                .catch(e=>{
                    
                    console.error(e.response.error)
                })
        })
    })
