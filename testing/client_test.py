import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import platform
import time


class ClientTestCase(unittest.TestCase):
    def setUp(self):
        plat = platform.system()
        if plat == "Darwin":
            self.driver = webdriver.Chrome("./mac")
        elif plat == "Linux":
            self.driver = webdriver.Chrome("./linux")
        else:
            self.driver = webdriver.Chrome("./win.exe")
        self.driver.get('http://www.localhost:3000')

    def test_title(self):
        self.assertIn('CleverNews', self.driver.title)

    def test_category_num(self):
        cat_num = self.driver.find_elements_by_xpath(
            '//*[@id="root"]/div/div/div/div/ul/div')
        self.assertTrue(len(cat_num) == 10)

    def test_search(self):
        search = self.driver.find_element_by_xpath(
            '//*[@id="root"]/div/div/header/div/div[1]/div[2]/input')
        search.send_keys("Elon Musk")
        search.send_keys(Keys.ENTER)

    def test_feed(self):
        time.sleep(2)  # Hard sleep, will change later
        feed_num = self.driver.find_elements_by_xpath(
            '//*[@id="root"]/div/div/main/ul/li')
        self.assertTrue(len(feed_num) > 0)

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main(verbosity=2)
