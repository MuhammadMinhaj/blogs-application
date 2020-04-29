tinymce.init({
    selector:"#postBody",
    plugins: [" advcode advlist lists link checklist autolink autosave code",
    'preview','searchreplace','wordcount','media table emoticons image imagetools'],
    toolbar:'bold italic underline|alignleft aligncenter alignright alignjustify|bullist numlist outdent indent|link image media|forcecolor backcolor emoticons|code preview',
    height:300,
    automatic_uploads:true,
    images_upload_url:'/uploads/postimage',
    relative_urls : false,

    images_upload_handler:function(blobInfo,success,failuer){

        let headers = new Headers()
        headers.append('Accept','Application/JSON')


        let formData = new FormData()
        formData.append('post-image',blobInfo.blob(),blobInfo.filename())

        let req = new Request('/uploads/postimage',{
            method:'POST',
            headers,
            mod:'cors',
            body:formData
        })
        fetch(req)
            .then(res=>res.json())
            .then(data=>success(data.imgUrl))
            .catch(()=>{failuer('HTTP ERROR OCCURRED')})
        
    }

})