import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
  node: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
});

export default esClient;
