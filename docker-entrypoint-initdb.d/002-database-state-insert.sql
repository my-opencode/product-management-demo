INSERT INTO ProductCategories (id, name) VALUES 
(1, "Accessories"),
(2, "Fitness"),
(3, "Clothing"),
(4, "Electronics");

INSERT INTO Products (id, code, name, description, image, Category_id, deleted ) VALUES 
(1,"f230fh0g3","Bamboo Watch","Product Description", "bamboo-watch.jpg", 1, 0),
(2,"nvklal433","Black Watch","Product Description", "black-watch.jpg", 1, 0),
(3,"zz21cz3c1","Blue Band","Product Description", "blue-band.jpg", 2, 0),
(4,"244wgerg2","Blue T-Shirt","Product Description", "blue-t-shirt.jpg", 3, 0),
(5,"h456wer53","Bracelet","Product Description", "bracelet.jpg", 1, 0),
(6,"av2231fwg","Brown Purse","Product Description", "brown-purse.jpg", 1, 0),
(7,"bib36pfvm","Chakra Bracelet","Product Description", "chakra-bracelet.jpg", 1, 0),
(8,"mbvjkgip5","Galaxy Earrings","Product Description", "galaxy-earrings.jpg", 1, 0),
(9,"vbb124btr","Game Controller","Product Description", "game-controller.jpg", 4, 0),
(10,"cm230f032","Gaming Set","Product Description", "gaming-set.jpg", 4, 0),
(11,"plb34234v","Gold Phone Case","Product Description", "gold-phone-case.jpg", 1, 0),
(12,"4920nnc2d","Green Earbuds","Product Description", "green-earbuds.jpg", 4, 0),
(13,"250vm23cc","Green T-Shirt","Product Description", "green-t-shirt.jpg", 3, 0),
(14,"fldsmn31b","Grey T-Shirt","Product Description", "grey-t-shirt.jpg", 3, 0),
(15,"waas1x2as","Headphones","Product Description", "headphones.jpg", 4, 0),
(16,"vb34btbg5","Light Green T-Shirt","Product Description", "light-green-t-shirt.jpg", 3, 0),
(17,"k8l6j58jl","Lime Band","Product Description", "lime-band.jpg", 2, 0),
(18,"v435nn85n","Mini Speakers","Product Description", "mini-speakers.jpg", 3, 0),
(19,"09zx9c0zc","Painted Phone Case","Product Description", "painted-phone-case.jpg", 1, 0),
(20,"mnb5mb2m5","Pink Band","Product Description", "pink-band.jpg", 2, 0),
(21,"r23fwf2w3","Pink Purse","Product Description", "pink-purse.jpg", 1, 0),
(22,"pxpzczo23","Purple Band","Product Description", "purple-band.jpg", 2, 0),
(23,"2c42cb5cb","Purple Gemstone Necklace","Product Description", "purple-gemstone-necklace.jpg", 1, 0),
(24,"5k43kkk23","Purple T-Shirt","Product Description", "purple-t-shirt.jpg", 3, 0),
(25,"lm2tny2k4","Shoes","Product Description", "shoes.jpg", 3, 0),
(26,"nbm5mv45n","Sneakers","Product Description", "sneakers.jpg", 3, 0),
(27,"zx23zc42c","Teal T-Shirt","Product Description", "teal-t-shirt.jpg", 3, 0),
(28,"acvx872gc","Yellow Earbuds","Product Description", "yellow-earbuds.jpg", 4, 0),
(29,"tx125ck42","Yoga Mat","Product Description", "yoga-mat.jpg", 2, 0),
(30,"gwuby345v","Yoga Set","Product Description", "yoga-set.jpg", 2, 0);

