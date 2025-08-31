import time
import pytest
from pages.landing_page import LandingPage


def test_landing_page_heading(driver):
    page = LandingPage(driver)
    page.go_to()
    heading = page.get_main_heading()
    assert heading == "Need help? Here to help?"

    roles = page.get_role_titles()
    assert any("Beneficiaries" in r for r in roles)
    assert any("Volunteers" in r for r in roles)

def test_youtube_video_presence(driver):
    page = LandingPage(driver)
    page.go_to()
    iframe = page.get_video_frame()
    assert "youtube.com" in iframe.get_attribute("src")
    time.sleep(5)

def test_our_mission_button(driver):
    page = LandingPage(driver)
    page.go_to()
    page.our_mission()
    time.sleep(1)  # wait for navigation
    assert "/our-mission" in driver.current_url
    time.sleep(5)
