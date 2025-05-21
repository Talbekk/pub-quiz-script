import { Request, Response, NextFunction } from "express";
import { ThrowError } from "../errorHandler";

export const isAuthenticated = (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        return next();
    }
    throw new ThrowError(401, "You are not authorized to handle this request", {
        params: req.params,
        data: req.body,
    });
};