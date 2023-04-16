-- user
INSERT INTO AUTH VALUES(default, 'aaaa@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(1, 'san', 42, 'asdfasdf');

--user2
INSERT INTO AUTH VALUES(default, 'asdf@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(2, 'jiskim', 11, 'asdf');

-- user3
INSERT INTO AUTH VALUES(default, 'qwee@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(3, 'hannkim', 22, 'qwer');

-- user4
INSERT INTO AUTH VALUES(default, 'erty@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(4, 'nkim', 33, 'erty');

-- user5
INSERT INTO AUTH VALUES(default, 'rtyu@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(5, 'seungsle', 44, 'rtyu');

-- user6
INSERT INTO AUTH VALUES(default, 'dfgh@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(6, 'yongjule', 55, 'dfgh');

--
-- blocked_user
--
insert into blocked_user VALUES(1, 6);
insert into blocked_user VALUES(1, 5);
insert into blocked_user VALUES(1, 4);