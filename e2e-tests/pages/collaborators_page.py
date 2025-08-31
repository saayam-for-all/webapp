# pages/collaborators_page.py

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class CollaboratorsPage:
    def __init__(self, driver):
        self.driver = driver
        self.url = "http://localhost:4173/collaborators"

    def go_to(self):
        self.driver.get(self.url)

    def get_heading_text(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        return self.driver.find_element(By.TAG_NAME, "h1").text
    
    def get_description_text(self):
    
        WebDriverWait(self.driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "p"))
          )
        return self.driver.find_element(By.TAG_NAME, "p").text
    
    def get_collaborator_images(self):
        
        return self.driver.find_elements(By.CSS_SELECTOR, "img")
    
    def get_volunteer_text(self):

        WebDriverWait(self.driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#root > div > div > main > div > div > div.flex.justify-center.mb-16 > a > p"))
          )
        return self.driver.find_element(By.CSS_SELECTOR, "#root > div > div > main > div > div > div.flex.justify-center.mb-16 > a > p").text
    
    
    def click_volunteer_match(self):
        
        WebDriverWait(self.driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='https://www.volunteermatch.org/']"))
    )
        self.driver.find_element(By.CSS_SELECTOR, "a[href='https://www.volunteermatch.org/']").click()

    
    def get_heading2_text(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h2"))
        )
        return self.driver.find_element(By.TAG_NAME, "h2").text
    
    def get_description2_text(self):

        WebDriverWait(self.driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#root > div > div > main > div > div > div.text-center.mt-16.mb-16 > p"))
          )
        return self.driver.find_element(By.CSS_SELECTOR, "#root > div > div > main > div > div > div.text-center.mt-16.mb-16 > p").text

    
    def click_join(self):
        
        WebDriverWait(self.driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href='/contact']"))
    )
        self.driver.find_element(By.CSS_SELECTOR, "a[href='/contact']").click()