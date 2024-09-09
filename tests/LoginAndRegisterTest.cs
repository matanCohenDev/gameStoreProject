using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using NUnit.Framework;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using MongoDB.Driver;
using MongoDB.Bson;

namespace Tests
{
    [TestFixture]
    [Parallelizable(ParallelScope.None)]
    public class LoginAndRegisterTest
    {
        protected IWebDriver driver = null!;
        protected IMongoClient mongoClient = null!;
        protected IMongoDatabase db = null!;
        protected IMongoCollection<BsonDocument> usersCollection = null!;

        [OneTimeSetUp]
        public void StartBrowser()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            driver = new ChromeDriver();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
            driver.Manage().Window.Maximize();
            driver.Url = "http://localhost:3000/";
            mongoClient = new MongoClient("mongodb+srv://gameStore:gameStore123456@gamestore.tshx1.mongodb.net/");
            db = mongoClient.GetDatabase("test");
            usersCollection = db.GetCollection<BsonDocument>("users");
        }

        public void TestLoginAdmin(string username, string password)
        {
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("usernameLogin")).SendKeys(username);
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("passwordLogin")).SendKeys(password);
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("loginForm")).Submit();
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.UrlContains("admin"));
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/admin"));
        }

        public void TestLoginUser(string username, string password)
        {
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("usernameLogin")).SendKeys(username);
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("passwordLogin")).SendKeys(password);
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("loginForm")).Submit();
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.UrlContains("user"));
            Assert.That(driver.Url, Is.EqualTo("http://localhost:3000/user"));
        }

        [Ignore("TestRegisterAndCheckDB is ignored in the base class to avoid duplication in derived classes.")]
        [Test , Order(0)]
        public void TestRegisterAndCheckDB()
        {
            string username = "testUser";
            string email = "testUser@example.com";
            string password = "password123";
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("toggleFormBtn")).Click();
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("usernameRegister")).SendKeys(username);
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            System.Threading.Thread.Sleep(1000);
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("emailRegister"))).SendKeys(email);
            System.Threading.Thread.Sleep(1000);
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("passwordRegister"))).SendKeys(password);
            System.Threading.Thread.Sleep(1000);
            driver.FindElement(By.Id("registerForm")).Submit();
            System.Threading.Thread.Sleep(1000); 
            var filter = Builders<BsonDocument>.Filter.Eq("username", username);
            var registeredUser = usersCollection.Find(filter).FirstOrDefault();
            if (registeredUser == null)
                throw new Exception("User not found in the database.");
            Assert.That(registeredUser["email"].AsString, Is.EqualTo(email));
            System.Threading.Thread.Sleep(1000);
            TestLoginUser(username, password);
        }

        [OneTimeTearDown]
        public void CloseBrowser()
        {
            driver?.Quit();
        }
    }
}
