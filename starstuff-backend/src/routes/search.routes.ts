import { Router } from "express";
import { getFizzySearch } from "../controllers/search.controller.js";
import { validate } from "../middleware/validate.js";
import { SearchQuerySchema } from "../schemas/search.schema.js";

const router = Router();

router.get("/", validate(SearchQuerySchema), getFizzySearch);

export default router;
