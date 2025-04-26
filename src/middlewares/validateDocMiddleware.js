import { body } from "express-validator";

export const validateDocument = [
  // Required: title
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  // Optional: content
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),

  // Required: owner (must be a valid MongoDB ObjectId)
  body("owner")
    .exists({ checkFalsy: true })
    .withMessage("Owner is required")
    .isMongoId()
    .withMessage("Owner must be a valid Mongo ID"),

  // Optional: visibility with enum check
  body("visibility")
    .optional()
    .isIn(["private", "public", "link"])
    .withMessage("Visibility must be one of: private, public, link"),

  // Optional: linkToken (should be a string if present)
  body("linkToken")
    .optional()
    .isString()
    .withMessage("Link token must be a string"),

  // Optional: sharedWith is an array of objects
  body("sharedWith")
    .optional()
    .isArray()
    .withMessage("SharedWith must be an array"),
  
  body("sharedWith.*.user")
    .optional()
    .isMongoId()
    .withMessage("Each sharedWith user must be a valid Mongo ID"),

  body("sharedWith.*.permission")
    .optional()
    .isIn(["read", "edit"])
    .withMessage("Permission must be either 'read' or 'edit'")
];
