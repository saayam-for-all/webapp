import time
import pytest
from pages.ourteam_page import OurTeamPage
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@pytest.fixture
def team_page(driver):
    page = OurTeamPage(driver)
    page.go_to()
    time.sleep(5)
    return page

def test_our_team_page(team_page):
    current_url = team_page.get_url()
    assert "our-team" in current_url, f"Expected 'our-team' in URL but got: {current_url}"

def test_board_member_has_image_and_name(team_page):
    board_cards = team_page.get_board_member_cards()
    for card in board_cards:
        image_src, name, role = team_page.get_member_details(card)
        assert image_src.strip() != "", f"Missing image in card: {name}"
        assert name.strip() != "", "Name is missing"
        assert role.strip() != "", f"Role is missing for {name}"

def test_exec_member_has_image_and_name(team_page):
    exec_cards = team_page.get_exec_member_cards()
    for card in exec_cards:
        image_src, name, role = team_page.get_member_details(card)
        assert image_src.strip() != "", f"Missing image in card: {name}"
        assert name.strip() != "", "Name is missing"
        assert role.strip() != "", f"Role is missing for {name}"

def test_linkedin_links_redirection(team_page):
    linkedin_links = team_page.get_all_linkedin_links()
    for link in linkedin_links:
        href = link.get_attribute("href")
        assert "linkedin.com" in href.lower(), f"Not a LinkedIn URL: {href}"
        original_window = team_page.driver.current_window_handle
        link.click()
        time.sleep(2)
        team_page.driver.switch_to.window(team_page.driver.window_handles[-1])
        assert "linkedin.com" in team_page.driver.current_url.lower(), f"Redirection failed: {team_page.driver.current_url}"
        team_page.driver.close()
        team_page.driver.switch_to.window(original_window)

@pytest.mark.parametrize("width, height", [(768, 1024), (414, 896), (1920, 1080)])
def test_responsive_layout_across_viewports(driver, width, height):
    driver.set_window_size(width, height)
    page = OurTeamPage(driver)
    page.go_to()
    time.sleep(10)

    exec_cards = OurTeamPage(driver).get_exec_member_cards()
    print(f"Found {len(exec_cards)} executive cards")

    for i, card in enumerate(exec_cards):
        driver.execute_script("arguments[0].scrollIntoView(true);", card)
        time.sleep(0.3)
        assert card.is_displayed(), f"Card {i} not visible at {width}x{height}"






