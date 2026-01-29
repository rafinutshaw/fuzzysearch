import { Request, Response } from "express";
import {
  RankedSearchResult,
  SearchQuery,
  GroupedSearchResult,
} from "../schemas/search.schema.js";
import { SearchService } from "../services/search.service.js";

export const getRanked = async (
  req: Request,
  res: Response<RankedSearchResult>,
) => {
  try {
    const { q, page } = req.query as any as SearchQuery;
    const result = await SearchService.getRankedResults(q, page);
    res.json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({ status: "error", data: [], message: error.message } as any);
  }
};

export const getGrouped = async (
  req: Request,
  res: Response<GroupedSearchResult>,
) => {
  try {
    const { q, page, index } = req.query as any as SearchQuery;

    const result = await SearchService.getGroupedResults(q, page, index);
    res.json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({ status: "error", data: [], message: error.message } as any);
  }
};
