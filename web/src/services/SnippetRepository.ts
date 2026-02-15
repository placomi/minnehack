import { Snippet, type SnippetT } from "../types/Snippet";
import { getDdbClient } from "../db/ddbClient";
import { PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

class SnippetRepository {
  async getSnippets(
    geohash?: string,
    startTime?: string,
    endTime?: string,
  ): Promise<SnippetT[]> {
    try {
      const ddbClient = getDdbClient();

      if (geohash) {
        // Query by geohash (PK)
        let KeyConditionExpression = "geohash = :gh";
        let ExpressionAttributeValues: any = { ":gh": { S: geohash } };

        if (startTime && endTime) {
          KeyConditionExpression += " AND timestamp_id BETWEEN :start AND :end";
          ExpressionAttributeValues[":start"] = { S: startTime };
          ExpressionAttributeValues[":end"] = { S: endTime };
        } else if (startTime) {
          KeyConditionExpression += " AND timestamp_id >= :start";
          ExpressionAttributeValues[":start"] = { S: startTime };
        } else if (endTime) {
          KeyConditionExpression += " AND timestamp_id <= :end";
          ExpressionAttributeValues[":end"] = { S: endTime };
        }

        const params = {
          TableName: "SNIPPETS",
          KeyConditionExpression,
          ExpressionAttributeValues,
          ScanIndexForward: false, // descending order
        };

        const command = new QueryCommand(params);
        const res = await ddbClient.send(command);
        if (!res.Items) return [];
        const snippets = res.Items.map((item) => unmarshall(item) as SnippetT);
        return snippets;
      } else {
        const params = {
          TableName: "SNIPPETS",
        };

        const command = new ScanCommand(params);
        const res = await ddbClient.send(command);
        if (!res.Items) return [];
        let snippets = res.Items.map((item) => unmarshall(item) as SnippetT);

        // Filter by startTime and endTime if provided
        if (startTime) {
          snippets = snippets.filter((s) => s.timestamp >= startTime);
        }
        if (endTime) {
          snippets = snippets.filter((s) => s.timestamp <= endTime);
        }

        // geohash ascending, timestamp_id descending
        snippets.sort((a, b) => {
          if (a.geohash < b.geohash) return -1;
          if (a.geohash > b.geohash) return 1;
          if (a.timestamp > b.timestamp) return -1;
          if (a.timestamp < b.timestamp) return 1;
          return 0;
        });

        return snippets;
      }
    } catch (error) {
      throw new Error("Failed to fetch snippets");
    }
  }

  async createSnippet(snippet: SnippetT): Promise<SnippetT> {
    try {
      const item = { 
        ...snippet,
        geohash: snippet.geohash,
        timestamp_id: `${snippet.timestamp}#${snippet.id}`,
      };
      const params = {
        TableName: "SNIPPETS",
        Item: marshall(item),
        ConditionExpression:
          "attribute_not_exists(geohash) AND attribute_not_exists(timestamp_id)",
      };
      const ddbClient = getDdbClient();
      const command = new PutItemCommand(params);
      await ddbClient.send(command);
      return snippet;
    } catch (error) {
      throw new Error("Failed to create snippet");
    }
  }

  // async deleteSnippet(snippetId: string): Promise<boolean> {
  //   try {
  //     // Use geohash as PK and snippetId as SK (timestamp_id)
  //     const params = {
  //       TableName: "SNIPPETS",
  //       Key: marshall({ timestamp_id: snippetId }),
  //     };
  //     const ddbClient = getDdbClient();
  //     const command = new DeleteItemCommand(params);
  //     await ddbClient.send(command);
  //     return true;
  //   } catch (error) {
  //     if ((error as any).name === "ConditionalCheckFailedException") {
  //       return false;
  //     }
  //     return false;
  //   }
  // }
}

export default new SnippetRepository();
