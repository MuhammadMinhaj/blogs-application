// This is page copy to Comment.js 


    // const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder')  
    const reply = document.getElementById('reply')

    // Comment Handler
    // comment.addEventListener('keypress',function(e){
    //     if(e.key==='Enter'){
    //         if(e.target.value){
    //             let postId = comment.dataset.post
    //             let data = {
    //                 body:e.target.value
    //             }
    //             let req = generateRequest(`/api/comments/${postId}`,'POST',data)
    //             fetch(req)
    //                 .then(req=>req.json())
    //                 .then(data=>{
    //                     let commentElement = createComment(data)
    //                     commentHolder.insertBefore(commentElement,commentHolder.children[0])
                  
    //                 })
    //                 .catch(e=>{
    //                     console.log(e)
    //                 })
    //                 e.target.value = ''
    //         }else{
    //             alert('Please Enter A Valid Comment')
    //         }
    //     }
    // })
    // Reply Handler
    commentHolder.addEventListener('keypress',function(e){
        if(e.key==='Enter'){
           let commentsId = e.target.dataset.comment
           let value = e.target.value

           
           if(value){
            let data = {
                body:value
            }

            let req = generateRequest(`/api/comments/replies/${commentsId}`,'POST',data)
            fetch(req)
                .then(req=>req.json())
                .then(data=>{
                    let replyElement = createReplyElement(data)
                    let parent = e.target.parentElement
                    parent.previousElementSibling.appendChild(replyElement)
                    e.target.value =''
                     
                })
                .catch(e=>{
                    alert(e.message)
                })



           }else{
            alert('Please Enter A Valid Reply')
           }
        }
    })

 
function generateRequest(url,method,body){
    let headers = new Headers()
        headers.append('Accept','Application/JSON')
        headers.append('Content-Type','Application/JSON')
    let req = new Request(url,{
        method,
        headers,
        body:JSON.stringify(body),
        mode:'cors'
    })

    return req
}

// function createComment(comment){
//     let innerHTML = `
//     <img 
//     src="${comment.user.profilePics}"
//     class="rounded-circle mx-3 my-3"
//     style="width:40px"
//     >
//     <div class="media-body my-5">
//     <p>${comment.body}</p>
    
//     <div class="my-3">
    
//     <input
//     type="text"
//     class="form-control"
//     placeholder="Press Enter to Reply"
//     name="reply"
//     data-comment="${comment._id}"
//     >
    
//     </div>
//     </div>
//     `
//     let div = document.createElement('div')
//     div.className = 'media border'
//     div.innerHTML = innerHTML
//     return div
// }
function createReplyElement(reply){
    let innerHTML = `
    <img 
    src="${reply.profilePics}"
    class="align=self=satrt mr-3 rounded-circle"
    style="width:40px"

    >
    <div class="media-body">
    <p>${reply.body}</p>
    </div>
    `
    let div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML
    return div
}
