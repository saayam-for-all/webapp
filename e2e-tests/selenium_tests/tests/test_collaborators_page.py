# tests/test_collaborators_page.py

from pages.collaborators_page import CollaboratorsPage
from logger import get_logger
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

logger = get_logger("TestCollaboratorsPage")

def test_collaborators_page_loads(driver):
    logger.info("[TC_COLLAB_001] Verify Collaborators page loads correctly")

    page = CollaboratorsPage(driver)
    page.go_to()

    heading = page.get_heading_text()
    logger.info(f"Page heading: {heading}")
    assert "Collaborators" in heading or "Our Collaborators" in heading

    images = page.get_collaborator_images()
    logger.info(f"Number of collaborator images found: {len(images)}")
    assert len(images) > 0, "No collaborator images found!"
    time.sleep(1)

    logger.info("[TC_COLLAB_001] ✅ Passed")

def test_collaborators_page_description(driver):
    logger.info("[TC_COLLAB_002] Verify collaborators page description text matches expected.")

    page = CollaboratorsPage(driver)
    page.go_to()

    expected_text = (
        "In some cases, our volunteers partner with local NGOs, "
        "community groups, and service organizations to ensure that every request is fulfilled effectively. "
        "Saayam For All builds a collaborative ecosystem that strengthens community support—because helping "
        "hands are stronger together."
    )

    actual_text = page.get_description_text()

    logger.info(f"Found description: {actual_text}")

    assert expected_text == actual_text.strip(), "Description text does not match exactly."
    time.sleep(1)


    logger.info("[TC_COLLAB_002] ✅ Passed")


def test_volunteer_match_description(driver):
    logger.info("[TC_VOL_003] Verify VolunteerMatch description text is displayed correctly")
    page = CollaboratorsPage(driver)
    page.go_to()

    description = page.get_volunteer_text()
    logger.info(f"Found description: {description}")

    expected = (
        "U.S based nonprofit organization which provides a national digital "
        "infrastructure to serve volunteers and nonprofits organization."
    )

    assert expected in description
    time.sleep(1)
    logger.info("[TC_VOL_003] ✅ Passed")


def test_click_link(driver):
    logger.info("[TC_004] Verify clickable link navigates correctly")

    page = CollaboratorsPage(driver)
    page.go_to()
    original_window = driver.current_window_handle

    page.click_volunteer_match()
    # If the link opens in a new tab, switch to the new window:
    driver.switch_to.window(driver.window_handles[-1])
    assert "volunteermatch.org" in driver.current_url
    time.sleep(3)
    driver.close()
    driver.switch_to.window(original_window)

    logger.info("[TC_004] ✅ Passed")

def test_wanttojoin(driver):
    logger.info("[TC_COLLAB_005] Verify want to join text.")

    page = CollaboratorsPage(driver)
    page.go_to()

    expected_text = (
        "Want to join us?"
    )

    actual_text = page.get_heading2_text()

    logger.info(f"Found description: {actual_text}")

    assert expected_text == actual_text.strip(), "Description text does not match exactly."
    time.sleep(1)


    logger.info("[TC_COLLAB_005] ✅ Passed")

def test_description2(driver):
    logger.info("[TC_VOL_006] Verify description text is displayed correctly")
    page = CollaboratorsPage(driver)
    page.go_to()

    description = page.get_description2_text()
    logger.info(f"Found description: {description}")

    expected = (
        "Chat with our community and get in touch with different charity organizations!"
    )

    assert expected in description
    time.sleep(1)
    logger.info("[TC_VOL_006] ✅ Passed")


def test_click_join(driver):
    logger.info("[TC_007] Verify clickable link navigates correctly")

    page = CollaboratorsPage(driver)
    page.go_to()
    page.click_join()
    assert "/contact" in driver.current_url
    time.sleep(3)

    logger.info("[TC_007] ✅ Passed")