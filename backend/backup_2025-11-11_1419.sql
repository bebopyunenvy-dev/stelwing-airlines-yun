-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: stelwing
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `stelwing`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `stelwing` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `stelwing`;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0193f596-c259-47d3-b4b9-ee66fe352939','68c5ff9dfcb4d2bf522a766d5cd16ef65628a6ca31aad8c02fe72231e4a26ff1','2025-11-07 03:39:03.533','20251104055337_baron',NULL,NULL,'2025-11-07 03:39:03.482',1),('1f17bc74-180c-4e77-af06-48ca077a4880','13ad5a2607df74223604af0d14060e11f7879e83c49557a2c1c1fc2d3e49d0a1','2025-11-07 03:39:29.911','20251107033929_add_member_booking_bookingdetail_fixed',NULL,NULL,'2025-11-07 03:39:29.865',1),('6a965bd3-e5b3-43b3-878b-89aebd6862f0','f3a87a2fa913f962551d25f316c08ab98d1bc3c2f69200894ae6fad071b25ae0','2025-11-07 03:39:03.479','20251030034347_add_timezone',NULL,NULL,'2025-11-07 03:39:03.471',1),('960f58dd-d105-4012-83b9-37c6f4f25a21','9d19986a5963e6f0ad27d424630e3a22baf0cb7ea3db34717eb67ab9debe43dd','2025-11-07 05:38:58.590','20251107053858_add_option_tables_and_update_bookingdetail',NULL,NULL,'2025-11-07 05:38:58.497',1),('c7051a28-7290-4988-b5dc-7382c2f97801','5d2dbaa658a3cc812a5d086fe62016acb14702f50ebc0876054630cece98dab5','2025-11-07 03:39:03.463','20251026083242_init',NULL,NULL,'2025-11-07 03:39:03.458',1),('d7a64909-4678-46b9-ab47-e00601bcc419','b051b8a3fb6b3ded99112ba926e403e675c49bb102518acadd5b6b51d6243bfa','2025-11-07 03:39:03.470','20251029072845_create_plan_table',NULL,NULL,'2025-11-07 03:39:03.463',1),('d815fc50-f3d3-43f8-a56f-27f5c92419be','68c5ff9dfcb4d2bf522a766d5cd16ef65628a6ca31aad8c02fe72231e4a26ff1',NULL,'20251103152447_add_baron_table','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251103152447_add_baron_table\n\nDatabase error code: 1050\n\nDatabase error:\nTable \'countries\' already exists\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20251103152447_add_baron_table\"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20251103152447_add_baron_table\"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260',NULL,'2025-11-11 02:53:13.389',0),('dbc0e4d4-7d56-409e-adeb-8681f0a26c6c','28c093bc3170788e6dff3ce62e468805a6727bf11f37839404d5851e1fdbe2e2','2025-11-07 03:43:17.280','20251107034317_change_total_amount_to_int',NULL,NULL,'2025-11-07 03:43:17.269',1),('e5b0b3f1-914d-4afa-a357-5dd08ef3b157','21d3b3586e51d11b444bc7aff2a280472e87feadd9165ab094f18ce53d7591df','2025-11-07 03:39:03.482','20251030065359_add_default_time',NULL,NULL,'2025-11-07 03:39:03.479',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airports` (
  `airport_id` bigint NOT NULL AUTO_INCREMENT,
  `airport_code` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `airport_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_id` bigint NOT NULL,
  PRIMARY KEY (`airport_id`),
  UNIQUE KEY `airports_airport_code_key` (`airport_code`),
  KEY `airports_city_id_fkey` (`city_id`),
  CONSTRAINT `airports_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES (1,'TPE','Taiwan Taoyuan International Airport',1),(2,'NRT','Narita International Airport',2);
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baggage_options`
--

DROP TABLE IF EXISTS `baggage_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baggage_options` (
  `baggage_id` bigint NOT NULL AUTO_INCREMENT,
  `weight_kg` int NOT NULL,
  `fee` int NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TWD',
  PRIMARY KEY (`baggage_id`),
  UNIQUE KEY `baggage_options_weight_kg_currency_key` (`weight_kg`,`currency`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baggage_options`
--

LOCK TABLES `baggage_options` WRITE;
/*!40000 ALTER TABLE `baggage_options` DISABLE KEYS */;
INSERT INTO `baggage_options` VALUES (1,15,0,'TWD'),(2,20,0,'TWD'),(3,30,900,'TWD');
/*!40000 ALTER TABLE `baggage_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_details`
--

DROP TABLE IF EXISTS `booking_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_details` (
  `detail_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `flight_id` bigint NOT NULL,
  `trip_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `baggage_id` bigint DEFAULT NULL,
  `meal_id` bigint DEFAULT NULL,
  `seat_id` bigint DEFAULT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `booking_details_booking_id_idx` (`booking_id`),
  KEY `booking_details_flight_id_idx` (`flight_id`),
  KEY `booking_details_seat_id_idx` (`seat_id`),
  KEY `booking_details_meal_id_idx` (`meal_id`),
  KEY `booking_details_baggage_id_idx` (`baggage_id`),
  CONSTRAINT `booking_details_baggage_id_fkey` FOREIGN KEY (`baggage_id`) REFERENCES `baggage_options` (`baggage_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booking_details_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booking_details_flight_id_fkey` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `booking_details_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal_options` (`meal_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booking_details_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `seat_options` (`seat_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_details`
--

LOCK TABLES `booking_details` WRITE;
/*!40000 ALTER TABLE `booking_details` DISABLE KEYS */;
INSERT INTO `booking_details` VALUES (1,2,3,'outbound','2025-11-09 11:44:41.102',NULL,NULL,NULL),(2,2,8,'inbound','2025-11-09 11:44:41.112',NULL,NULL,NULL),(3,3,3,'outbound','2025-11-09 11:57:47.617',NULL,NULL,NULL),(4,3,8,'inbound','2025-11-09 11:57:47.620',NULL,NULL,NULL),(5,4,3,'outbound','2025-11-09 13:09:14.279',NULL,NULL,NULL),(6,4,8,'inbound','2025-11-09 13:09:14.283',NULL,NULL,NULL),(7,5,3,'outbound','2025-11-09 13:09:44.785',NULL,NULL,NULL),(8,5,8,'inbound','2025-11-09 13:09:44.788',NULL,NULL,NULL),(9,6,3,'outbound','2025-11-09 13:10:18.100',NULL,NULL,NULL),(10,6,8,'inbound','2025-11-09 13:10:18.103',NULL,NULL,NULL),(11,7,3,'outbound','2025-11-09 13:13:52.258',NULL,NULL,NULL),(12,7,8,'inbound','2025-11-09 13:13:52.260',NULL,NULL,NULL),(13,8,3,'outbound','2025-11-09 13:35:26.652',NULL,NULL,NULL),(14,8,8,'inbound','2025-11-09 13:35:26.656',NULL,NULL,NULL),(15,9,3,'outbound','2025-11-09 13:39:18.403',NULL,NULL,NULL),(16,9,8,'inbound','2025-11-09 13:39:18.407',NULL,NULL,NULL),(17,10,3,'outbound','2025-11-09 13:39:39.767',NULL,NULL,NULL),(18,10,8,'inbound','2025-11-09 13:39:39.770',NULL,NULL,NULL),(19,11,3,'outbound','2025-11-09 13:47:19.008',NULL,NULL,NULL),(20,11,8,'inbound','2025-11-09 13:47:19.011',NULL,NULL,NULL),(21,12,3,'outbound','2025-11-09 13:51:25.799',NULL,NULL,NULL),(22,12,8,'inbound','2025-11-09 13:51:25.806',NULL,NULL,NULL),(23,13,3,'outbound','2025-11-09 13:52:59.136',NULL,NULL,NULL),(24,13,8,'inbound','2025-11-09 13:52:59.139',NULL,NULL,NULL),(25,14,3,'outbound','2025-11-09 14:04:41.659',NULL,NULL,NULL),(26,14,8,'inbound','2025-11-09 14:04:41.662',NULL,NULL,NULL),(27,15,3,'outbound','2025-11-09 14:05:01.948',NULL,NULL,NULL),(28,15,8,'inbound','2025-11-09 14:05:01.950',NULL,NULL,NULL),(29,16,3,'outbound','2025-11-09 14:30:28.687',3,2,NULL),(30,16,8,'inbound','2025-11-09 14:30:28.690',NULL,2,NULL),(31,17,3,'outbound','2025-11-09 14:37:51.907',2,5,NULL),(32,17,8,'inbound','2025-11-09 14:37:51.911',2,2,NULL);
/*!40000 ALTER TABLE `booking_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` bigint NOT NULL AUTO_INCREMENT,
  `pnr` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` bigint DEFAULT NULL,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passport_no` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cabin_class` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` int NOT NULL,
  `payment_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `bookings_pnr_key` (`pnr`),
  KEY `bookings_member_id_fkey` (`member_id`),
  CONSTRAINT `bookings_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (2,'JYY73Q',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 11:44:41.087'),(3,'DSU77T',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 11:57:47.610'),(4,'J8FQEK',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:09:14.267'),(5,'YJFSYT',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:09:44.776'),(6,'Q2SCAL',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:10:18.097'),(7,'5TUFYU',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:13:52.255'),(8,'EKFBCZ',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:35:26.645'),(9,'T3S6FU',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:39:18.397'),(10,'7GHMRQ',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:39:39.761'),(11,'S4AQP3',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:47:19.003'),(12,'9N298B',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:51:25.789'),(13,'C9YX8R',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 13:52:59.130'),(14,'88N2SN',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 14:04:41.645'),(15,'K2GFAY',NULL,'cccc','lllll','M','TW','45454545545','經濟艙','TWD',19998,'pending','2025-11-09 14:05:01.943'),(16,'Z2HSN6',NULL,'ddddd','jjjjjjj','M','TW','dddddd','經濟艙','TWD',19998,'pending','2025-11-09 14:30:28.676'),(17,'KXRVG2',NULL,'ddddd','jjjjjjj','M','TW','dddddd','經濟艙','TWD',19998,'pending','2025-11-09 14:37:51.902');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `city_id` bigint NOT NULL AUTO_INCREMENT,
  `city_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_id` bigint NOT NULL,
  PRIMARY KEY (`city_id`),
  KEY `cities_country_id_fkey` (`country_id`),
  CONSTRAINT `cities_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'Taipei',1),(2,'Tokyo',2);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `country_id` bigint NOT NULL AUTO_INCREMENT,
  `country_code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`country_id`),
  UNIQUE KEY `countries_country_code_key` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'TW','Taiwan'),(2,'JP','Japan');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `flight_id` bigint NOT NULL AUTO_INCREMENT,
  `flight_number` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flight_date` date NOT NULL,
  `origin_iata` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_iata` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dep_time_utc` datetime(3) DEFAULT NULL,
  `arr_time_utc` datetime(3) DEFAULT NULL,
  `status` enum('SCHEDULED','CANCELED') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`flight_id`),
  KEY `flights_origin_iata_fkey` (`origin_iata`),
  KEY `flights_destination_iata_fkey` (`destination_iata`),
  CONSTRAINT `flights_destination_iata_fkey` FOREIGN KEY (`destination_iata`) REFERENCES `airports` (`airport_code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `flights_origin_iata_fkey` FOREIGN KEY (`origin_iata`) REFERENCES `airports` (`airport_code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES (3,'JW321','2025-12-08','TPE','NRT','2025-12-08 01:00:00.000','2025-12-08 04:30:00.000','SCHEDULED'),(4,'JW322','2025-12-08','NRT','TPE','2025-12-08 07:00:00.000','2025-12-08 10:30:00.000','SCHEDULED'),(5,'JW323','2025-12-09','TPE','NRT','2025-12-09 01:30:00.000','2025-12-09 05:00:00.000','SCHEDULED'),(6,'JW324','2025-12-09','NRT','TPE','2025-12-09 06:30:00.000','2025-12-09 10:00:00.000','SCHEDULED'),(7,'JW325','2025-12-15','TPE','NRT','2025-12-15 01:00:00.000','2025-12-15 04:30:00.000','SCHEDULED'),(8,'JW326','2025-12-15','NRT','TPE','2025-12-15 07:00:00.000','2025-12-15 10:30:00.000','SCHEDULED'),(9,'JW331','2025-12-08','TPE','NRT','2025-12-08 02:00:00.000','2025-12-08 05:30:00.000','SCHEDULED'),(10,'JW332','2025-12-08','NRT','TPE','2025-12-08 08:30:00.000','2025-12-08 12:00:00.000','SCHEDULED'),(11,'JW327','2025-12-15','TPE','NRT','2025-12-15 02:00:00.000','2025-12-15 05:30:00.000','SCHEDULED'),(12,'JW328','2025-12-15','NRT','TPE','2025-12-15 08:30:00.000','2025-12-15 12:00:00.000','SCHEDULED');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_options`
--

DROP TABLE IF EXISTS `meal_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_options` (
  `meal_id` bigint NOT NULL AUTO_INCREMENT,
  `meal_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meal_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meal_type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meal_fee` int NOT NULL DEFAULT '0',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TWD',
  `meal_image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`meal_id`),
  UNIQUE KEY `meal_options_meal_code_key` (`meal_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_options`
--

LOCK TABLES `meal_options` WRITE;
/*!40000 ALTER TABLE `meal_options` DISABLE KEYS */;
INSERT INTO `meal_options` VALUES (1,'VGML','純素餐（Vegan）','vegan',0,'TWD','meals/vgml.png'),(2,'AVML','亞洲素餐（Asian Veg）','vegetarian',0,'TWD','meals/avml.png'),(3,'GFML','無麩質餐（Gluten-Free）','gluten_free',0,'TWD','meals/gfml.png'),(4,'KSML','猶太餐（Kosher）','kosher',0,'TWD','meals/ksml.png'),(5,'HNML','印度餐（Hindu Non-Veg）','hindu',0,'TWD','meals/hnml.png'),(6,'CHML','兒童餐（Child Meal）','child',0,'TWD','meals/chml.png');
/*!40000 ALTER TABLE `meal_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `member_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_date` datetime(3) DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_id` bigint DEFAULT NULL,
  `level` enum('basic','silver','gold','vip') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'basic',
  `points` int NOT NULL DEFAULT '0',
  `register_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_login` datetime(3) DEFAULT NULL,
  `status` enum('active','suspended','deleted') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `remark` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `members_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `end_timezone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_timezone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
INSERT INTO `plan` VALUES (1,2,'dddd','ddddd','2025-12-30 06:13:00.000','2025-12-30 06:13:00.000','','',0,'2025-11-10 09:26:24.440','2025-11-10 09:26:24.440','Asia/Taipei','Asia/Taipei');
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat_options`
--

DROP TABLE IF EXISTS `seat_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_options` (
  `seat_id` bigint NOT NULL AUTO_INCREMENT,
  `flight_id` bigint NOT NULL,
  `seat_number` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cabin_class` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `seat_fee` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`seat_id`),
  UNIQUE KEY `seat_options_flight_id_seat_number_key` (`flight_id`,`seat_number`),
  CONSTRAINT `seat_options_flight_id_fkey` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_options`
--

LOCK TABLES `seat_options` WRITE;
/*!40000 ALTER TABLE `seat_options` DISABLE KEYS */;
INSERT INTO `seat_options` VALUES (1,3,'1A','business',0,0),(2,3,'1B','business',0,0),(3,3,'1C','business',0,0),(4,3,'1D','business',0,0),(5,3,'2A','business',0,0),(6,3,'2B','business',0,0),(7,3,'2C','business',0,0),(8,3,'2D','business',0,0),(9,3,'3A','business',0,0),(10,3,'3B','business',0,0),(11,3,'3C','business',0,0),(12,3,'3D','business',0,0),(13,3,'4A','business',0,0),(14,3,'4B','business',0,0),(15,3,'4C','business',0,0),(16,3,'4D','business',0,0),(17,3,'5A','business',0,0),(18,3,'5B','business',0,0),(19,3,'5C','business',0,0),(20,3,'5D','business',0,0),(21,3,'6A','economy',1,0),(22,3,'6B','economy',1,0),(23,3,'6C','economy',1,0),(24,3,'6D','economy',1,0),(25,3,'7A','economy',1,0),(26,3,'7B','economy',1,0),(27,3,'7C','economy',1,0),(28,3,'7D','economy',1,0),(29,3,'8A','economy',1,0),(30,3,'8B','economy',1,0),(31,3,'8C','economy',1,0),(32,3,'8D','economy',1,0),(33,3,'9A','economy',1,0),(34,3,'9B','economy',1,0),(35,3,'9C','economy',1,0),(36,3,'9D','economy',1,0),(37,3,'10A','economy',1,0),(38,3,'10B','economy',1,0),(39,3,'10C','economy',1,0),(40,3,'10D','economy',1,0),(41,3,'11A','economy',1,0),(42,3,'11B','economy',1,0),(43,3,'11C','economy',1,0),(44,3,'11D','economy',1,0),(45,3,'12A','economy',1,0),(46,3,'12B','economy',1,0),(47,3,'12C','economy',1,0),(48,3,'12D','economy',1,0),(49,3,'13A','economy',1,0),(50,3,'13B','economy',1,0),(51,3,'13C','economy',1,0),(52,3,'13D','economy',1,0),(53,3,'14A','economy',1,0),(54,3,'14B','economy',1,0),(55,3,'14C','economy',1,0),(56,3,'14D','economy',1,0),(57,3,'15A','economy',1,0),(58,3,'15B','economy',1,0),(59,3,'15C','economy',1,0),(60,3,'15D','economy',1,0),(61,8,'1A','business',0,0),(62,8,'1B','business',0,0),(63,8,'1C','business',0,0),(64,8,'1D','business',0,0),(65,8,'2A','business',0,0),(66,8,'2B','business',0,0),(67,8,'2C','business',0,0),(68,8,'2D','business',0,0),(69,8,'3A','business',0,0),(70,8,'3B','business',0,0),(71,8,'3C','business',0,0),(72,8,'3D','business',0,0),(73,8,'4A','business',0,0),(74,8,'4B','business',0,0),(75,8,'4C','business',0,0),(76,8,'4D','business',0,0),(77,8,'5A','business',0,0),(78,8,'5B','business',0,0),(79,8,'5C','business',0,0),(80,8,'5D','business',0,0),(81,8,'6A','economy',1,0),(82,8,'6B','economy',1,0),(83,8,'6C','economy',1,0),(84,8,'6D','economy',1,0),(85,8,'7A','economy',1,0),(86,8,'7B','economy',1,0),(87,8,'7C','economy',1,0),(88,8,'7D','economy',1,0),(89,8,'8A','economy',1,0),(90,8,'8B','economy',1,0),(91,8,'8C','economy',1,0),(92,8,'8D','economy',1,0),(93,8,'9A','economy',1,0),(94,8,'9B','economy',1,0),(95,8,'9C','economy',1,0),(96,8,'9D','economy',1,0),(97,8,'10A','economy',1,0),(98,8,'10B','economy',1,0),(99,8,'10C','economy',1,0),(100,8,'10D','economy',1,0),(101,8,'11A','economy',1,0),(102,8,'11B','economy',1,0),(103,8,'11C','economy',1,0),(104,8,'11D','economy',1,0),(105,8,'12A','economy',1,0),(106,8,'12B','economy',1,0),(107,8,'12C','economy',1,0),(108,8,'12D','economy',1,0),(109,8,'13A','economy',1,0),(110,8,'13B','economy',1,0),(111,8,'13C','economy',1,0),(112,8,'13D','economy',1,0),(113,8,'14A','economy',1,0),(114,8,'14B','economy',1,0),(115,8,'14C','economy',1,0),(116,8,'14D','economy',1,0),(117,8,'15A','economy',1,0),(118,8,'15B','economy',1,0),(119,8,'15C','economy',1,0),(120,8,'15D','economy',1,0);
/*!40000 ALTER TABLE `seat_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userTest`
--

DROP TABLE IF EXISTS `userTest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userTest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userTest`
--

LOCK TABLES `userTest` WRITE;
/*!40000 ALTER TABLE `userTest` DISABLE KEYS */;
/*!40000 ALTER TABLE `userTest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'stelwing'
--

--
-- Dumping routines for database 'stelwing'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-11 14:19:43
