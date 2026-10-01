CREATE DATABASE EverLocker;
GO
USE EverLocker;
GO

CREATE TABLE Users(
  UserID INT IDENTITY(1,1) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(150) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  Role VARCHAR(20) NOT NULL DEFAULT 'user',
  CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Queries(
  QueryID INT IDENTITY(1,1) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(150) NOT NULL,
  Category VARCHAR(50) NOT NULL,
  Question NVARCHAR(MAX) NOT NULL,
  Reply NVARCHAR(MAX) NULL,
  Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
  RepliedAt DATETIME2 NULL
);

CREATE TABLE Documents(
  DocumentID INT IDENTITY(1,1) PRIMARY KEY,
  UserName VARCHAR(100) NOT NULL,
  DocumentType VARCHAR(50) NOT NULL,
  StoredFileName VARCHAR(255) NOT NULL,
  OriginalFileName VARCHAR(255) NOT NULL,
  UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE FAQs(
  FAQID INT IDENTITY(1,1) PRIMARY KEY,
  Question NVARCHAR(500) NOT NULL,
  Answer NVARCHAR(MAX) NOT NULL
);

CREATE TABLE QuizQuestions(
  QuestionID INT IDENTITY(1,1) PRIMARY KEY,
  Question NVARCHAR(500) NOT NULL,
  OptionA NVARCHAR(250) NOT NULL,
  OptionB NVARCHAR(250) NOT NULL,
  OptionC NVARCHAR(250) NOT NULL,
  OptionD NVARCHAR(250) NOT NULL,
  CorrectOption CHAR(1) NOT NULL
);

INSERT INTO FAQs(Question,Answer) VALUES
('What is DigiLocker?','DigiLocker is a Digital India platform for accessing, storing, sharing and verifying digital documents.'),
('What is the difference between issued and uploaded documents?','Issued documents come from integrated issuers. Uploaded documents are files uploaded by the user.'),
('What is a URI?','A URI is a Uniform Resource Identifier associated with an e-document in the DigiLocker ecosystem.');

INSERT INTO QuizQuestions(Question,OptionA,OptionB,OptionC,OptionD,CorrectOption) VALUES
('What is DigiLocker mainly used for?','Digital document access and sharing','Online gaming','Food delivery','Music streaming','A'),
('Which section contains documents issued by integrated organisations?','Issued Documents','Recycle Bin','Games','Settings','A'),
('What should you never post in an educational help form?','A general question','A dummy example','An OTP or password','A service category','C'),
('Which organisation operates the Aadhaar system?','UIDAI','DigiLocker College Club','RBI Games','ISRO Library','A'),
('What is the safest place to perform an actual government service?','A random link','The official government portal','A social-media comment','An unknown APK','B');
GO

-- After starting the Node backend, create the admin account by using the register API,
-- then change that user's Role to 'admin' with this query:
-- UPDATE Users SET Role='admin' WHERE Email='admin@everlocker.local';
