CREATE TABLE if not exists `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` longtext NOT NULL,
  `f_name` varchar(255) DEFAULT NULL,
  `l_name` varchar(255) DEFAULT NULL,
  `c_description` longtext,
  `call_number` int(11) DEFAULT NULL,
  `c_street` text,
  `c_zip` int(11) DEFAULT NULL,
  `c_town` text,
  `c_country` text,
  `c_since` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `birthday` date DEFAULT NULL,
  `ppath` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

CREATE TABLE if not exists `offer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `o_title` varchar(255) NOT NULL,
  `o_description` longtext,
  `price` double NOT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `o_since` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_idx` (`seller_id`),
  CONSTRAINT `id` FOREIGN KEY (`seller_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

CREATE TABLE if not exists `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `g_title` varchar(255) DEFAULT NULL,
  `g_description` longtext,
  `path` longtext NOT NULL,
  `offer_id` int(11) DEFAULT NULL,
  `g_since` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `gallery_ibfk_1_idx` (`offer_id`),
  CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `offer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE if not exists `command` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` longtext,
  `offer_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `since` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `command_ibfk_1` (`offer_id`),
  CONSTRAINT `command_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `offer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `command_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;