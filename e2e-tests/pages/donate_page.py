from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

class DonatePage:
    def __init__(self, driver):
        self.driver = driver
        self.url = "http://localhost:4173/donate"

    def go_to(self):
        self.driver.get(self.url)
    
    def is_element_visible(self, by, value):
        try:
            element = self.driver.find_element(by, value)
            return element.is_displayed()
        except Exception:
            return False

    def click_paypal(self):
        self.driver.find_element(By.XPATH, "//img[@alt='PayPal']").click()

    def click_stripe(self):
        self.driver.find_element(By.XPATH, "//img[@alt='Stripe']").click()

    def click_charity_navigator(self):
        self.driver.find_element(By.XPATH, "//img[@alt='Charity Navigator']").click()

    def click_benevity(self):
        self.driver.find_element(By.XPATH, "//img[@alt='Benevity']").click()

    def toggle_faq(self):
        self.driver.find_element(By.CSS_SELECTOR, ".faq-title").click()

    def get_all_donation_buttons(self):
        return self.driver.find_elements(By.CSS_SELECTOR, "img[alt]")

    def is_page_loaded(self):
        return self.driver.find_element(By.CLASS_NAME, "banner-section").is_displayed()

    def hover_over_element(self, element):
        ActionChains(self.driver).move_to_element(element).perform()
