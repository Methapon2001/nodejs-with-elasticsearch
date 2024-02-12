import { Controller, Get, Route, Security, Tags } from "tsoa";

if (!process.env.ELASTICSEARCH_INDEX) {
  throw Error("Default ElasticSearch index must be specified.");
}

const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX;

@Route("/")
@Security("keycloak")
export class AppController extends Controller {
  @Tags("Search")
  @Get()
  public async GET() {
    return {};
  }
}
