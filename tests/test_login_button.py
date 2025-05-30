import unittest
import os
import sys
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class TestLoginButton(unittest.TestCase):
    """Test the login button on the index page."""
    
    def setUp(self):
        """Set up the test environment."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        
        # Get the absolute path to the index.html file
        self.index_path = f"file://{Path('/workspace/ai_insight/index.html').absolute()}"
        
    def tearDown(self):
        """Clean up after the test."""
        self.driver.quit()
        
    def test_button_text_is_login_chinese(self):
        """Test that the button text is '登录'."""
        self.driver.get(self.index_path)
        button = self.driver.find_element(By.CLASS_NAME, "signin-button")
        self.assertEqual(button.text, "登录", "Button text should be '登录'")
        
    def test_button_color_is_green(self):
        """Test that the button color is green (#2ecc71)."""
        self.driver.get(self.index_path)
        button = self.driver.find_element(By.CLASS_NAME, "signin-button")
        button_color = button.value_of_css_property("background-color")
        
        # Convert RGB to hex for comparison
        # The format will be "rgb(46, 204, 113)" or "rgba(46, 204, 113, 1)" for #2ecc71
        if button_color.startswith("rgba"):
            # Handle rgba format
            rgba = button_color.strip("rgba()").split(",")
            r, g, b = [int(c.strip()) for c in rgba[:3]]
        else:
            # Handle rgb format
            rgb = button_color.strip("rgb()").split(",")
            r, g, b = [int(c.strip()) for c in rgb]
        
        # Check if the color is close to the expected green (#2ecc71 = rgb(46, 204, 113))
        self.assertTrue(40 <= r <= 50, f"Red component should be close to 46, got {r}")
        self.assertTrue(200 <= g <= 210, f"Green component should be close to 204, got {g}")
        self.assertTrue(110 <= b <= 120, f"Blue component should be close to 113, got {b}")
        
if __name__ == "__main__":
    unittest.main()