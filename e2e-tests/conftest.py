import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

def pytest_addoption(parser):
    parser.addoption(
        "--browser", action="store", default="chrome", help="Browser to use: chrome, firefox, edge"
    )

@pytest.fixture(scope="session")
def driver(request):
    browser = request.config.getoption("--browser")

    if browser == "chrome":
        options = webdriver.ChromeOptions()
        options.binary_location = "/snap/bin/firefox"  # Firefox Snap   
        service = FirefoxService()  # Sin path, usa el binario en PATH
        options.add_argument("--start-maximized")
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

    elif browser == "firefox":
        options = webdriver.FirefoxOptions()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.set_preference("dom.webdriver.enabled", True)
        options.set_preference("useAutomationExtension", True)
        options.set_preference("media.navigator.streams.fake", True)
        options.set_preference("media.navigator.permission.disabled", True)
        # ⚡ Forzar puerto fijo para evitar fallos con puertos aleatorios
        service = FirefoxService(
            GeckoDriverManager().install(),
            port=4444
        )

        driver = webdriver.Firefox(service=service, options=options)


    elif browser == "edge":
        options = webdriver.EdgeOptions()
        options.add_argument("--headless")
        service = EdgeService(EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=service, options=options)

    else:
        raise ValueError(f"❌ Browser '{browser}' not supported!")

    yield driver
    driver.quit()
