using System;

public class NameGenerator
{
    private static readonly string[] PrivateNames = new string[]
    {
        "Liam", "Emma", "Noah", "Olivia", "Oliver", "Ava", "Elijah", "Sophia",
        "James", "Isabella", "William", "Mia", "Benjamin", "Amelia", "Lucas",
        "Harper", "Henry", "Evelyn", "Alexander", "Abigail", "Jackson", "Ella",
        "Sebastian", "Scarlett", "Mateo", "Grace", "David", "Chloe", "Joseph",
        "Camila", "Samuel", "Aria", "Michael", "Madison", "Carter", "Luna",
        "Wyatt", "Sofia", "John", "Avery", "Jack", "Riley", "Owen", "Addison",
        "Luke", "Ellie", "Asher", "Nora", "Leo", "Hannah", "Isaiah", "Lily",
        "Gabriel", "Zoe", "Anthony", "Stella", "Dylan", "Aurora", "Jaxon",
        "Natalie", "Ezra", "Savannah", "Thomas", "Leah", "Charles", "Skylar",
        "Christopher", "Mila", "Maverick", "Lucy", "Josiah", "Paisley",
        "Isaac", "Everly", "Andrew", "Anna", "Eli", "Bella", "Aaron", "Clara",
        "Angel", "Sophie", "Nathan", "Lydia", "Adrian", "Allison", "Hunter",
        "Katherine", "Jeremiah", "Aubrey", "Jordan", "Willow", "Brody",
        "Brielle", "Robert", "Autumn", "Dominic", "Emery", "Adam", "Violet",
        "Caleb", "Madelyn", "Ian", "Piper", "Weston", "Kinsley", "Jonathan",
        "Bailey", "Nicolas", "Rylee", "Zachary", "Kylie", "Evan", "Ariana",
        "Brian", "Cora", "Landon", "Peyton", "Kevin", "Harley", "Derek",
        "Genesis", "Silas", "Ximena", "Hugo", "Parker", "Gavin", "Jade",
        "Alex", "Melanie", "Kaden", "Tessa", "Ryder", "Daisy", "Felix", 
        "Camden", "Alexis", "Luca", "Valentina", "Santiago", "Lila", 
        "Colton", "Samantha", "Bennett", "Marley", "Jonas", "Callie", 
        "Cyrus", "Alyssa", "Harrison", "Ivy", "Milo", "Finley", "Theo",
        "June", "Ezra", "Rory", "Angela", "Maddox", "Paige", "Nash",
        "Serenity", "Wesley", "Megan", "Emmett", "Reagan", "Sawyer",
        "Amara", "Kameron", "Emiliano", "Juliana", "Ayla", "Raelynn",
        "Dante", "Delilah", "Kingston", "Sophie", "Cohen", "Lyric", 
        "Matteo", "Ember", "Maddox", "Sabrina", "Axton", "Lennon", 
        "Colby", "Julianna", "Trent", "Elena", "Jett", "Nola", 
        "Kian", "Frances", "Apollo", "Haven", "Paxton", "Lainey",
        "Tobias", "Rory", "Lance", "Adalynn", "Kamryn", "Murphy", 
        "Finn", "Lyra", "Quinn", "Rowan", "Cali", "Cleo", 
        "Zane", "Talon", "Marina", "Sage", "Sterling", "Giselle",
        "Rory", "Wren", "Addie", "Gideon", "Iris", "Brady"
    };

    private static readonly Random Random = new Random();

    public static string GetRandomName()
    {
        return PrivateNames[Random.Next(PrivateNames.Length)];
    }

    public static string GetRandomEmail()
    {
        return $"{GetRandomName().ToLower()}@example.com";
    }
}
