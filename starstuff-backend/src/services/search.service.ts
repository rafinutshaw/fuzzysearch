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
    const response = await meiliClient.multiSearch({
      federation: {
        limit: hitsPerPage,
        offset: (page - 1) * hitsPerPage,
      },
      queries: [
        { indexUid: "users", q },
        { indexUid: "spaces", q },
        { indexUid: "communities", q },
      ],
    });

    return {
      hits: response.hits.map((hit: any) => ({
        id: hit.id,
        title: hit.title,
        sub: hit.sub,
        avatar: hit.avatar,
        type: hit._federation.indexUid,
      })),
      totalHits: response.estimatedTotalHits ?? 0,
      totalPages: Math.ceil(response?.estimatedTotalHits! / hitsPerPage),
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

    const queries = indexUids.map((uid) => ({
      indexUid: uid,
      q,
      hitsPerPage: limit,
      page,
      attributesToHighlight: ["title"],
    }));

    const { results } = await meiliClient.multiSearch({ queries });

    // Reduce results into a keyed object { users: {...}, spaces: {...} }
    return indexUids.reduce((acc, uid, i) => {
      acc[uid] = {
        hits: results[i].hits,
        totalHits: results[i].totalHits,
        totalPages: results[i].totalPages,
        page: results[i].page,
        hitsPerPage: limit,
      };
      return acc;
    }, {} as any);
  }
}
