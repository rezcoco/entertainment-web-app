import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

class Validation {
   private pwdPattern: RegExp = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/)
   
   public signup() {
        return [
            body('email').isEmail().withMessage('Please fill valid Email address').notEmpty().withMessage('Email can\'t be empty'),
            body('password').matches(this.pwdPattern).withMessage('Enter a password combination of at least eight numbers, letters and punctuation marks (such as ! and &).').notEmpty().withMessage('Password can\'t be empty'),
            body('repeat_password').custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords don\'t match')
                }
                return true
            }),
            function (req: Request, res: Response, next: NextFunction) {
                const result = validationResult(req).array()
                const error = result[0]
                if (error) {
                    return res.status(400).json({ message: error.msg })
                }
                return next()
            }
        
        ]
   }

   public login() {
        return [
            body('email').isEmail().withMessage('Please fill valid Email Address').notEmpty().withMessage('Email can\'t be empty'),
            body('password').notEmpty().withMessage('Password can\'t be empty'),
            function (req: Request, res: Response, next: NextFunction) {
                const result = validationResult(req).array()
                const error = result[0]

                if (error) return res.status(400).json({ message: error.msg })
                return next()
            }
        ]
   }

   public logout() {
        return [
            body('userId').notEmpty().withMessage('Invalid request body'),
            function (req: Request, res: Response, next: NextFunction) {
                const result = validationResult(req).array()
                const error = result[0]

                if (error) return res.status(400).json({ message: error.msg})
                return next()
            }
        ]
   }
}

export default new Validation()