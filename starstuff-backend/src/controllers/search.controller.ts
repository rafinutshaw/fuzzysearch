import { Request, Response } from "express";
import {
  RankedSearchResult,
  SearchQuery,
  GroupedSearchResult,
} from "../schemas/search.schema.js";
import { SearchService } from "../services/search.service.js";

export const getFizzySearch = async (
  req: Request,
  res: Response<GroupedSearchResult | RankedSearchResult>,
) => {
  const { q, page, index, mode } = req.query as any as SearchQuery;

  const result =
    mode === "ranked"
      ? await SearchService.getRankedResults(q, page)
      : await SearchService.getGroupedResults(q, page, index);
  res.json(result);
  return;
};
