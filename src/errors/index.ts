import { UserExistsError } from "./UserExists";
import { validationHandler } from "./validation";

export const errorHandlers = [validationHandler,UserExistsError];