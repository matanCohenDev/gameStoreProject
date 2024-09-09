using OpenQA.Selenium;
using NUnit.Framework;
using MongoDB.Driver;
using MongoDB.Bson;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace Tests
{
    [TestFixture]
    public class CrudProduct : LoginAndRegisterTest
    {    //inheritance from the LoginAndRegisterTests
        private IMongoCollection<BsonDocument> productsCollection = null!;
        //start browser with product collection
        [SetUp]
        public new void StartBrowser()
        {
            base.StartBrowser();
            productsCollection = db.GetCollection<BsonDocument>("products");
        }
        //the ignore in the LoginAndRegisterTests make no duplicate tests cause the inheritance
        [Test]
        public new void TestRegisterAndCheckDB()
        {
            base.TestRegisterAndCheckDB();
        }
        //create product test
        [Test , Order(1)]
        public void CreateProductAdmin()
        {
            base.TestLoginAdmin("admin", "1234");

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("productsBtn"))).Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("createProductBtn"))).Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("productModal")));
            driver.FindElement(By.Id("productName")).SendKeys("test");
            driver.FindElement(By.Id("productPrice")).SendKeys("10");
            driver.FindElement(By.Id("productDescription")).SendKeys("test description");
            driver.FindElement(By.Id("productCategory")).SendKeys("category");
            string currentDateTime = DateTime.Now.ToString("yyyy-MM-ddTHH:mm");
            driver.FindElement(By.Id("productCreatedAt")).SendKeys(currentDateTime);
            driver.FindElement(By.Id("AddProduct")).Click();
            var filter = Builders<BsonDocument>.Filter.Eq("name", "test");
            var createdProduct = productsCollection.Find(filter).FirstOrDefault();
            Assert.That(createdProduct["name"].AsString, Is.EqualTo("test"));
        }
        //update product price test
        [Test , Order(2)]
        public void UpdateProductAdmin()
        {
            base.TestLoginAdmin("admin", "1234");
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("productsBtn"))).Click();
            var row = driver.FindElement(By.XPath("//tr[td[contains(text(), 'test')]]"));
            row.Click();
            driver.FindElement(By.Id("updateProductBtn")).Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("updateProdactModal")));
            var priceField = driver.FindElement(By.Id("productPriceUpdate"));
            priceField.Clear();
            priceField.SendKeys("20");
            driver.FindElement(By.Id("UpdateProductBtnComplete")).Click();
            System.Threading.Thread.Sleep(1000);
            var filter = Builders<BsonDocument>.Filter.Eq("name", "test");
            var updatedProduct = productsCollection.Find(filter).FirstOrDefault();
            double price;
            if (updatedProduct["price"].IsInt32)
                price = updatedProduct["price"].AsInt32;
            else
                price = updatedProduct["price"].AsDouble;
            Assert.That(price, Is.EqualTo(20));
        }
        //delete the same product 
        [Test , Order(3)]
        public void DeleteProductAdmin()
        {
            base.TestLoginAdmin("admin", "1234");
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementToBeClickable(By.Id("productsBtn"))).Click();
            var row = driver.FindElement(By.XPath("//tr[td[contains(text(), 'test')]]"));
            row.Click();
            driver.FindElement(By.Id("deleteProductBtn")).Click();
            wait.Until(ExpectedConditions.ElementIsVisible(By.Id("DeleteProdactModal")));
            driver.FindElement(By.Id("deleteOk")).Click();
            var filter = Builders<BsonDocument>.Filter.Eq("name", "test");
            var deletedProduct = productsCollection.Find(filter).FirstOrDefault();
            Assert.That(deletedProduct, Is.Null);
        }
        //quit chrome
        [TearDown]
        public new void CloseBrowser()
        {
            base.CloseBrowser();
        }
    }
}
