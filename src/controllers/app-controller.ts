import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Route,
} from "tsoa";
import esClient from "../services/elasticsearch";
import HttpStatus from "../interfaces/http-status";
import HttpError from "../interfaces/http-error";

if (!process.env.ELASTICSEARCH_INDEX) {
  throw Error("Default ElasticSearch index must be specified.");
}

const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX;

type DataRecord = {
  title: string;
  keyword: string[];
  content: string;
  summary: string;
  url: string;
};

@Route("/api")
export class AppController extends Controller {
  @Get()
  public async GET(
    @Query("query") query?: string,
    @Query("keywords") keywords: string[] = [],
  ) {
    const result = await esClient.search<DataRecord>({
      index: ELASTICSEARCH_INDEX,
      query: {
        bool: {
          should: query
            ? [
                { match: { title: query } },
                { match: { content: query } },
                { match: { summary: query } },
              ]
            : { match_all: {} },
          must: keywords.map((v) => ({ match: { keywords: v } })),
        },
      },
    });

    return result.hits.hits.map((v) => ({
      id: v._id,
      ...v._source,
      score: v._score,
    }));
  }

  @Post()
  public async POST(
    @Body()
    body: DataRecord,
  ) {
    const result = await esClient
      .index({
        index: ELASTICSEARCH_INDEX,
        document: body,
        refresh: "wait_for",
      })
      .catch((e) => console.error(e));

    if (!result) {
      throw new Error("เกิดข้อผิดพลาดกับระบบจัดการข้อมูล");
    }

    return this.setStatus(HttpStatus.NO_CONTENT);
  }

  @Patch("{id}")
  public async PATCH(@Path() id: string, @Body() body: Partial<DataRecord>) {
    const data = await esClient
      .get<DataRecord>({
        index: ELASTICSEARCH_INDEX,
        id,
      })
      .catch((e) => {
        if (e.meta.statusCode === 404) {
          throw new HttpError(HttpStatus.NOT_FOUND, "ไม่พบข้อมูล");
        } else {
          throw new Error("เกิดข้อผิดพลาด");
        }
      });
    await esClient.update({
      index: ELASTICSEARCH_INDEX,
      id: data._id,
      doc: body,
      refresh: "wait_for",
    });
    return data;
  }

  @Delete("{id}")
  public async DELETE(@Path() id: string) {
    await esClient.delete({
      refresh: "wait_for",
      index: ELASTICSEARCH_INDEX,
      id,
    });
    return this.setStatus(HttpStatus.NO_CONTENT);
  }
}
