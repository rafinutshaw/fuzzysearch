import { MatchingStrategies } from "meilisearch";
import { meiliClient } from "../config/meilisearch.js";
import {
  GroupedSearchResult,
  RankedSearchResult,
} from "../schemas/search.schema.js";

export class SearchService {
  static async getRankedResults(
    q: string,
    page: number,
    hitsPerPage = 10,
  ): Promise<RankedSearchResult> {
    const isShortQuery = q.length > 0 && q.length < 3;

    const response = await meiliClient.multiSearch({
      federation: {
        limit: hitsPerPage,
        offset: (page - 1) * hitsPerPage,
      },
      queries: [
        {
          indexUid: "users",
          q,
          attributesToSearchOn: ["title"],
          // Use sort for popularity for short queries
          sort: isShortQuery ? ["popularity:desc"] : undefined,
          // "all" strategy on 1-2 chars acts as a strict non-typo prefix search
          matchingStrategy: (isShortQuery
            ? "all"
            : "last") as MatchingStrategies,
        },
        {
          indexUid: "spaces",
          q,
          attributesToSearchOn: ["title"],
          sort: isShortQuery ? ["popularity:desc"] : undefined,
          matchingStrategy: (isShortQuery
            ? "all"
            : "last") as MatchingStrategies,
        },
        {
          indexUid: "communities",
          q,
          attributesToSearchOn: ["title"],
          sort: isShortQuery ? ["popularity:desc"] : undefined,
          matchingStrategy: (isShortQuery
            ? "all"
            : "last") as MatchingStrategies,
        },
      ],
    });

    return {
      hits: response.hits.map((hit: any) => ({
        id: hit.id,
        title: hit.title,
        avatar: hit.avatar,
        type: hit._federation.indexUid,
        popularity: hit.popularity,
      })),
      totalHits: response.estimatedTotalHits ?? 0,
      totalPages: Math.ceil((response.estimatedTotalHits || 0) / hitsPerPage),
      page,
      hitsPerPage,
    };
  }

  static async getGroupedResults(
    q: string,
    page: number,
    index?: string,
  ): Promise<GroupedSearchResult> {
    const limit = 3;
    const indexUids = index ? [index] : ["users", "spaces", "communities"];
    const isShortQuery = q.length > 0 && q.length < 3;

    const queries = indexUids.map((uid) => ({
      indexUid: uid,
      q,
      hitsPerPage: limit,
      page,
      attributesToSearchOn: ["title"],
      attributesToHighlight: ["title"],
      sort: isShortQuery ? ["popularity:desc"] : undefined,
      matchingStrategy: (isShortQuery ? "all" : "last") as MatchingStrategies,
    }));

    const { results } = await meiliClient.multiSearch({ queries });

    return indexUids.reduce((acc, uid, i) => {
      acc[uid] = {
        hits: results[i].hits.map((hit) => ({ ...hit, type: uid })),
        totalHits: results[i].totalHits || 0,
        totalPages: results[i].totalPages || 0,
        page: results[i].page || 1,
        hitsPerPage: limit,
      };
      return acc;
    }, {} as any);
  }
}
