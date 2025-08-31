import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class LandingPage:
    def __init__(self, driver):
        self.driver = driver
        self.url = "http://localhost:4173/"

    def go_to(self):
        self.driver.get(self.url)

    def get_main_heading(self):
        # This finds <h1> with exact text
        return self.driver.find_element(
            By.XPATH,
            "//h1[contains(text(), 'Need help? Here to help?')]"
        ).text
        WebDriverWait(self.driver, 10)
    
    def get_role_titles(self):
        return [e.text for e in self.driver.find_elements(By.TAG_NAME, "h3")]

    def get_video_frame(self):
        return self.driver.find_element(By.TAG_NAME, "iframe")

    def our_mission(self):
        self.driver.find_element(By.XPATH, "/html/body/div/div/footer/footer/div/div[1]/div/nav/a[2]").click()

    def click_about_us(self):
        self.open_mobile_nav_if_present()
        time.sleep(1)

    # Find the actual "About Us" button element
        about_us_buttons = self.driver.find_elements(By.TAG_NAME, "button")
        for btn in about_us_buttons:
            if btn.text.strip() == "About Us":
                self.driver.execute_script("arguments[0].click();", btn)
                print("✅ JavaScript clicked 'About Us'")
                return
        raise Exception("❌ 'About Us' button not found")


    def click_our_team(self):
        time.sleep(1)  # Let the submenu appear

    # Use JS to click the real submenu item (likely <li> or <a>)
        menu_items = self.driver.find_elements(By.XPATH, "//li[contains(., 'Our Team')]")
        for item in menu_items:
            if "Our Team" in item.text:
                self.driver.execute_script("arguments[0].scrollIntoView(true);", item)
                time.sleep(0.5)  # Ensure it's scrolled into view
                self.driver.execute_script("arguments[0].click();", item)
                print("✅ JavaScript clicked 'Our Team'")
                return
        raise Exception("❌ 'Our Team' menu item not found")


    def open_mobile_nav_if_present(self):
        try:
            menu_button = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((
                    By.CSS_SELECTOR,
                    "button.MuiIconButton-root"  # Targeting the hamburger menu reliably
                ))
            )
            menu_button.click()
            time.sleep(1)
        except Exception as e:
            print(f"❌ Failed to open menu: {e}")


    
