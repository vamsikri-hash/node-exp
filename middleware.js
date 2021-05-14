
export const logger = (req, res, next) => {
    console.log("Logging req header details : ");
    console.log(req.headers);
    next();
};
