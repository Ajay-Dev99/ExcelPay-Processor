import { Request, Response } from "express";
import { signupUser, loginUser } from "./auth.service";
import { asyncHandler } from "../../utils/AsyncHandler";
import ApiResponse from "../../utils/ApiResponse";

export const signup = asyncHandler(async (req: Request, res: Response) => {

    const user = await signupUser(req.body);

    return ApiResponse.created(res, user, "User created successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {

    const result = await loginUser(req.body);

    return ApiResponse.success(res, result, "Login successful");

});