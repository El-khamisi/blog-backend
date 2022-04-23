exports.towPhotos = async(req, res, next)=>{
    try {
        const fieldname = req.file?.fieldname;
        const path = req.file?.path;

        res.locals.photos.push({fieldname, path});
        return next();
    } catch (e) {
        return failedRes(res, 500, e);
    }
}