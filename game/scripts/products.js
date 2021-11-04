const product0 = new Product(0, "RDS", amazonServer, 1299, [1, 1])
const product1 = new Product(1, "Azure DB", azureServer, 2999, [1, 1])
const product2 = new Product(2, "Firebase", firebaseServer, 599, [1, 1])

const product3 = new Developer(3, "John", developer1, 30000, [3, 2], ['Python', 'Javascript'], 5000)
const product4 = new Developer(4, "Isabella", developer2, 15000, [3, 2], ['SQL', 'ReactJS'], 3000)
const product5 = new Developer(5, "Andrew", developer3, 20000, [3, 2], ['C++', 'ASP'], 2500)
const product6 = new Developer(6, "Bobby", developer4, 75000, [3, 2], ['Scala', 'Java'], 10000)
const product7 = new Developer(7, "Jade", developer5, 56000, [3, 2], ['AWS'], 5000)
const product8 = new Developer(8, "Chris", developer6, 59000, [3, 2], ['Javascript'], 8000)

const product9 = new Product(9, "Cafe", cafeImage, 45000, [3, 3])
const product10 = new Product(10, "Board Room", bordRoomImage, 25000, [3, 2])

const PRODUCT_LIST = [product0, product1, product2, product3, product4, product5, product6, product7, product8, product9, product10]