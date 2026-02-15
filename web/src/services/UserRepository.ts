import {
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { User, type UserT } from "@/src/types/User";
import { Result } from "@/src/types/common/common";
import { getDdbClient } from "../db/ddbClient";

const USERS_TABLE_NAME = "USERS";

export type UserLookup = {
  id?: string;
  phone_number?: string;
  email?: string;
  username?: string;
};

class UserRepository {
  async getUser(query: UserLookup | string): Promise<Result<UserT>> {
    if (typeof query === 'string') {
      query = { id: query };
    }
    const lookup: UserLookup = { id: query.id }

    const client = await getDdbClient();

    try {
      let item;

      if (lookup.id) {
        const res = await client.send(
          new GetItemCommand({
            TableName: USERS_TABLE_NAME,
            Key: marshall({ id: lookup.id }),
          })
        );

        item = res.Item ? unmarshall(res.Item) : undefined;
      } else if (lookup.phone_number) {
        const res = await client.send(
          new QueryCommand({
            TableName: USERS_TABLE_NAME,
            IndexName: "phone_number-index",
            KeyConditionExpression: "phone_number = :pn",
            ExpressionAttributeValues: marshall({
              ":pn": lookup.phone_number,
            }),
            Limit: 1,
          })
        );

        item = res.Items?.[0] ? unmarshall(res.Items[0]) : undefined;
      } else if (lookup.email) {
        const res = await client.send(
          new QueryCommand({
            TableName: USERS_TABLE_NAME,
            IndexName: "email-index",
            KeyConditionExpression: "email = :em",
            ExpressionAttributeValues: marshall({
              ":em": lookup.email,
            }),
            Limit: 1,
          })
        );

        item = res.Items?.[0] ? unmarshall(res.Items[0]) : undefined;
      } else if (lookup.username) {
        const res = await client.send(
          new QueryCommand({
            TableName: USERS_TABLE_NAME,
            IndexName: "username-index",
            KeyConditionExpression: "username = :un",
            ExpressionAttributeValues: marshall({
              ":un": lookup.username,
            }),
            Limit: 1,
          })
        );

        item = res.Items?.[0] ? unmarshall(res.Items[0]) : undefined;
      } else {
        return {
          success: false,
          code: 400,
          details: {
            error: "No query provided.",
            message: "Should've been caught by api.",
          },
        };
      }

      if (!item) {
        return {
          success: false,
          code: 404,
          details: {
            error: "No user found.",
            message: "No user found in DynamoDB",
          },
        };
      }

      const parsed = User.safeParse(item);

      if (!parsed.success) {
        return {
          success: false,
          code: 400,
          details: {
            error: "Invalid user format.",
            message: "Failed to parse user from DynamoDB",
          },
        };
      }

      return { success: true, value: parsed.data };
    } catch (err) {
      console.error("DynamoDB getUser error:", err);
      return {
        success: false,
        code: 500,
        details: {
          error: "DynamoDB getUser error",
          message: err instanceof Error ? err.message : "unknown error",
        },
      };
    }
  }

  async addUser(user: UserT): Promise<Result<UserT>> {
    const client = await getDdbClient();

    try {
      const now = new Date().toISOString();

      const item: UserT = {
        ...user,
        created_at: user.created_at ?? now,
        updated_at: user.updated_at ?? now,
      };

      await client.send(
        new PutItemCommand({
          TableName: USERS_TABLE_NAME,
          Item: marshall(item, { removeUndefinedValues: true }),
          ConditionExpression: "attribute_not_exists(id)", // prevent overwrite
        })
      );

      const parsed = User.safeParse(item);

      if (!parsed.success) {
        return {
          success: false,
          code: 400,
          details: {
            error: "Invalid user data",
            message: "Failed to parse user after insert",
          },
        };
      }

      return { success: true, value: parsed.data };
    } catch (err: any) {
      if (err.name === "ConditionalCheckFailedException") {
        return {
          success: false,
          code: 400,
          details: {
            error: "Duplicate key error",
            message: "A user with that id already exists.",
          },
        };
      }

      console.error("DynamoDB addUser error:", err);

      return {
        success: false,
        code: 500,
        details: {
          error: "Error saving user",
          message: "Error saving user — try again",
        },
      };
    }
  }
}

export default new UserRepository();