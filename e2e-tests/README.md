### Saayam Web App - Automation Test Suite

This repository contains the **Automated regression test suite** for the **Saayam web application**. The tests are built using **Python, Selenium WebDriver,** and **Pytest.**

---

## Project Structure

Please use the automation_suite. You can fork the QA repo and continue working on the same.

```
qa/
├── selenium_tests/
│   ├── pages/               # Page Object Model classes
│   │   ├── landing_page.py
│   │   ├── collaborators_page.py
│   ├── tests/               # Automated test cases
│   │   ├── test_landing_page.py
│   │   ├── test_collaborators_page.py
│   ├── conftest.py          # Fixtures and setup/teardown
│   ├── pytest.ini           # Pytest configuration
│   ├── logger.py           # logger configuration
├── requirements.txt     # Dependencies
```

---

## Key Features

- **Selenium WebDriver** for browser automation
- **Pytest** for test execution & reporting
- **Page Object Model (POM)** for reusable and maintainable test code
- **HTML reports** (`pytest-html`)

---

## Python Installation

Ensure you have Python 3.8+ installed. You can check with:

`python --version`

If not installed, download it from [python.org](https://www.python.org/downloads/) and follow the installer steps.

## How to Run the Tests

### 1. Clone the Repository

```bash
git clone <repo-url>
cd qa/selenium_tests
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
# or
venv\Scripts\activate      # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Execute Tests

```bash
pytest tests --html=report.html
```

### View HTML Report

Open `report.html` in your browser.

---

## Configuration

`conftest.py ` handles:

- Handles browser session setup and teardown
- Reuses the same browser for multiple tests

`pytest.ini` defines:

- Defines default markers, paths, and plugin settings

---

## Page Object Model (POM)

Encapsulates web elements & actions in dedicated Python classes to keep tests clean and maintainable.

Example usage:

**Page**

```python
def get_main_heading(self):
        # This finds <h1> with exact text
        return self.driver.find_element(
            By.XPATH,
            "//h1[contains(text(), 'Need help? Here to help?')]"
        ).text
        WebDriverWait(self.driver, 10)
```

**Test**

```python
def test_our_mission_button(driver):
    page = LandingPage(driver)
    page.go_to()
    page.click_our_mission()
    assert "/our-mission" in driver.current_url
```
