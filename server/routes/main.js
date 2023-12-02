const express = require('express');
const router = express.Router();
const Post = require('../model/post');




/**
 * Get /
 * HOME
 */
router.get('', async (req,res) => {
try{
    const locals = {
        title : "Node js blog" ,
        description : "Simple Blog"
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.estimatedDocumentCount();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    
    res.render('index' , {
        locals , 
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });            
} catch (error) {
        console.log(error);
    }
    
});






// router.get('', async (req,res)=> {

//     const locals = {
//         title : "Node js blog" ,
//         description : "Simple Blog"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index' , { locals , data });            
//     } catch (error) {
//         console.log(error);
//     }
    
// });

/**
 * Get /
 * Post : id
 */

router.get('/post/:id', async (req,res)=> {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug});
        
        const locals = {
            title : data.title ,
            description : "Simple Blog" ,
            currentRoute : `/post/${slug}`
        }
        res.render('post' , { locals , data, currentRoute });            
    } catch (error) {
        console.log(error);
    }
    
});

/**
 * Get /
 * Post : searchTerm
 */

router.post('/search', async (req,res)=> {
    try {
        const locals = {
            title : 'Search' ,
            description : "Simple Blog"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g,"");

        const data = await Post.find({
            $or: [
                    {title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                    {body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}                
            ]
        });

        res.render('search',{
            data,
            locals
        });            
    } catch (error) {
        console.log(error);
    }
    
});






// function insertPostData() {
//     Post.insertMany([
//         {
//         title: "Building a Blog",
//         body: "This is the body text"
//         },
//         {
//             title: "How to learn Japanese",
//             body: "This is the body text "
//         },
//         {
//         title: "learning docker ",
//         body: "This is the body text "
//         },
//         {
//             title: "devops roadmap",
//             body: "This is the body text"
//         },
//         {
//             title: "why docker",
//             body: "This is the body text"
//         },
//         {
//             title: "getting started with k8s",
//             body: "This is the body text"
//         },
//         {
//             title: "why k8s",
//             body: "This is the body text"
//         },
//     ])
// }
// insertPostData();














router.get('/about',(req,res)=> {
    res.render('about' , {
        currentRoute: '/about'
    });
});

module.exports =router;