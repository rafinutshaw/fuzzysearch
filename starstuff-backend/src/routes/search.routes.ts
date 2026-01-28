import { Router } from "express";
import * as SearchController from "../controllers/search.controller";
import { validate } from "../middleware/validate";
import { SearchQuerySchema } from "../schemas/search.schema";

const router = Router();

router.get("/ranked", validate(SearchQuerySchema), SearchController.getRanked);
router.get(
  "/grouped",
  validate(SearchQuerySchema),
  SearchController.getGrouped,
);

export default router;
