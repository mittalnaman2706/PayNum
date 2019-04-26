-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2019 at 02:49 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paynum`
--

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `Sender` bigint(20) DEFAULT NULL,
  `Reciever` bigint(20) DEFAULT NULL,
  `Amount` double(15,2) DEFAULT NULL,
  `Time` datetime DEFAULT CURRENT_TIMESTAMP,
  `TransactionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`Sender`, `Reciever`, `Amount`, `Time`, `TransactionID`) VALUES
(100000, 100000, 100.00, '2019-04-26 18:17:19', 75613249);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Account_Number` bigint(20) NOT NULL,
  `FName` varchar(12) NOT NULL,
  `LName` varchar(15) DEFAULT NULL,
  `E_Mail` varchar(35) DEFAULT NULL,
  `Phone` bigint(20) NOT NULL,
  `DOB` date DEFAULT NULL,
  `amount` double(15,2) DEFAULT '0.00',
  `UserName` varchar(20) NOT NULL,
  `Password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Account_Number`, `FName`, `LName`, `E_Mail`, `Phone`, `DOB`, `amount`, `UserName`, `Password`) VALUES
(100000, 'Paynum', 'Group', 'paynum.group@gmail.com', 103073, '2019-03-01', 235.00, 'paynum_123', 'b7c29d1b422a49b4ccc6b0342ab4f896479e0000d7cb201c01a24855c3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `Reciever` (`Reciever`),
  ADD KEY `Sender` (`Sender`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Account_Number`),
  ADD UNIQUE KEY `Phone` (`Phone`),
  ADD UNIQUE KEY `UserName` (`UserName`),
  ADD UNIQUE KEY `E_Mail` (`E_Mail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=756132565;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Account_Number` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100035;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`Reciever`) REFERENCES `users` (`Account_Number`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`Sender`) REFERENCES `users` (`Account_Number`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
