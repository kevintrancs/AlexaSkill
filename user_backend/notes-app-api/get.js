import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


/* 
WORD OF WARNING: We currently don't have any sort of unique
identifier for 'posts', ie, each posting of user data doesn't
have a 'post id' like it does in the schema of the tutorial
I'm using. This get function expects a table with a binary
search key, which we don't have. Basically, just don't use
this specific get function for anything. We've got no real
use for it anyway.
*/

export async function main(event, context) {
  const params = {
    TableName: "userData",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}