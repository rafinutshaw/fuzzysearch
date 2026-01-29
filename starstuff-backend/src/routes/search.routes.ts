import { Router } from "express";
import { getRanked, getGrouped } from "../controllers/search.controller.js";
import { validate } from "../middleware/validate.js";
import { SearchQuerySchema } from "../schemas/search.schema.js";

const router = Router();

router.get("/ranked", validate(SearchQuerySchema), getRanked);
router.get("/grouped", validate(SearchQuerySchema), getGrouped);

export default router;
