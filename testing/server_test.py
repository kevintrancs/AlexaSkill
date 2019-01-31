import unittest
import requests


class ServerTest(unittest.TestCase):
    def test_categories(self):
        r = requests.get('http://0.0.0.0:5000/api/category?field=US')
        self.assertTrue(r.status_code == requests.codes.ok)
        num = r.json()
        self.assertTrue(len(num['found']) > 0)


if __name__ == '__main__':
    unittest.main(verbosity=2)
