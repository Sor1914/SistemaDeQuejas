DROP TABLE Bitacora; 
DROP TABLE Detalle_Queja;
DROP TABLE Encabezado_Queja;
DROP TABLE Estado;
DROP TABLE Origen_Queja;
DROP TABLE Tipo_Queja;
DROP TABLE Usuario;
DROP TABLE Cargo; 
DROP TABLE Cuenta;
DROP TABLE Punto_Atencion; 
DROP TABLE Region; 
DROP TABLE Rol;  

Create database Quejas;
Use Quejas;

CREATE TABLE Rol(
	Id_Rol INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre_Rol VARCHAR(15),
	Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
	Usuario_Creo VARCHAR(20),
	Fecha_Modifico Datetime,
	Usuario_Modifico VARCHAR(20),
	Estado VARCHAR(1) DEFAULT 'A'
);

INSERT INTO Rol(Nombre_Rol, Estado, Usuario_Creo) VALUES ('ADMINISTRADOR', 'A', 'Sistema');
INSERT INTO Rol(Nombre_Rol, Estado, Usuario_Creo) VALUES ('CENTRALIZADOR', 'A', 'Sistema');
INSERT INTO Rol(Nombre_Rol, Estado, Usuario_Creo) VALUES ('RECEPTOR', 'A', 'Sistema');
INSERT INTO Rol(Nombre_Rol, Estado, Usuario_Creo) VALUES ('CUENTAHABIENTE', 'A', 'Sistema');
INSERT INTO Rol(Nombre_Rol, Estado, Usuario_Creo) VALUES ('CONSULTA', 'A', 'Sistema');


CREATE TABLE Cargo(
	Id_Area INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre_Cargo VARCHAR(15),
	Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
	Usuario_Creo VARCHAR(20),
	Fecha_Modifico Datetime,
	Usuario_Modifico VARCHAR(20),
	Estado VARCHAR(1) DEFAULT 'A'
);

INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('NOASIGNADO','A','Sistema');
INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('TITULAR','A','Sistema');
INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('SUPLENTE','A','Sistema');
INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('ENCARGADO','A','Sistema');
INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('JEFE INMEDIATO','A','Sistema');
INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('RECEP DE QUEJAS','A','Sistema');
INSERT INTO Cargo(Nombre_Cargo, Estado, Usuario_Creo) VALUES ('CENT DE QUEJAS','A','Sistema');

CREATE TABLE Cuenta(
	Id_Cuenta INT NOT NULL IDENTITY PRIMARY KEY,
	Tipo_Cuenta VARCHAR(3), 
	Numero_Cuenta VARCHAR(25),
	Estado VARCHAR(1) DEFAULT 'A'
);

INSERT INTO Cuenta(Tipo_Cuenta, Numero_Cuenta, Estado) VALUES('AHO','123','A');

CREATE TABLE Region(
	Id_Region INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre_Region VARCHAR(15),
	Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
	Usuario_Creo VARCHAR(20),
	Fecha_Modifico Datetime,
	Usuario_Modifico VARCHAR(20),
	Estado VARCHAR(1) DEFAULT 'A'
);

INSERT INTO Region(Nombre_Region, Estado, Usuario_Creo) VALUES ('CENTRAL', 'A','Sistema');
INSERT INTO Region(Nombre_Region, Estado, Usuario_Creo) VALUES ('SUR', 'A','Sistema');
INSERT INTO Region(Nombre_Region, Estado, Usuario_Creo) VALUES ('NORORIENTE', 'A','Sistema');
INSERT INTO Region(Nombre_Region, Estado, Usuario_Creo) VALUES ('OCCIDENTE', 'A','Sistema');

CREATE TABLE Punto_Atencion(
	Id_Punto_Atencion INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre_Punto_Atencion VARCHAR (50),
	Id_Region INT FOREIGN KEY REFERENCES Region(Id_Region),
	Estado VARCHAR(1) DEFAULT 'A'
);

