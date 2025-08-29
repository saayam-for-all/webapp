# pages/login_page.py

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.url = "https://test-saayam.netlify.app/login"

    def go_to(self):
        self.driver.get(self.url)

    def login(self, email, password):
        email_input = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "email"))
        )
        email_input.clear()
        email_input.send_keys(email)

        password_input = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "password"))
        )
        password_input.clear()
        password_input.send_keys(password)

        self.click_login_button()

    def get_login_heading(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        return self.driver.find_element(By.TAG_NAME, "h1").text
        
    
    def get_email_label(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//label[contains(text(),'Email')]"))
        )
        return self.driver.find_element(By.XPATH, "//label[contains(text(),'Email')]").text

    def get_password_label(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//label[contains(text(),'Password')]"))
        )
        return self.driver.find_element(By.XPATH, "//label[contains(text(),'Password')]").text
    
    def get_email_placeholder(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        return self.driver.find_element(By.ID, "email").get_attribute("placeholder")

    def get_password_placeholder(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "password"))
        )
        return self.driver.find_element(By.ID, "password").get_attribute("placeholder")


    def click_forgot_password(self):
        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button.my-2.text-left.underline"))
        )
        self.driver.find_element(By.CSS_SELECTOR, "button.my-2.text-left.underline").click()


    def click_signup_link(self):
        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button.mx-2.text-left.underline"))
        )
        self.driver.find_element(By.CSS_SELECTOR, "button.mx-2.text-left.underline").click()

    def click_login_button(self):
        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((
                By.CSS_SELECTOR,
                "button.my-4.py-2.bg-blue-400.text-white.rounded-xl.hover\\:bg-blue-500"
            ))
        )
        self.driver.find_element(By.CSS_SELECTOR, "button.my-4.py-2.bg-blue-400.text-white.rounded-xl.hover\\:bg-blue-500").click()


    def get_email_error(self):
        return self.driver.find_element(By.XPATH, "//p[contains(text(),'Please enter your email')]").text

    def get_password_error(self):
        return self.driver.find_element(By.XPATH, "//p[contains(text(),'Please enter your password')]").text


    def get_login_error(self):
        return self.driver.find_element(By.XPATH, "//p[contains(text(),'Invalid email or password')]").text

    


