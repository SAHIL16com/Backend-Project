const asyncHAndler = (requestHandler) =>{
    Promise.resolve(requestHandler(req, res , next))
    .catch((err) => next(err))
}



export {asyncHAndler}


// const asyncHAndler = (fun) => async (req , res , next) => {
//     try {
//         await fun(req,res,next);
        
//     } catch (error) {
//         res.status(error.code || 500 ).json({
//             success : false,
//             message : err.message
//         })
        
//     }
    
// }