INSERT INTO Punto_Atencion(Nombre_Punto_Atencion, Id_Region, Estado)
Values('NOASIGNADO', 1, 'A')
INSERT INTO Punto_Atencion(Nombre_Punto_Atencion, Id_Region, Estado)
Values('CENTRALIZADOR', 1, 'A')

CREATE TABLE Usuario(
     Id_Usuario int NOT NULL IDENTITY PRIMARY KEY,	 
	 Usuario VARCHAR(15),
	 Pass VARBINARY(MAX),
	 Nombres VARCHAR(20),
	 Apellidos VARCHAR(20),
	 Email VARCHAR(50),	 
	 Cui VARCHAR(15),
	 Departamento VARCHAR(15),
	 Id_Rol INT FOREIGN KEY REFERENCES Rol(Id_Rol),
	 Id_Cargo INT FOREIGN KEY REFERENCES Cargo(Id_Area),
	 Id_Punto_Atencion INT FOREIGN KEY REFERENCES Punto_Atencion(Id_Punto_Atencion),	 
	 Estado VARCHAR(1) DEFAULT 'A'
);

CREATE TABLE Tipo_Queja(
	Id_Tipo INT NOT NULL IDENTITY PRIMARY KEY,
	Siglas_Tipo VARCHAR(5),
	Nombre VARCHAR(50),	
	Correlativo INT,
	Estado VARCHAR(1) DEFAULT 'A'
);


INSERT INTO TIPO_QUEJA(Siglas_Tipo, NOMBRE, CORRELATIVO, ESTADO)
VALUES ('QMS', 'Queja por mal servicio', 0, 'A')

SELECT CORRELATIVO FROM Tipo_Queja
	
	
CREATE TABLE Origen_Queja(
	Id_Origen INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre VARCHAR(50),
    Estado VARCHAR(1) DEFAULT 'A'
);


insert into Origen_Queja(Nombre, Estado)
Values('Telefono', 1),
	('Correo', 1),
	('Chat', 1),
	('Presencial', 1),
	('Aplicación Móvil', 1),
	('Portal', 1)


CREATE TABLE Estado(
	Id_Estado INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre VARCHAR(20),
	Estado VARCHAR(1) DEFAULT 'A'
);

INSERT INTO ESTADO (NOMBRE, ESTADO)
VALUES ('Presentada', 1),
('Análisis', 1),
('No aplica', 1),
('En análisis', 1),
('Procedente', 1),
('No procedente', 1),
('Seguimiento', 1),
('Reanálisis', 1),
('Finalizada', 1),
('No aplica', 1);


CREATE TABLE Encabezado_Queja(
	Id_Encabezado INT NOT NULL IDENTITY PRIMARY KEY,
	Nombres VARCHAR(25),
	Apellidos VARCHAR(25),
	Email VARCHAR(50),
	Telefono VARCHAR(8),
	Usuario varchar(50),
	Detalle VARCHAR(1000),
	Id_Estado_Externo INT FOREIGN KEY REFERENCES Estado(Id_Estado),
	Id_Estado_Interno INT FOREIGN KEY REFERENCES Estado(Id_Estado),
	Fecha_Ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
	Id_Tipo INT FOREIGN KEY REFERENCES Tipo_Queja(Id_Tipo),
	Ingreso_Queja VARCHAR(20),
	Id_Origen INT FOREIGN KEY REFERENCES Origen_Queja(Id_Origen),
	Direccion_Archivo VARCHAR(100),
	JUSTIFICACION VARCHAR(1000),
	Id_Punto_Atencion INT FOREIGN KEY REFERENCES Punto_Atencion(Id_Punto_Atencion),
	Respuesta VARCHAR(100),
);
ALTER TABLE Encabezado_Queja
ADD Correlativo VARCHAR(20);


