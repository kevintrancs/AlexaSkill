# create users tables in dynamodb
def create_users(dynamodb_instance):
    table = dynamodb_instance.create_table(
        TableName='users',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'username',
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'N'
            },
            {
                'AttributeName': 'username',
                'AttributeType': 'S',
            },
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5,
        }
    )
    waiter = dynamodb_instance.get_waiter('table_exists')
    waiter.wait(TableName='users')
    print('users table created')

def delete_users(dynamodb_instance):
    dynamodb_instance.delete_table(TableName='users')
    waiter = dynamodb_instance.get_waiter('table_not_exists')
    waiter.wait(TableName='users')
    print('users table deleted')

def create_articles(dynamodb_instance):
    dynamodb_instance.create_table(
        TableName='articles',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH' 
            },
            {
                'AttributeName': 'datePublished',
                'KeyType': 'RANGE'
            },
            {
                'AttributeName': 'category',
                'KeyType': 'RANGE'
            },
            {
                'AttributeName': 'provider',
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'N'
            },
            {
                'AttributeName': 'datePublished',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'category',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'provider',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 50,
            'WriteCapacityUnits': 50
        }
    )
    waiter = dynamodb_instance.get_waiter('table_exists')
    waiter.wait(TableName='articles')
    print('articles table created')

def delete_articles(dynamodb_instance):
    dynamodb_instance.delete_table(TableName='articles')
    waiter = dynamodb_instance.get_waiter('table_not_exists')
    waiter.wait(TableName='articles')
    print('articles table deleted')