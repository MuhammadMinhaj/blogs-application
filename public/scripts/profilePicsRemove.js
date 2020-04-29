
window.onload = function(){
    let profilePicsRemoveBtn = document.getElementById('profilePicsDeleteBtn')
    let profileFormData = document.getElementById('profile-form-data')
    let profilePics = document.getElementById('profilePics')


    // Somthing Change here.
    // ** The Change is (profilePicsRemoveBtn) normal to Condition apply
    // ** When finding (profilePicsRemoveBtn) then  (profilePicsRemoveBtn) Works fine.Otherwaise not working on any page 
    // Note: It's condition apply to remove error
    if(profilePicsRemoveBtn){
        profilePicsRemoveBtn.addEventListener('click',function(){
            let req = new Request('/uploads/profile-pics',{
                method:'delete',
                mode:'cors',
    
            })
            fetch(req)
                .then(res=>res.json())
                .then(data=>{
                    profilePicsRemoveBtn.type='hidden'
                    profilePics.src=data.profilePics
                    profileFormData.reset()
                })
        })
    }
   
}
