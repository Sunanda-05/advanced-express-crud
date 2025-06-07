import { body } from "express-validator";

export const validateDocument = [
  // Required: title
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  // Optional: content
  body("content").optional().isString().withMessage("Content must be a string"),

  body("isStarred")
    .optional()
    .isBoolean()
    .withMessage("isStarred is a boolean property"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      return tags.every((tag) => typeof tag === "string");
    })
    .withMessage("Each tag must be a string"),

  // Optional: visibility with enum check
  body("visibility")
    .optional()
    .isIn(["private", "public", "link"])
    .withMessage("Visibility must be one of: private, public, link"),

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
    .withMessage("Permission must be either 'read' or 'edit'"),
];