INSERT INTO ProductsPrices (Product_id, date_start, date_end, price ) VALUES 
(1,"2024-07-16 00:16:22",NULL, "65"),
(2,"2024-07-16 00:16:22",NULL, "72"),
(3,"2024-07-16 00:16:22",NULL, "79"),
(4,"2024-07-16 00:16:22",NULL, "29"),
(5,"2024-07-16 00:16:22",NULL, "15"),
(6,"2024-07-16 00:16:22",NULL, "120"),
(7,"2024-07-16 00:16:22",NULL, "32"),
(8,"2024-07-16 00:16:22",NULL, "34"),
(9,"2024-07-16 00:16:22",NULL, "99"),
(10,"2024-07-16 00:16:22",NULL, "299"),
(11,"2024-07-16 00:16:22",NULL, "24"),
(12,"2024-07-16 00:16:22",NULL, "89"),
(13,"2024-07-16 00:16:22",NULL, "49"),
(14,"2024-07-16 00:16:22",NULL, "48"),
(15,"2024-07-16 00:16:22",NULL, "175"),
(16,"2024-07-16 00:16:22",NULL, "49"),
(17,"2024-07-16 00:16:22",NULL, "79"),
(18,"2024-07-16 00:16:22",NULL, "85"),
(19,"2024-07-16 00:16:22",NULL, "56"),
(20,"2024-07-16 00:16:22",NULL, "79"),
(21,"2024-07-16 00:16:22",NULL, "110"),
(22,"2024-07-16 00:16:22",NULL, "79"),
(23,"2024-07-16 00:16:22",NULL, "45"),
(24,"2024-07-16 00:16:22",NULL, "49"),
(25,"2024-07-16 00:16:22",NULL, "64"),
(26,"2024-07-16 00:16:22",NULL, "78"),
(27,"2024-07-16 00:16:22",NULL, "49"),
(28,"2024-07-16 00:16:22",NULL, "89"),
(29,"2024-07-16 00:16:22",NULL, "20"),
(30,"2024-07-16 00:16:22",NULL, "20");

INSERT INTO ProductsRatings (Product_id, date, rating, rating_count_0, rating_count_1, rating_count_2, rating_count_3, rating_count_4, rating_count_5 ) VALUES 
(1,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(2,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(3,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(4,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(5,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(6,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(7,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(8,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(9,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(10,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(11,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(12,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(13,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(14,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(15,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(16,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(17,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(18,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(19,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(20,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(21,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(22,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(23,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(24,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(25,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(26,"2024-07-16 00:16:22",4, 0, 0, 0, 0, 1, 0),
(27,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(28,"2024-07-16 00:16:22",3, 0, 0, 0, 1, 0, 0),
(29,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 1),
(30,"2024-07-16 00:16:22",5, 0, 0, 0, 0, 0, 0);

INSERT INTO ProductsInventory (Product_id, date, quantity) VALUES 
(1,"2024-07-16 00:16:22",24),
(2,"2024-07-16 00:16:22",61),
(3,"2024-07-16 00:16:22",2),
(4,"2024-07-16 00:16:22",25),
(5,"2024-07-16 00:16:22",73),
(6,"2024-07-16 00:16:22",0),
(7,"2024-07-16 00:16:22",5),
(8,"2024-07-16 00:16:22",23),
(9,"2024-07-16 00:16:22",2),
(10,"2024-07-16 00:16:22",63),
(11,"2024-07-16 00:16:22",0),
(12,"2024-07-16 00:16:22",23),
(13,"2024-07-16 00:16:22",74),
(14,"2024-07-16 00:16:22",0),
(15,"2024-07-16 00:16:22",8),
(16,"2024-07-16 00:16:22",34),
(17,"2024-07-16 00:16:22",12),
(18,"2024-07-16 00:16:22",42),
(19,"2024-07-16 00:16:22",41),
(20,"2024-07-16 00:16:22",63),
(21,"2024-07-16 00:16:22",0),
(22,"2024-07-16 00:16:22",6),
(23,"2024-07-16 00:16:22",62),
(24,"2024-07-16 00:16:22",2),
(25,"2024-07-16 00:16:22",0),
(26,"2024-07-16 00:16:22",52),
(27,"2024-07-16 00:16:22",3),
(28,"2024-07-16 00:16:22",35),
(29,"2024-07-16 00:16:22",15),
(30,"2024-07-16 00:16:22",25);