CREATE TABLE Detalle_Queja(
	Id_Detalle INT NOT NULL IDENTITY PRIMARY KEY,
	Id_Encabezado INT FOREIGN KEY REFERENCES Encabezado_Queja(Id_Encabezado),
	Comentario VARCHAR(1000),
	Direccion_Archivo VARCHAR(100),
	Fecha_Detalle DATETIME DEFAULT CURRENT_TIMESTAMP,
    Id_Usuario VARCHAR(30)
);

CREATE TABLE Bitacora(
	Id_Bitacora INT NOT NULL IDENTITY PRIMARY KEY,
	Nombre_Tabla VARCHAR(15),	
	Query VARCHAR(1000),
	Opcion VARCHAR(30),
	Usuario VARCHAR(15),	
	Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,		
);
INSERT INTO Usuario(Usuario, Pass, Nombres, Apellidos, Email, Cui, Departamento, Id_Rol, Id_Cargo, Id_Punto_Atencion, Estado)
VALUES ('JSOR',ENCRYPTBYPASSPHRASE('JS0R', 'Jonathansor' ),'Jonathan','Sor','Jonathansor2000sm@gmail.com','3034719480109','Guatemala',1,1,1,'A');

/*********************************************/


SELECT * FROM Encabezado_Queja

SELECT CONVERT(varchar(10), Encabezado_Queja.Fecha_Ingreso, 120) AS Fecha_Ingreso
FROM Encabezado_Queja;


SELECT Encabezado_Queja.Correlativo, Tipo_Queja.Nombre AS Nombre_Tipo_Queja, Nombre_Punto_Atencion,
ESTADO.Nombre AS Estado_Interno, ESTADO2.Nombre AS Estado_Externo, Encabezado_Queja.JUSTIFICACION, Encabezado_Queja.Detalle,
Origen_Queja.Nombre AS Nombre_Origen, Encabezado_Queja.Fecha_Ingreso
FROM Encabezado_Queja
INNER JOIN Tipo_Queja
	ON Encabezado_Queja.Id_Tipo = Tipo_Queja.Id_Tipo
INNER JOIN Punto_Atencion
	ON Punto_Atencion.Id_Punto_Atencion = Encabezado_Queja.Id_Punto_Atencion
INNER JOIN Estado
	ON ESTADO.Id_Estado = Encabezado_Queja.Id_Estado_Interno
INNER JOIN Estado Estado2
	ON Estado2.Id_Estado = Encabezado_Queja.Id_Estado_Externo
INNER JOIN Origen_Queja
	ON Encabezado_Queja.Id_Origen = Origen_Queja.Id_Origen }




	select * from Usuario

	select * from Punto_Atencion

	delete  usuario where Usuario = 'JSORM'

	SELECT COUNT(Id_Usuario) AS EXISTE FROM Usuario WHERE Usuario= 'JSORM' AND CAST(DECRYPTBYPASSPHRASE('JS0R',Pass) AS VARCHAR(MAX)) = 'Sor1906197912';


	SELECT Id_Encabezado, Correlativo, 
Fecha_Ingreso AS Fecha, Id_Estado_Interno, Estado.Nombre AS Estado_Interno, Encabezado_Queja.Detalle
FROM Encabezado_Queja 
INNER JOIN USUARIO
	ON Encabezado_Queja.Id_Punto_Atencion = USUARIO.Id_Punto_Atencion
INNER JOIN Estado
	ON Encabezado_Queja.Id_Estado_Interno = ESTADO.Id_Estado
WHERE Id_Estado_Externo = 4 AND Id_Estado_Interno IN (7) 
AND USUARIO.Usuario = 'JSOR'

Select * from Encabezado_Queja
INNER JOIN USUARIO
	ON Encabezado_Queja.Id_Punto_Atencion = USUARIO.Id_Punto_Atencion
	INNER JOIN Estado
	ON Encabezado_Queja.Id_Estado_Interno = ESTADO.Id_Estado
