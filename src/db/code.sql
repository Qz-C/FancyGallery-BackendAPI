CREATE TABLE users (
  id SERIAL  NOT NULL ,
  email VARCHAR(255)   NOT NULL ,
  name VARCHAR(255)   NOT NULL ,
  password VARCHAR(255)   NOT NULL ,
  created_at TIMESTAMP    ,
  updated_at TIMESTAMP      ,
PRIMARY KEY(id, email));




CREATE TABLE photos (
  id SERIAL  NOT NULL ,
  url VARCHAR(255)   NOT NULL ,
  name VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  format VARCHAR (255) NOT NULL,
  users_email VARCHAR(255)   NOT NULL ,
  users_id INTEGER   NOT NULL ,
  created_at TIMESTAMP    ,
  updated_at TIMESTAMP      ,
PRIMARY KEY(id, url, name )  ,
  FOREIGN KEY(users_id, users_email)
    REFERENCES users(id, email));


CREATE INDEX photos_FKIndex1 ON photos (users_id, users_email);

CREATE INDEX IFK_Rel_01 ON photos (users_id, users_email);


