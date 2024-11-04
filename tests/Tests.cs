using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;
using System;
using SeleniumExtras.WaitHelpers;

namespace GameStoreTests
{
    public class Tests
    {
        protected IWebDriver driver;
        protected WebDriverWait wait;

        [SetUp]
        public void SetUp()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            driver = new ChromeDriver();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
            driver.Manage().Window.Maximize();
            driver.Url = "http://localhost:3000/";
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        }

        [Test, Order(1)]
        public void TestGetStartedButton()
        {
            IWebElement getStartedButton = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("signBtn")));
            System.Threading.Thread.Sleep(1000);
            getStartedButton.Click();
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/login"));
        }

        [Test, Order(2)]
        public void TestNavigationToSections()
        {
            IWebElement homeLink = wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("homeBtn")));
            System.Threading.Thread.Sleep(1000);
            homeLink.Click();
            Assert.That(driver.Url.Contains("#home"));

            IWebElement gamesLink = wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("gamesBtn")));
            System.Threading.Thread.Sleep(1000);
            gamesLink.Click();
            Assert.That(driver.Url.Contains("#games"));

            IWebElement featuresLink = wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("featuresBtn")));
            System.Threading.Thread.Sleep(1000);
            featuresLink.Click();
            Assert.That(driver.Url.Contains("#features"));
        }

        [Test, Order(3)]
        public void TestFeaturedGamesSectionLoads()
        {
            IWebElement gamesLink = wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("gamesBtn")));
            System.Threading.Thread.Sleep(1000);
            gamesLink.Click();
            IWebElement gamesSection = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("productList")));
            Assert.That(gamesSection.Displayed, "Featured Games section is not displayed.");

            var games = gamesSection.FindElements(By.ClassName("game-item"));
            Assert.That(games.Count > 0, "No games found in the Featured Games section.");
        }

        [Test, Order(4)]
        public void TestContactUsPopup()
        {
            IWebElement contactButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.ClassName("contact-btn")));
            System.Threading.Thread.Sleep(1000);
            contactButton.Click();

            IWebElement popup = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("contactPopup")));
            Assert.That(popup.Displayed, "Contact Us popup did not open.");

            driver.FindElement(By.Id("sender")).SendKeys("testUser");
            driver.FindElement(By.Id("message")).SendKeys("This is a test message.");
            IWebElement sendButton = driver.FindElement(By.Id("sendMessageBtn"));
            System.Threading.Thread.Sleep(1000);
            sendButton.Click();

            IWebElement successMessage = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("sendSuccecfulMessage")));
            Assert.That(successMessage.Displayed, "Success message did not appear after sending the message.");

            IWebElement closeButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.ClassName("close-popup")));
            System.Threading.Thread.Sleep(1000);
            closeButton.Click();
            wait.Until(ExpectedConditions.InvisibilityOfElementLocated(By.Id("contactPopup")));
        }

        [Test, Order(5)]
        public void TestLoginWithUser()
        {
            driver.Url = "http://localhost:3000/login";
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("usernameLogin"))).SendKeys("matan");
            driver.FindElement(By.Id("passwordLogin")).SendKeys("1234");
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("loginBtn")).Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.ClassName("toolbar")));
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/user"));
        }

        [Test, Order(6)]
        public void TestLoginWithAdmin()
        {
            driver.Url = "http://localhost:3000/login";
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("usernameLogin"))).SendKeys("admin");
            driver.FindElement(By.Id("passwordLogin")).SendKeys("1234");
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("loginBtn")).Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.ClassName("toolbar")));
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/admin"));
        }

        [Test, Order(7)]
        public void TestRegisterAndRedirectToLogin()
        {
            driver.Url = "http://localhost:3000/login";
            IWebElement toggleButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("toggleFormBtn")));
            System.Threading.Thread.Sleep(1000);
            toggleButton.Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("registerForm")));

            string randomName = NameGenerator.GetRandomName();
            string randomEmail = NameGenerator.GetRandomEmail();

            driver.FindElement(By.Id("usernameRegister")).SendKeys(randomName);
            driver.FindElement(By.Id("emailRegister")).SendKeys(randomEmail);
            driver.FindElement(By.Id("passwordRegister")).SendKeys("1234");
            driver.FindElement(By.CssSelector("#registerForm .btn")).Click();

            var registerMessage = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("registerMessage")));
            System.Threading.Thread.Sleep(1000);
            Assert.That(registerMessage.Text, Is.EqualTo("Registration successful!"));
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/login"));
        }

        [Test, Order(8)]

        public void TestProductsTab()
        {
            TestLoginWithAdmin();
            driver.FindElement(By.Id("productsBtn")).Click();
            System.Threading.Thread.Sleep(1000);
            var productsSection = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("productsSection")));
            Assert.That(productsSection.Displayed, "Products section did not open.");
        }

        [Test, Order(9)]
        public void TestUsersTab()
        {
            TestLoginWithAdmin();
            driver.FindElement(By.Id("usersBtn")).Click();
            System.Threading.Thread.Sleep(1000);
            var usersSection = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("usersSection")));
            Assert.That(usersSection.Displayed, "Users section did not open.");
        }

        [Test, Order(10)]
        public void TestOrdersTab()
        {
            TestLoginWithAdmin();
            driver.FindElement(By.Id("ordersBtn")).Click();
            System.Threading.Thread.Sleep(1000);
            var ordersSection = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("ordersSection")));
            Assert.That(ordersSection.Displayed, "Orders section did not open.");
        }

        [Test, Order(11)]
        public void TestLogout()
        {
            TestLoginWithAdmin();
            driver.FindElement(By.Id("logoutBtn")).Click();
            System.Threading.Thread.Sleep(1000);
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/"));
        }

        [Test, Order(12)]
        public void TestCreateProductModal()
        {
            TestLoginWithAdmin();
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("productsBtn")).Click();
            System.Threading.Thread.Sleep(1000);
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("createProductBtn"))).Click();
            var createProductModal = wait.Until(ExpectedConditions.ElementIsVisible(By.Id("productModal")));
            Assert.That(createProductModal.Displayed, "Create Product modal did not open.");
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("closeModal")).Click();
            wait.Until(ExpectedConditions.InvisibilityOfElementLocated(By.Id("productModal")));
        }

        [Test, Order(13)]
        public void TestFilterUsers()
        {
            TestLoginWithAdmin();
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("usersBtn")).Click();
            var searchInput = driver.FindElement(By.Id("searchInput"));
            TypeWithKeyUp(searchInput, "testUser");
            System.Threading.Thread.Sleep(1000);
            var usersTable = driver.FindElement(By.Id("usersTableBody"));
            Assert.That(usersTable.Text.Contains("testUser"), "User not found in filter results.");
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("delBtn")).Click();
            Assert.That(usersTable.Text.Length > 0, "Users table should not be empty after clearing filter.");
        }

        [Test, Order(14)]
       public void TestIfMessageHaveReceived()
        {
            TestLoginWithAdmin();

            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("messagesBtn"))).Click();
            
            // מצא את כל האלמנטים עם ה-unread class
            var unreadMessages = driver.FindElements(By.XPath("//div[@class='user-list']//div[@class='user']//div[contains(@class, 'unread')]"));
            
            bool foundUnreadForTestUser = false;

            foreach (var unreadMessage in unreadMessages)
            {
                // בדוק אם לאבא של unread יש ילד עם שם המשתמש testUser
                var parentUser = unreadMessage.FindElement(By.XPath("./ancestor::div[@class='user']"));
                var usernameElement = parentUser.FindElements(By.XPath(".//p[text()='testUser']"));

                if (usernameElement.Count > 0)
                {
                    foundUnreadForTestUser = true;
                    break;
                }
            }

            Assert.That(foundUnreadForTestUser, "No unread messages found for testUser.");
        }

        private void TypeWithKeyUp(IWebElement element, string text)
        {
            foreach (char c in text)
            {
                element.SendKeys(c.ToString());
                System.Threading.Thread.Sleep(100); 
            }
        }

        [TearDown]
        public void TearDown()
        {
            driver?.Quit();
        }
    }
}
