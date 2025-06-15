// const asynHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             success: false,
//             message: error.message,
//         });
//     }
// }
const asyncHandler=(requestHandler)=>{
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next).catch((err)=>next(err))
    };
}

export default asyncHandler ;