-- user1
INSERT INTO AUTH VALUES(1, 'aaaa@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(1, 'san', 42, 'asdfasdf');

--user2
INSERT INTO AUTH VALUES(2, 'asdf@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(2, 'jiskim', 11, 'asdf');

-- user3
INSERT INTO AUTH VALUES(3, 'qwee@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(3, 'hannkim', 22, 'qwer');

-- user4
INSERT INTO AUTH VALUES(4, 'erty@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(4, 'nkim', 33, 'erty');

-- user5
INSERT INTO AUTH VALUES(5, 'rtyu@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(5, 'seungsle', 44, 'rtyu');

-- user6
INSERT INTO AUTH VALUES(6, 'dfgh@aaaa', NULL, 'UNREGISTERD');
insert into USERS values(6, 'yongjule', 55, 'dfgh');

--
-- blocked_user
--
insert into blocked_user VALUES(1, 6);
insert into blocked_user VALUES(1, 5);
insert into blocked_user VALUES(1, 4);