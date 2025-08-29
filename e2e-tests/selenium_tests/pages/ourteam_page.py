from selenium.webdriver.common.by import By

class OurTeamPage:
    def __init__(self, driver):
        self.driver = driver
        self.url = "https://test-saayam.netlify.app/our-team"

    def go_to(self):
        self.driver.get(self.url)

    def get_url(self):
        return self.driver.current_url

    def get_board_member_cards(self):
        return self.driver.find_elements(By.XPATH, "//h2[contains(text(),'Board of Directors')]/following::div[@class='w-[180px] text-center']")

    def get_exec_member_cards(self):
        return self.driver.find_elements(By.XPATH, "//h2[contains(text(),'Executive Team')]/following::div[@class='w-[180px] text-center']")

    def get_member_details(self, member_card):
        image = member_card.find_element(By.CSS_SELECTOR, "div > img")
        name = member_card.find_elements(By.CSS_SELECTOR, "div")[1].text
        role = member_card.find_elements(By.CSS_SELECTOR, "div")[2].text
        return image.get_attribute("src"), name, role

    def get_all_linkedin_links(self):
        return self.driver.find_elements(By.CSS_SELECTOR, "a[href*='linkedin.com']")
