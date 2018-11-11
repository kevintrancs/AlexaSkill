from __future__ import unicode_literals
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


with open('../server/constants.json') as f:
    CONSTANTS = json.load(f)

headers = {"Ocp-Apim-Subscription-Key": CONSTANTS['azure_key']}
db = boto3.resource('dynamodb')
table = db.Table('NewsHashed')


class TestViewSet(viewsets.ViewSet):
    def list(self, request):
        self.get_params(request)
        param = self.get_params(request)
        response = self.query_categories(param)
        return Response(response)

    def get_params(self, request):
        param = {}
        category = request.GET.get('category')

        if category != None and category != '':
            param['category'] = category
        return param

    def query_categories(self, param):
        response = table.scan(
            FilterExpression=Attr('category').eq(param['category'])
        )
        return response
