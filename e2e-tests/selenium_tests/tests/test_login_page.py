import pytest
pytestmark = pytest.mark.order("last")
from pages.login_page import LoginPage
from logger import get_logger
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


logger = get_logger("TestLoginPage")

def test_login_page_loads(driver):
    logger.info("[TC_LOGIN_001] Verify login page loads with correct heading")

    page = LoginPage(driver)
    page.go_to()

    heading = page.get_login_heading()
    logger.info(f"Found heading: {heading}")

    assert heading.strip() == "Log In", "Login page heading is incorrect."
    time.sleep(1)
    logger.info("[TC_LOGIN_001] ✅ Passed")


def test_email_labels_placeholders(driver):
    logger.info("[TC_LOGIN_002] Verify email label and placeholder")

    page = LoginPage(driver)
    page.go_to()

    email_label = page.get_email_label()
    
    logger.info(f"Email label: {email_label}")

    assert email_label == "Email", "Email label text is incorrect."
    assert page.get_email_placeholder() == "Email", "Email placeholder mismatch"

    logger.info("[TC_LOGIN_002] ✅ Passed")


def test_password_labels_placeholders(driver):
    logger.info("[TC_LOGIN_003] Verify password label and placeholder")

    page = LoginPage(driver)
    page.go_to()

    password_label = page.get_password_label()

    logger.info(f"Password label: {password_label}")

    assert password_label == "Password", "Password label text is incorrect."
    assert page.get_password_placeholder() == "Password", "Password placeholder mismatch"

    logger.info("[TC_LOGIN_003] ✅ Passed")


def test_forgot_password_link(driver):
    logger.info("[TC_LOGIN_004] Verify Forgot Password? link is clickable")

    page = LoginPage(driver)
    page.go_to()
    page.click_forgot_password()

    assert "/forgot-password" in driver.current_url.lower(), "Forgot Password link did not navigate correctly."
    time.sleep(1)
    logger.info("[TC_LOGIN_004] ✅ Passed")


def test_signup_link(driver):
    logger.info("[TC_LOGIN_005] Verify Sign Up link is clickable")

    page = LoginPage(driver)
    page.go_to()
    page.click_signup_link()

    assert "/signup" in driver.current_url.lower(), "Sign Up link did not navigate correctly."
    time.sleep(1)
    logger.info("[TC_LOGIN_005] ✅ Passed")


def test_empty_fields_error(driver):
    logger.info("[TC_LOGIN_006] Verify error messages for empty email and password")

    page = LoginPage(driver)
    page.go_to()
    page.click_login_button()

    email_error = page.get_email_error()
    password_error = page.get_password_error()

    assert "Please enter your email" in email_error, "Email required error not shown"
    assert "Please enter your password" in password_error, "Password required error not shown"
    logger.info("[TC_LOGIN_006] ✅ Passed")
    time.sleep(1)

def test_invalid_credentials(driver):
    logger.info("[TC_LOGIN_007] Verify error message for invalid credentials")

    page = LoginPage(driver)
    page.go_to()
    page.login("invalid@example.com", "WrongPass123")
    time.sleep(1)

    error_message = page.get_login_error()
    assert "Invalid email or password" in error_message, "Invalid credentials error not displayed"
    logger.info("[TC_LOGIN_007] ✅ Passed")
    time.sleep(1)

def test_successful_login(driver):
    logger.info("[TC_LOGIN_008] Verify Successful Login")

    page = LoginPage(driver)
    page.go_to()
    page.login("asrffcwxbiozrwlhry@xfavaj.com", "Qwerty@12345")

    WebDriverWait(driver, 60).until(
        EC.url_contains("/dashboard")
    )

    assert "/dashboard" in driver.current_url.lower(), "Log In unsuccessful"
    logger.info("[TC_LOGIN_008] ✅ Passed")

