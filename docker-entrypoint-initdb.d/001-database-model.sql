-- MySQL Script generated by MySQL Workbench
-- Fri Jul 26 18:09:19 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema demodb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema demodb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `demodb` ;
USE `demodb` ;

-- -----------------------------------------------------
-- Table `demodb`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`Users` ;

CREATE TABLE IF NOT EXISTS `demodb`.`Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(1024) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`ProductCategories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`ProductCategories` ;

CREATE TABLE IF NOT EXISTS `demodb`.`ProductCategories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(1024) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`Products`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`Products` ;

CREATE TABLE IF NOT EXISTS `demodb`.`Products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(1024) NOT NULL,
  `description` VARCHAR(5120) NULL,
  `image` VARCHAR(2048) NULL,
  `Category_id` INT NOT NULL,
  `deleted` TINYINT NULL COMMENT 'boolean column, 1=deleted, NULL/0=active',
  `code_filtered_index_workaround` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `id_idx` (`Category_id` ASC) VISIBLE,
  UNIQUE INDEX `code_filtered_index_workaround_UNIQUE` (`code_filtered_index_workaround` ASC) VISIBLE,
  INDEX `deleted_index` (`deleted` ASC) VISIBLE,
  CONSTRAINT `Products_Category_id`
    FOREIGN KEY (`Category_id`)
    REFERENCES `demodb`.`ProductCategories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1000
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`ProductsPrices`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`ProductsPrices` ;

CREATE TABLE IF NOT EXISTS `demodb`.`ProductsPrices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Product_id` INT NOT NULL,
  `date_start` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_end` DATETIME NULL,
  `price` DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `Product_id_idx` (`Product_id` ASC) VISIBLE,
  INDEX `product_date_index` (`Product_id` ASC, `date_start` DESC) VISIBLE,
  CONSTRAINT `ProductsPrices_Product_id`
    FOREIGN KEY (`Product_id`)
    REFERENCES `demodb`.`Products` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`ProductsRatings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`ProductsRatings` ;

CREATE TABLE IF NOT EXISTS `demodb`.`ProductsRatings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Product_id` INT NOT NULL,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rating` TINYINT NULL,
  `rating_count_1` MEDIUMINT NOT NULL DEFAULT 0,
  `rating_count_2` MEDIUMINT NOT NULL DEFAULT 0,
  `rating_count_3` MEDIUMINT NOT NULL DEFAULT 0,
  `rating_count_4` MEDIUMINT NOT NULL DEFAULT 0,
  `rating_count_5` MEDIUMINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `Product_id_idx` (`Product_id` ASC) VISIBLE,
  INDEX `product_date_index` (`Product_id` ASC, `date` DESC) VISIBLE,
  INDEX `rating_index` (`rating` DESC) VISIBLE,
  CONSTRAINT `ProductsRatings_Product_id`
    FOREIGN KEY (`Product_id`)
    REFERENCES `demodb`.`Products` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`ProductsInventory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`ProductsInventory` ;

CREATE TABLE IF NOT EXISTS `demodb`.`ProductsInventory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Product_id` INT NOT NULL,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` MEDIUMINT NOT NULL DEFAULT 0,
  `inventory_status` ENUM('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `Product_id_idx` (`Product_id` ASC) VISIBLE,
  INDEX `date_index` (`date` DESC) VISIBLE,
  INDEX `product_date_index` (`Product_id` ASC, `date` DESC) VISIBLE,
  CONSTRAINT `ProductsInventory_Product_id`
    FOREIGN KEY (`Product_id`)
    REFERENCES `demodb`.`Products` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`DataHistory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`DataHistory` ;

CREATE TABLE IF NOT EXISTS `demodb`.`DataHistory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `before` JSON NULL,
  `after` JSON NOT NULL,
  `database_table` VARCHAR(512) NOT NULL,
  `User_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `Users_id_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `DataHistory_Users_id`
    FOREIGN KEY (`User_id`)
    REFERENCES `demodb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`UsersAuth`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`UsersAuth` ;

CREATE TABLE IF NOT EXISTS `demodb`.`UsersAuth` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `hash` VARCHAR(512) NOT NULL,
  `salt` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `User_id_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `UsersAuth_User_id`
    FOREIGN KEY (`User_id`)
    REFERENCES `demodb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `demodb`.`UsersRoles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demodb`.`UsersRoles` ;

CREATE TABLE IF NOT EXISTS `demodb`.`UsersRoles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `role_name` VARCHAR(1024) NOT NULL,
  `role_code` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `role_code_UNIQUE` (`role_code` ASC) VISIBLE,
  INDEX `User_id_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `UsersRoles_User_id`
    FOREIGN KEY (`User_id`)
    REFERENCES `demodb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

USE `demodb` ;

-- -----------------------------------------------------
-- procedure new_product
-- -----------------------------------------------------

USE `demodb`;
DROP procedure IF EXISTS `demodb`.`new_product`;

DELIMITER $$
USE `demodb`$$
CREATE PROCEDURE `new_product` (
  In _code VARCHAR(255), 
  In _name VARCHAR(1024),
  In _description VARCHAR(5120),
  In _image VARCHAR(2048),
  In _category INT,
  In _price DECIMAL(8,2),
  In _quantity MEDIUMINT,
  In _rating TINYINT,
  Out id INT
  )
BEGIN
START TRANSACTION;
	INSERT INTO Products(code, name, description, Category_id, image, deleted) 
		VALUES(_code, _name, _description, _category, _image, 0);
	SET @newid = LAST_INSERT_ID();
	INSERT INTO ProductsPrices (Product_id, price) 
		VALUES(@newid, _price);
	INSERT INTO ProductsInventory (Product_id, quantity) 
		VALUES (@newid, _quantity);
	INSERT INTO ProductsRatings (Product_id, rating_count_1, rating_count_2, rating_count_3, rating_count_4, rating_count_5 ) 
		VALUES (@newid, 0, 0, 0, 0, 0);
	SELECT @newid as id;
COMMIT;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_product
-- -----------------------------------------------------

USE `demodb`;
DROP procedure IF EXISTS `demodb`.`update_product`;

DELIMITER $$
USE `demodb`$$
CREATE PROCEDURE `update_product` (
  _id INT,
  _code VARCHAR(255), 
  _name VARCHAR(1024),
  _description VARCHAR(5120),
  _image VARCHAR(2048),
  _category INT,
  _price DECIMAL(8,2),
  _quantity MEDIUMINT
  )
BEGIN
START TRANSACTION;
	IF (coalesce(_code,_name,_description, _image, _category) is not null) THEN BEGIN
		UPDATE Products p SET 
			p.code = COALESCE(_code, p.code),
			p.name = COALESCE(_name, p.name), 
			p.description = COALESCE(_description, p.description), 
			p.image = COALESCE(_image, ""), 
			p.Category_id = COALESCE(_category, p.Category_id)
		WHERE p.id = _id;
    END;
    END IF;
    IF (_price is not NULL) THEN BEGIN 
    SET @now = NOW();
	UPDATE ProductsPrices SET date_end = @now WHERE date_start <= @now and date_end IS NULL and Product_id = _id;
    INSERT INTO ProductsPrices (Product_id, date_start, price) VALUES (_id, @now, _price); 
    END; END IF;
    IF (_quantity is not NULL) THEN BEGIN INSERT INTO ProductsInventory (Product_id, quantity) VALUES (_id, _quantity); END; END IF;
COMMIT;
END$$

DELIMITER ;
USE `demodb`;

DELIMITER $$

USE `demodb`$$
DROP TRIGGER IF EXISTS `demodb`.`Products_enforce_unique_active_code_on_insert` $$
USE `demodb`$$
CREATE DEFINER = CURRENT_USER TRIGGER `demodb`.`Products_enforce_unique_active_code_on_insert` BEFORE INSERT ON `Products` FOR EACH ROW
BEGIN
	SET NEW.code_filtered_index_workaround = NEW.code;
END$$


USE `demodb`$$
DROP TRIGGER IF EXISTS `demodb`.`Products_enforce_unique_active_code_on_update` $$
USE `demodb`$$
CREATE DEFINER = CURRENT_USER TRIGGER `demodb`.`Products_enforce_unique_active_code_on_update` BEFORE UPDATE ON `Products` FOR EACH ROW
BEGIN
	SET NEW.code_filtered_index_workaround = 
    CASE
		WHEN coalesce(NEW.deleted,OLD.deleted)=1 
        THEN NULL 
        ELSE NEW.code 
	END;
END$$


USE `demodb`$$
DROP TRIGGER IF EXISTS `demodb`.`ProductsRatings_set_avg_rating_on_insert` $$
USE `demodb`$$
CREATE DEFINER = CURRENT_USER TRIGGER `demodb`.`ProductsRatings_set_avg_rating_on_insert` BEFORE INSERT ON `ProductsRatings` FOR EACH ROW
BEGIN
    SET @DENUM = 
        NEW.rating_count_1 +
        NEW.rating_count_2 +
        NEW.rating_count_3 +
        NEW.rating_count_4 +
        NEW.rating_count_5;
	SET NEW.rating = CASE 
			WHEN @DENUM = 0
			THEN 0
			ELSE ROUND(
				(
					NEW.rating_count_1 +
					(2 * NEW.rating_count_2) +
					(3 * NEW.rating_count_3) +
					(4 * NEW.rating_count_4) +
					(5 * NEW.rating_count_5)
				) 
                / @DENUM
			)
    END;
END$$


USE `demodb`$$
DROP TRIGGER IF EXISTS `demodb`.`ProductsInventory_set_status_on_insert` $$
USE `demodb`$$
CREATE DEFINER = CURRENT_USER TRIGGER `demodb`.`ProductsInventory_set_status_on_insert` BEFORE INSERT ON `ProductsInventory` FOR EACH ROW
BEGIN
	IF NEW.quantity < 1 THEN 
    SET NEW.inventory_status = 'OUTOFSTOCK';
    ELSEIF NEW.quantity < 10 THEN
    SET NEW.inventory_status = 'LOWSTOCK';
    ELSE
    SET NEW.inventory_status = 'INSTOCK';
    END IF;
END$$


DELIMITER ;
SET SQL_MODE = '';
GRANT USAGE ON *.* TO demouser;
 DROP USER demouser;
SET SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE USER 'demouser' IDENTIFIED BY 'demopswd';

GRANT ALL ON `demodb`.* TO 'demouser';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
