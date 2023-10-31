
///////get all posts
export const getAllPosts = async() => {
    try{
        const response = await fetch('/api/post/Posts?_limit=15', {
            method: 'GET'
        });
        if(!response.ok){
            throw new Error('Failed to fetch posts');
        };

        const data = await response.json();
        return data;

    }catch(err){
        console.log(err, 'Error fetching posts')
        return [];
    }

} 



///////get all users
  

export const getAllUsers = async() => {
    try{
        const response = await fetch('/api/user/AllUsers', {
            method: 'GET'
        });
        if(!response.ok){
            throw new Error('Failed to fetch users');
        };

        const data = await response.json();
        return data;

    }catch(err){
        console.log(err, 'Error fetching users')
        return [];
    }
}







