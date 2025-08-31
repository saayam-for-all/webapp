import pytest
import time
from selenium.webdriver.common.by import By
from pages.donate_page import DonatePage

def test_donate_page_navigation(driver):
    driver.get("https://test-saayam.netlify.app/")
    donate_button = driver.find_element(By.LINK_TEXT, "Donate")
    donate_button.click()

    assert "donate" in driver.current_url.lower()

def test_donate_page_ui_elements(driver):
    page = DonatePage(driver)
    page.go_to()

    assert page.is_element_visible(By.CLASS_NAME, "donate-bg-image")
    assert page.is_element_visible(By.CLASS_NAME, "donate-title")
    assert page.is_element_visible(By.CLASS_NAME, "donate-subtitle")
    assert page.is_element_visible(By.XPATH, "//img[@alt='PayPal']")
    assert page.is_element_visible(By.XPATH, "//img[@alt='Stripe']")
    assert page.is_element_visible(By.XPATH, "//img[@alt='Charity Navigator']")
    assert page.is_element_visible(By.XPATH, "//img[@alt='Benevity']")
    assert page.is_element_visible(By.XPATH, "//h2[contains(text(), \"FAQ's\")]")

def test_paypal_button(driver):
    page = DonatePage(driver)
    page.go_to()
    page.click_paypal()
    driver.switch_to.window(driver.window_handles[-1])
    assert "paypal" in driver.current_url.lower()
    driver.close()
    driver.switch_to.window(driver.window_handles[0])

def test_stripe_button(driver):
    page = DonatePage(driver)
    page.go_to()
    try:
        page.click_stripe()
    except Exception as e:
        pytest.fail(f"Stripe button click failed: {e}")

def test_charity_navigator_button(driver):
    page = DonatePage(driver)
    page.go_to()
    page.click_charity_navigator()
    driver.switch_to.window(driver.window_handles[-1])
    assert "charitynavigator" in driver.current_url.lower()
    driver.close()
    driver.switch_to.window(driver.window_handles[0])

def test_benevity_button(driver):
    page = DonatePage(driver)
    page.go_to()
    page.click_benevity()
    try:
        driver.switch_to.window(driver.window_handles[-1])
        assert "benevity" in driver.current_url.lower()
    finally:
        if len(driver.window_handles) > 1:
            driver.close()
            driver.switch_to.window(driver.window_handles[0])

def test_faq_toggle(driver):
    page = DonatePage(driver)
    page.go_to()
    faq_questions = [
        "Are donations tax deductible?",
        "How will my donation be used?",
        "Can I cancel recurring donations?"
    ]

    for question in faq_questions:
        btn = driver.find_element(By.XPATH, f"//button[contains(text(), '{question}')]")
        assert btn.is_displayed(), f"FAQ question not visible: {question}"

        btn.click()
        time.sleep(1)
        answer = btn.find_element(By.XPATH, "following-sibling::*[1]")
        assert answer.is_displayed(), f"Answer not visible for: {question}"

        btn.click()  # optional: test collapsing
        time.sleep(0.5)



def test_button_hover_effects(driver):
    page = DonatePage(driver)
    page.go_to()
    buttons = page.get_all_donation_buttons()
    for btn in buttons:
        page.hover_over_element(btn)
        assert btn.is_displayed()

